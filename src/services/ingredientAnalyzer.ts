import {
  IngredientSafetyAnalysis,
  IngredientItem,
  ProductCategory
} from '../types/inspection';
import { HARMFUL_INGREDIENTS_DB, KnownAdditiveRule } from '../data/harmfulIngredientsDB';

/**
 * Extracts raw ingredient string from OCR text block
 */
export function extractRawIngredientsBlock(text: string): string | null {
  if (!text) return null;

  // Look for explicit "Ingredients:", "Contains:", "सामग्री:", "Composition:"
  const patterns = [
    /(?:ingredients|ingredients\s*used|composition|सामग्री)\s*[:.\-]?\s*([^\n\r]+(?:\n[^\n\r]+){0,8})/i,
    /(?:contains|allergic\s*information)\s*[:.\-]?\s*([^\n\r]+)/i
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const block = match[1].trim();
      if (block.length > 5) {
        // Stop if hitting another section header
        const cleanBlock = block.split(/(?:mfg|mfd|packed|mrp|best\s*before|exp\b|expiry|fssai|marketed|customer\s*care|storage\s*condition|nutrition|lic\s*no)/i)[0].trim();
        if (cleanBlock.length > 3) {
          return cleanBlock;
        }
      }
    }
  }

  return null;
}

/**
 * Analyzes packaging ingredients for harmful chemicals, INS E-numbers, trans fats, and allergens.
 */
export function analyzeIngredients(
  rawText: string,
  category: ProductCategory = 'FOOD'
): IngredientSafetyAnalysis {
  const ingredientsBlock = extractRawIngredientsBlock(rawText);

  // If no ingredients declaration was found on the image, return CLEAN non-detected state
  if (!ingredientsBlock) {
    return {
      hasIngredientsDeclared: false,
      rawIngredientsText: '',
      totalIngredientsCount: 0,
      harmfulCount: 0,
      cautionCount: 0,
      safeCount: 0,
      healthSafetyScore: 100,
      healthRating: 'CLEAN',
      harmfulIngredients: [],
      cautionIngredients: [],
      safeIngredients: [],
      allDetectedIngredients: [],
      allergensDetected: [],
      consumerAdviceEn: 'No ingredients list detected on this scanned packaging surface.',
      consumerAdviceHi: 'इस सतह पर सामग्री (Ingredients) सूची नहीं मिली।'
    };
  }

  const lowerBlock = ingredientsBlock.toLowerCase();

  // Tokenize ingredients from the actual ingredient block only
  const rawTokens = ingredientsBlock
    .split(/[,;\n•·|]|\band\b/i)
    .map(t => t.replace(/[()[\]{}]/g, ' ').replace(/\s+/g, ' ').trim())
    .filter(t => t.length > 2 && !/^(?:ingredients|contains|used|composition|all|of|with|and)$/i.test(t));

  const matchedRules: Set<KnownAdditiveRule> = new Set();

  // Match tokens against harmful ingredients database
  for (const rule of HARMFUL_INGREDIENTS_DB) {
    // 1. Check INS / E codes strictly (MUST require 'ins', 'e', 'e-', or 'ins-' prefix)
    if (rule.insCodes) {
      for (const ins of rule.insCodes) {
        const insRegex = new RegExp(`\\b(?:ins|e|ins-|e-)\\s*[:.\-]?\\s*${ins}\\b`, 'i');
        if (insRegex.test(lowerBlock)) {
          matchedRules.add(rule);
          break;
        }
      }
    }

    // 2. Check textual keywords with boundary checks within the ingredient block
    if (!matchedRules.has(rule)) {
      for (const kw of rule.keywords) {
        const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const kwRegex = new RegExp(`\\b${escaped}\\b`, 'i');
        if (kwRegex.test(lowerBlock)) {
          matchedRules.add(rule);
          break;
        }
      }
    }
  }

  const allDetectedIngredients: IngredientItem[] = [];
  const harmfulIngredients: IngredientItem[] = [];
  const cautionIngredients: IngredientItem[] = [];
  const safeIngredients: IngredientItem[] = [];
  const allergensDetected: string[] = [];

  matchedRules.forEach(rule => {
    const item: IngredientItem = {
      name: rule.canonicalNameEn,
      matchedName: rule.keywords[0],
      insCode: rule.insCodes?.[0],
      hazardLevel: rule.hazardLevel,
      category: rule.category,
      healthRiskEn: rule.healthRiskEn,
      healthRiskHi: rule.healthRiskHi,
      isAllergen: rule.isAllergen,
      allergenType: rule.allergenType,
      fssaiRegulationNote: rule.fssaiRegulationNote
    };

    allDetectedIngredients.push(item);

    if (rule.hazardLevel === 'HARMFUL') {
      harmfulIngredients.push(item);
    } else if (rule.hazardLevel === 'CAUTION') {
      cautionIngredients.push(item);
    } else if (rule.hazardLevel === 'SAFE') {
      safeIngredients.push(item);
    }

    if (rule.isAllergen && rule.allergenType && !allergensDetected.includes(rule.allergenType)) {
      allergensDetected.push(rule.allergenType);
    }
  });

  // Calculate Health Safety Score (0-100)
  let score = 100;
  score -= (harmfulIngredients.length * 25);
  score -= (cautionIngredients.length * 10);
  score = Math.max(10, Math.min(100, score));

  // Determine Rating
  let healthRating: 'CLEAN' | 'MODERATE' | 'POOR_NUTRITION' | 'ULTRA_PROCESSED_HARMFUL' = 'CLEAN';
  if (score < 40 || harmfulIngredients.length >= 2) {
    healthRating = 'ULTRA_PROCESSED_HARMFUL';
  } else if (score < 65 || harmfulIngredients.length === 1) {
    healthRating = 'POOR_NUTRITION';
  } else if (score < 85 || cautionIngredients.length >= 1) {
    healthRating = 'MODERATE';
  } else {
    healthRating = 'CLEAN';
  }

  // Generate Consumer Advice
  let adviceEn = '';
  let adviceHi = '';

  if (harmfulIngredients.length > 0) {
    const harmfulNames = harmfulIngredients.map(h => h.name.split('(')[0].trim()).join(', ');
    adviceEn = `⚠️ CAUTION: Contains high-risk ingredients (${harmfulNames}). Not recommended for regular daily consumption by children or individuals with cardiovascular/metabolic risks.`;
    adviceHi = `⚠️ चेतावनी: इसमें उच्च जोखिम वाले तत्व (${harmfulNames}) पाए गए हैं। बच्चों या हृदय/डायबिटीज रोगियों के लिए नियमित सेवन हानिकारक हो सकता है।`;
  } else if (cautionIngredients.length > 0) {
    adviceEn = `ℹ️ MODERATE PROCESSING: Contains flavor enhancers/refined carbohydrates. Consume in moderation as part of a balanced diet.`;
    adviceHi = `ℹ️ मध्यम प्रोसेस्ड: इसमें मैदा/फ्लेवर एन्हांसर मौजूद हैं। संतुलित आहार के हिस्से के रूप में सीमित मात्रा में लें।`;
  } else {
    adviceEn = `✅ CLEAN PROFILE: No dangerous chemical dyes, trans fats, or high-risk synthetic preservatives detected.`;
    adviceHi = `✅ सुरक्षित प्रोफाइल: कोई हानिकारक कृत्रिम रंग, ट्रांस फैट या खतरनाक प्रिजर्वेटिव नहीं मिला।`;
  }

  if (allergensDetected.length > 0) {
    adviceEn += ` Allergen Alert: Contains ${allergensDetected.join(', ')}.`;
    adviceHi += ` एलर्जी चेतावनी: इसमें ${allergensDetected.join(', ')} शामिल है।`;
  }

  return {
    hasIngredientsDeclared: true,
    rawIngredientsText: ingredientsBlock || 'Extracted from packaging text',
    totalIngredientsCount: Math.max(rawTokens.length, allDetectedIngredients.length),
    harmfulCount: harmfulIngredients.length,
    cautionCount: cautionIngredients.length,
    safeCount: safeIngredients.length,
    healthSafetyScore: score,
    healthRating,
    harmfulIngredients,
    cautionIngredients,
    safeIngredients,
    allDetectedIngredients,
    allergensDetected,
    consumerAdviceEn: adviceEn,
    consumerAdviceHi: adviceHi
  };
}
