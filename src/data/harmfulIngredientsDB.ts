import { IngredientHazardLevel, IngredientCategory } from '../types/inspection';

export interface KnownAdditiveRule {
  id: string;
  keywords: string[]; // Match keywords in lower case
  insCodes?: string[]; // INS / E numbers (e.g. "102", "INS 102", "E102")
  canonicalNameEn: string;
  canonicalNameHi: string;
  hazardLevel: IngredientHazardLevel;
  category: IngredientCategory;
  healthRiskEn: string;
  healthRiskHi: string;
  isAllergen: boolean;
  allergenType?: string;
  fssaiRegulationNote?: string;
}

export const HARMFUL_INGREDIENTS_DB: KnownAdditiveRule[] = [
  // ─── 1. HARMFUL FATS & OILS (पाम ऑयल व ट्रांस फैट्स) ─────────────────────────
  {
    id: 'fat-palm-oil',
    keywords: ['palm oil', 'palmolein', 'palm olein', 'fractionated palm oil', 'refined palm oil', 'palmolein oil', 'palm kernel oil'],
    canonicalNameEn: 'Palm Oil / Palmolein',
    canonicalNameHi: 'पाम ऑयल / पॉमोलिन तेल',
    hazardLevel: 'HARMFUL',
    category: 'FAT_OIL',
    healthRiskEn: 'Contains ~50% saturated fat. Highly linked to LDL cholesterol elevation, arterial plaque buildup, and coronary heart disease risk.',
    healthRiskHi: 'इसमें लगभग 50% सेचुरेटेड फैट होता है जो खराब कोलेस्ट्रॉल (LDL) को बढ़ाता है और दिल की बीमारियों का खतरा पैदा करता है।',
    isAllergen: false,
    fssaiRegulationNote: 'FSSAI limits total polar compounds and mandates clear labeling.'
  },
  {
    id: 'fat-trans-hydrogenated',
    keywords: ['hydrogenated vegetable oil', 'hydrogenated fat', 'partially hydrogenated', 'vanaspati', 'trans fat', 'shortening', 'margarine'],
    canonicalNameEn: 'Hydrogenated Vegetable Oil (Trans Fat)',
    canonicalNameHi: 'हाइड्रोजिनेटेड वनस्पति तेल (ट्रांस फैट)',
    hazardLevel: 'HARMFUL',
    category: 'FAT_OIL',
    healthRiskEn: 'Source of industrial Trans Fats. WHO recommends 0% consumption due to severe risk of stroke, heart attack, and systemic inflammation.',
    healthRiskHi: 'यह औद्योगिक ट्रांस फैट का मुख्य स्रोत है। WHO के अनुसार यह धमनियों को ब्लॉक कर दिल के दौरे व स्ट्रोक का खतरा बढ़ाता है।',
    isAllergen: false,
    fssaiRegulationNote: 'FSSAI cap: Industrial trans fat must not exceed 2% by weight.'
  },

  // ─── 2. ARTIFICIAL FOOD DYES & COLORS (हानिकारक कृत्रिम रंग) ─────────────────
  {
    id: 'color-ins-102',
    keywords: ['tartrazine', 'ins 102', 'e102', 'ins102', 'yellow 5', 'ci 19140', 'food yellow 4'],
    insCodes: ['102', 'INS 102', 'E102', 'INS102'],
    canonicalNameEn: 'Tartrazine (INS 102 / Yellow 5)',
    canonicalNameHi: 'टार्ट्राज़िन पीला रंग (INS 102)',
    hazardLevel: 'HARMFUL',
    category: 'COLOR',
    healthRiskEn: 'Synthetic azo dye. Clinically linked to hyperactivity, ADHD symptoms in children, severe urticaria (hives), and asthma triggers.',
    healthRiskHi: 'सिंथेटिक रंग। बच्चों में चिड़चिड़ापन/हाइपरएक्टिविटी (ADHD), त्वचा पर चकत्ते (एलर्जी) और सांस की तकलीफ से जुड़ा है।',
    isAllergen: false,
    fssaiRegulationNote: 'FSSAI mandates warning: "CONTAINS PERMITTED SYNTHETIC FOOD COLOUR".'
  },
  {
    id: 'color-ins-110',
    keywords: ['sunset yellow', 'sunset yellow fcf', 'ins 110', 'e110', 'ins110', 'yellow 6', 'ci 15985'],
    insCodes: ['110', 'INS 110', 'E110', 'INS110'],
    canonicalNameEn: 'Sunset Yellow FCF (INS 110 / Yellow 6)',
    canonicalNameHi: 'सनसेट येलो (INS 110)',
    hazardLevel: 'HARMFUL',
    category: 'COLOR',
    healthRiskEn: 'Azo dye associated with childhood behavioral disorders, gastrointestinal intolerance, and allergic flare-ups in aspirin-sensitive people.',
    healthRiskHi: 'सिंथेटिक डाई जो बच्चों के व्यवहार में अशांति, पेट की गड़बड़ी और एलर्जी का कारण बन सकती है।',
    isAllergen: false
  },
  {
    id: 'color-ins-122',
    keywords: ['carmoisine', 'azorubine', 'ins 122', 'e122', 'ins122', 'ci 14720'],
    insCodes: ['122', 'INS 122', 'E122', 'INS122'],
    canonicalNameEn: 'Carmoisine / Azorubine (INS 122)',
    canonicalNameHi: 'कारमोइसिन लाल रंग (INS 122)',
    hazardLevel: 'HARMFUL',
    category: 'COLOR',
    healthRiskEn: 'Red coal-tar derivative dye banned in USA & Canada. Triggers severe allergic reactions and behavioral hyperactivity in kids.',
    healthRiskHi: 'कोयला-तार आधारित लाल रंग जो अमेरिका और कनाडा में प्रतिबंधित है। बच्चों में एलर्जी और हाइपरएक्टिविटी बढ़ाता है।',
    isAllergen: false
  },
  {
    id: 'color-ins-124',
    keywords: ['ponceau 4r', 'cochineal red a', 'ins 124', 'e124', 'ins124', 'ci 16255'],
    insCodes: ['124', 'INS 124', 'E124', 'INS124'],
    canonicalNameEn: 'Ponceau 4R (INS 124)',
    canonicalNameHi: 'पोंस्यू 4R (INS 124)',
    hazardLevel: 'HARMFUL',
    category: 'COLOR',
    healthRiskEn: 'Synthetic red colorant linked to histamine release, worsening asthma symptoms, and pediatric attention deficits.',
    healthRiskHi: 'सिंथेटिक लाल रंग जो अस्थमा के लक्षणों को बढ़ा सकता है और बच्चों के ध्यान भटकाव (ADHD) का कारण बनता है।',
    isAllergen: false
  },
  {
    id: 'color-ins-129',
    keywords: ['allura red', 'allura red ac', 'ins 129', 'e129', 'ins129', 'red 40', 'ci 16035'],
    insCodes: ['129', 'INS 129', 'E129', 'INS129'],
    canonicalNameEn: 'Allura Red AC (INS 129 / Red 40)',
    canonicalNameHi: 'अल्यूरा रेड (INS 129)',
    hazardLevel: 'HARMFUL',
    category: 'COLOR',
    healthRiskEn: 'Petroleum-based dye shown in studies to trigger gut inflammation, inflammatory bowel disease (IBD) risk, and hyperactivity.',
    healthRiskHi: 'पेट्रोलियम आधारित डाई जो आंतों में सूजन (IBD) और बच्चों में चिड़चिड़ापन पैदा करने के लिए जानी जाती है।',
    isAllergen: false
  },
  {
    id: 'color-ins-133',
    keywords: ['brilliant blue', 'brilliant blue fcf', 'ins 133', 'e133', 'ins133', 'blue 1', 'ci 42090'],
    insCodes: ['133', 'INS 133', 'E133', 'INS133'],
    canonicalNameEn: 'Brilliant Blue FCF (INS 133 / Blue 1)',
    canonicalNameHi: 'ब्रिलियंट ब्लू (INS 133)',
    hazardLevel: 'HARMFUL',
    category: 'COLOR',
    healthRiskEn: 'Synthetic triarylmethane dye associated with chromosomal damage in cell cultures and hypersensitivity reactions.',
    healthRiskHi: 'सिंथेटिक नीला रंग जो एलर्जी और कोशिकाओं पर प्रतिकूल प्रभाव के लिए जाँचा गया है।',
    isAllergen: false
  },
  {
    id: 'color-ins-171',
    keywords: ['titanium dioxide', 'ins 171', 'e171', 'ins171', 'ci 77891'],
    insCodes: ['171', 'INS 171', 'E171', 'INS171'],
    canonicalNameEn: 'Titanium Dioxide (INS 171)',
    canonicalNameHi: 'टाइटेनियम डाइऑक्साइड (INS 171)',
    hazardLevel: 'HARMFUL',
    category: 'COLOR',
    healthRiskEn: 'White pigment banned in European Union (EU) due to concerns regarding DNA damage, genotoxicity, and nanoparticle accumulation.',
    healthRiskHi: 'यूरोपीय संघ (EU) में पूरी तरह प्रतिबंधित। यह डीएनए को नुकसान (जीनोटॉक्सिसिटी) पहुंचाने वाला माना जाता है।',
    isAllergen: false
  },

  // ─── 3. HARMFUL PRESERVATIVES & CHEMICAL ANTIOXIDANTS ────────────────────────
  {
    id: 'pres-ins-320',
    keywords: ['butylated hydroxyanisole', 'bha', 'ins 320', 'e320', 'ins320'],
    insCodes: ['320', 'INS 320', 'E320', 'INS320'],
    canonicalNameEn: 'BHA / Butylated Hydroxyanisole (INS 320)',
    canonicalNameHi: 'BHA प्रिजर्वेटिव (INS 320)',
    hazardLevel: 'HARMFUL',
    category: 'PRESERVATIVE',
    healthRiskEn: 'Classified as "reasonably anticipated to be a human carcinogen" by NIH. Known endocrine disruptor affecting thyroid and sex hormones.',
    healthRiskHi: 'संभावित कैंसरकारी व हार्मोनल असंतुलन (एंडोक्राइन डिसरप्टर) पैदा करने वाला रासायनिक प्रिजर्वेटिव।',
    isAllergen: false
  },
  {
    id: 'pres-ins-321',
    keywords: ['butylated hydroxytoluene', 'bht', 'ins 321', 'e321', 'ins321'],
    insCodes: ['321', 'INS 321', 'E321', 'INS321'],
    canonicalNameEn: 'BHT / Butylated Hydroxytoluene (INS 321)',
    canonicalNameHi: 'BHT प्रिजर्वेटिव (INS 321)',
    hazardLevel: 'HARMFUL',
    category: 'PRESERVATIVE',
    healthRiskEn: 'Synthetic antioxidant linked to liver enlargement, lung tissue damage in animal models, and estrogenic hormonal interference.',
    healthRiskHi: 'सिंथेटिक केमिकल जो लीवर व फेफड़ों पर दबाव डालता है और हार्मोनल संतुलन बिगाड़ सकता है।',
    isAllergen: false
  },
  {
    id: 'pres-ins-211',
    keywords: ['sodium benzoate', 'ins 211', 'e211', 'ins211', 'benzoate of soda'],
    insCodes: ['211', 'INS 211', 'E211', 'INS211'],
    canonicalNameEn: 'Sodium Benzoate (INS 211)',
    canonicalNameHi: 'सोडियम बेंजोएट (INS 211)',
    hazardLevel: 'CAUTION',
    category: 'PRESERVATIVE',
    healthRiskEn: 'When combined with Ascorbic Acid (Vitamin C), it can form Benzene, a known potent carcinogen. Triggers asthma attacks.',
    healthRiskHi: 'विटामिन-सी के साथ मिलकर यह बेंजीन (कैंसरकारी तत्व) बना सकता है। अस्थमा के मरीजों के लिए नुकसानदेह।',
    isAllergen: false
  },
  {
    id: 'pres-ins-250',
    keywords: ['sodium nitrite', 'ins 250', 'e250', 'ins250', 'potassium nitrite', 'ins 249', 'e249'],
    insCodes: ['250', 'INS 250', 'E250', '249', 'INS 249'],
    canonicalNameEn: 'Sodium Nitrite (INS 250)',
    canonicalNameHi: 'सोडियम नाइट्राइट (INS 250)',
    hazardLevel: 'HARMFUL',
    category: 'PRESERVATIVE',
    healthRiskEn: 'Forms carcinogenic Nitrosamines in stomach acid. Strongly linked by WHO (IARC) to colorectal cancer in processed meats.',
    healthRiskHi: 'पेट के एसिड में नाइट्रोसामाइन (कैंसरकारी पदार्थ) बनाता है। आंतों के कैंसर के खतरे से जुड़ा है।',
    isAllergen: false
  },

  // ─── 4. FLAVOR ENHANCERS & HIDDEN MSG (फ्लेवर एन्हांसर्स) ─────────────────────
  {
    id: 'flavor-ins-621',
    keywords: ['monosodium glutamate', 'msg', 'ins 621', 'e621', 'ins621', 'ajinomoto', 'glutamate'],
    insCodes: ['621', 'INS 621', 'E621', 'INS621'],
    canonicalNameEn: 'Monosodium Glutamate / MSG (INS 621)',
    canonicalNameHi: 'मोनोसोडियम ग्लूटामेट / अजीनोमोटो (INS 621)',
    hazardLevel: 'CAUTION',
    category: 'FLAVOR_ENHANCER',
    healthRiskEn: 'Excitotoxin. Triggers headaches, numbness, rapid heart rate, flushing, and sweating in MSG-sensitive individuals.',
    healthRiskHi: 'अजीनोमोटो। संवेदनशील लोगों में सिरदर्द, बेचैनी, धड़कन तेज होना और एलर्जी के लक्षण पैदा कर सकता है।',
    isAllergen: false,
    fssaiRegulationNote: 'Prohibited in food for infants below 12 months.'
  },
  {
    id: 'flavor-ins-627-631',
    keywords: ['disodium guanylate', 'ins 627', 'e627', 'ins627', 'disodium inosinate', 'ins 631', 'e631', 'ins631', 'disodium 5-ribonucleotides', 'ins 635', 'e635'],
    insCodes: ['627', '631', '635', 'INS 627', 'INS 631', 'INS 635', 'E627', 'E631'],
    canonicalNameEn: 'Flavor Enhancers 627 & 631 (Guanylate / Inosinate)',
    canonicalNameHi: 'फ्लेवर एन्हांसर (INS 627, 631)',
    hazardLevel: 'CAUTION',
    category: 'FLAVOR_ENHANCER',
    healthRiskEn: 'High-purine additives. Breaks down into uric acid, posing high risk of gout attacks and kidney stones in prone individuals.',
    healthRiskHi: 'यूरिक एसिड बढ़ाने वाले तत्व। गाउट (गठिया) व किडनी स्टोन के मरीजों के लिए हानिकारक।',
    isAllergen: false
  },

  // ─── 5. ARTIFICIAL SWEETENERS & DAMAGING SUGARS (मीठा व हानिकारक सिरप) ─────────
  {
    id: 'sweetener-hfcs',
    keywords: ['high fructose corn syrup', 'hfcs', 'liquid glucose', 'invert sugar syrup', 'fructose syrup', 'corn syrup'],
    canonicalNameEn: 'High Fructose Corn Syrup (HFCS) / Liquid Glucose',
    canonicalNameHi: 'हाई फ्रुक्टोज कॉर्न सिरप / लिक्विड ग्लूकोज',
    hazardLevel: 'HARMFUL',
    category: 'SWEETENER',
    healthRiskEn: 'Directly metabolized by liver into visceral fat. Strong primary driver of Non-Alcoholic Fatty Liver Disease (NAFLD), obesity, and Type 2 Diabetes.',
    healthRiskHi: 'लीवर में सीधे चर्बी (फैटी लीवर) जमा करता है। टाइप-2 डायबिटीज और मोटापे का सबसे बड़ा कारण।',
    isAllergen: false
  },
  {
    id: 'sweetener-ins-951',
    keywords: ['aspartame', 'ins 951', 'e951', 'ins951', 'nutrasweet', 'equal'],
    insCodes: ['951', 'INS 951', 'E951', 'INS951'],
    canonicalNameEn: 'Aspartame (INS 951)',
    canonicalNameHi: 'एस्पार्टेम कृत्रिम स्वीटनर (INS 951)',
    hazardLevel: 'HARMFUL',
    category: 'SWEETENER',
    healthRiskEn: 'Classified by WHO IARC as "possibly carcinogenic to humans (Group 2B)". Hazardous for individuals with phenylketonuria (PKU).',
    healthRiskHi: 'WHO द्वारा संभावित कैंसरकारी श्रेणी (2B) में सूचीबद्ध। फेनिलकेटोन्यूरिया (PKU) वाले लोगों के लिए वर्जित।',
    isAllergen: false,
    fssaiRegulationNote: 'Mandatory statutory label: "NOT RECOMMENDED FOR CHILDREN. CONTAINS PHENYLALANINE".'
  },
  {
    id: 'sweetener-ins-950',
    keywords: ['acesulfame potassium', 'acesulfame k', 'ins 950', 'e950', 'ins950', 'ace-k'],
    insCodes: ['950', 'INS 950', 'E950', 'INS950'],
    canonicalNameEn: 'Acesulfame Potassium / Ace-K (INS 950)',
    canonicalNameHi: 'एसेसल्फेम के (INS 950)',
    hazardLevel: 'HARMFUL',
    category: 'SWEETENER',
    healthRiskEn: 'Contains methylene chloride (a known carcinogen byproduct). Disrupts metabolic gut microbiome and insulin sensitivity.',
    healthRiskHi: 'आंतों के अच्छे बैक्टीरिया को नष्ट करता है और इंसुलिन प्रतिरोध (शुगर) को बिगाड़ता है।',
    isAllergen: false
  },
  {
    id: 'sweetener-ins-955',
    keywords: ['sucralose', 'ins 955', 'e955', 'ins955', 'splenda'],
    insCodes: ['955', 'INS 955', 'E955', 'INS955'],
    canonicalNameEn: 'Sucralose (INS 955)',
    canonicalNameHi: 'सुक्रालोज़ (INS 955)',
    hazardLevel: 'CAUTION',
    category: 'SWEETENER',
    healthRiskEn: 'High doses shown to damage gut microbiome diversity and release chloropropanols when baked at high heat.',
    healthRiskHi: 'पेट के माइक्रोबायोम को प्रभावित कर सकता है। अत्यधिक तापमान पर पकाने से विषैले तत्व निकलते हैं।',
    isAllergen: false
  },

  // ─── 6. HARMFUL EMULSIFIERS & THICKENERS (इमल्सीफायर्स) ──────────────────────
  {
    id: 'emul-ins-407',
    keywords: ['carrageenan', 'ins 407', 'e407', 'ins407', 'irish moss extract'],
    insCodes: ['407', 'INS 407', 'E407', 'INS407'],
    canonicalNameEn: 'Carrageenan (INS 407)',
    canonicalNameHi: 'कैरेजीनन (INS 407)',
    hazardLevel: 'HARMFUL',
    category: 'EMULSIFIER',
    healthRiskEn: 'Degrades in gastrointestinal tract into poligeenan, triggering chronic intestinal inflammation, colitis, and ulcerations.',
    healthRiskHi: 'आंतों में सूजन (Colitis), पेट में जलन और अल्सर पैदा करने वाला थिकनर।',
    isAllergen: false
  },
  {
    id: 'emul-ins-471',
    keywords: ['mono and diglycerides of fatty acids', 'ins 471', 'e471', 'ins471', 'monoglycerides', 'diglycerides', 'distilled monoglycerides'],
    insCodes: ['471', 'INS 471', 'E471', 'INS471'],
    canonicalNameEn: 'Mono- and Diglycerides of Fatty Acids (INS 471)',
    canonicalNameHi: 'फैटी एसिड्स के मोनो व डाइग्लिसराइड्स (INS 471)',
    hazardLevel: 'CAUTION',
    category: 'EMULSIFIER',
    healthRiskEn: 'Frequently derived from low-grade palm oil or animal tallow; often carries hidden unlabelled trans fatty acids.',
    healthRiskHi: 'अक्सर सस्ते पाम ऑयल से बना होता है और इसमें अघोषित ट्रांस फैट की संभावना होती है।',
    isAllergen: false
  },

  // ─── 7. REFINED GRAINS (मैदा / रिफाइंड सामग्री) ──────────────────────────────
  {
    id: 'refined-maida',
    keywords: ['refined wheat flour', 'maida', 'bleached flour', 'all purpose flour', 'wheat flour (maida)'],
    canonicalNameEn: 'Refined Wheat Flour (Maida)',
    canonicalNameHi: 'मैदा / रिफाइंड गेहूं का आटा',
    hazardLevel: 'CAUTION',
    category: 'NATURAL',
    healthRiskEn: 'Stripped of dietary fiber, bran, and essential micronutrients. Causes rapid spike in blood glucose levels (High Glycemic Index).',
    healthRiskHi: 'फाइबर रहित रिफाइंड आटा। ब्लड शुगर को तेजी से बढ़ाता है और पाचन तंत्र को धीमा करता है।',
    isAllergen: true,
    allergenType: 'Gluten (Wheat)'
  },

  // ─── 8. MAJOR ALLERGENS (प्रमुख एलर्जी तत्व) ──────────────────────────────────
  {
    id: 'allergen-soy',
    keywords: ['soy lecithin', 'ins 322', 'e322', 'soya lecithin', 'soy protein', 'soy', 'soya', 'soybean'],
    insCodes: ['322', 'INS 322', 'E322'],
    canonicalNameEn: 'Soy / Soya Lecithin (INS 322)',
    canonicalNameHi: 'सोया / सोया लेसिथिन (INS 322)',
    hazardLevel: 'SAFE',
    category: 'ALLERGEN',
    healthRiskEn: 'Generally safe natural emulsifier, but major allergen for soy-sensitive individuals.',
    healthRiskHi: 'सुरक्षित इमल्सीफायर, लेकिन सोया एलर्जी वाले व्यक्तियों के लिए हानिकारक।',
    isAllergen: true,
    allergenType: 'Soy / Soya'
  },
  {
    id: 'allergen-gluten',
    keywords: ['gluten', 'wheat', 'barley', 'rye', 'malt', 'semolina', 'suji', 'rawa'],
    canonicalNameEn: 'Gluten (Wheat / Barley)',
    canonicalNameHi: 'ग्लूटेन (गेहूं / जौ)',
    hazardLevel: 'SAFE',
    category: 'ALLERGEN',
    healthRiskEn: 'Essential allergen declaration. Triggers autoimmune celiac disease and non-celiac gluten sensitivity.',
    healthRiskHi: 'सीलिएक रोग (Celiac Disease) व ग्लूटेन एलर्जी वाले लोगों के लिए गंभीर नुकसानदेह।',
    isAllergen: true,
    allergenType: 'Gluten (Wheat)'
  },
  {
    id: 'allergen-milk-lactose',
    keywords: ['milk solids', 'whey protein', 'lactose', 'casein', 'skimmed milk powder', 'butter', 'cheese', 'milk'],
    canonicalNameEn: 'Milk Solids / Lactose',
    canonicalNameHi: 'दूध के तत्व / लैक्टोज',
    hazardLevel: 'SAFE',
    category: 'ALLERGEN',
    healthRiskEn: 'Nutritious dairy ingredient, but triggers lactose intolerance and dairy protein allergies.',
    healthRiskHi: 'पोषक तत्व, परंतु लैक्टोज इनटॉलरेंस वाले लोगों में पेट दर्द व गैस पैदा करता है।',
    isAllergen: true,
    allergenType: 'Milk / Dairy (Lactose)'
  },
  {
    id: 'allergen-nuts',
    keywords: ['peanut', 'peanuts', 'groundnut', 'almond', 'cashew', 'walnut', 'pistachio', 'tree nuts'],
    canonicalNameEn: 'Peanuts & Tree Nuts',
    canonicalNameHi: 'मूंगफली व मेवे (नट्स)',
    hazardLevel: 'SAFE',
    category: 'ALLERGEN',
    healthRiskEn: 'Severe anaphylaxis allergen for sensitized consumers. Mandatory statutory declaration.',
    healthRiskHi: 'अत्यधिक गंभीर एनाफिलेक्सिस एलर्जी का कारण बन सकता है।',
    isAllergen: true,
    allergenType: 'Peanuts / Tree Nuts'
  },
  {
    id: 'pres-sulphites',
    keywords: ['sulphites', 'sulfites', 'sulphur dioxide', 'ins 220', 'ins 221', 'ins 222', 'ins 223', 'ins 224', 'e220', 'e223', 'sodium metabisulphite'],
    insCodes: ['220', '221', '222', '223', '224', 'INS 220', 'INS 223', 'E220', 'E223'],
    canonicalNameEn: 'Sulphites / Sodium Metabisulphite (INS 220-224)',
    canonicalNameHi: 'सल्फाइट्स प्रिजर्वेटिव (INS 220-224)',
    hazardLevel: 'CAUTION',
    category: 'PRESERVATIVE',
    healthRiskEn: 'Preservative causing severe bronchospasms, acute asthma attacks, and flushing.',
    healthRiskHi: 'अस्थमा के मरीजों में गंभीर सांस की नली का सिकुड़ना (ब्रोंकोस्पाज्म) पैदा करता है।',
    isAllergen: true,
    allergenType: 'Sulphites'
  },

  // ─── 9. SAFE / BENEFICIAL INGREDIENTS (सुरक्षित व स्वास्थ्यवर्धक तत्व) ──────────
  {
    id: 'safe-whole-wheat',
    keywords: ['whole wheat flour', 'atta', 'whole grain', 'whole wheat', 'oats', 'rolled oats', 'ragi', 'millet', 'jowar', 'bajra'],
    canonicalNameEn: 'Whole Grains (Atta / Oats / Millets)',
    canonicalNameHi: 'साबुत अनाज (आटा / ओट्स / मिलेट्स)',
    hazardLevel: 'SAFE',
    category: 'NATURAL',
    healthRiskEn: 'Rich in dietary fiber, B-vitamins, and complex carbohydrates for sustained glycemic balance.',
    healthRiskHi: 'फाइबर और बी-विटामिन से भरपूर, आंतों व शुगर नियंत्रण के लिए उत्तम।',
    isAllergen: false
  },
  {
    id: 'safe-ins-300',
    keywords: ['ascorbic acid', 'vitamin c', 'ins 300', 'e300', 'ins300'],
    insCodes: ['300', 'INS 300', 'E300'],
    canonicalNameEn: 'Ascorbic Acid / Vitamin C (INS 300)',
    canonicalNameHi: 'एस्कॉर्बिक एसिड / विटामिन C (INS 300)',
    hazardLevel: 'SAFE',
    category: 'PRESERVATIVE',
    healthRiskEn: 'Natural antioxidant and essential immune micronutrient.',
    healthRiskHi: 'सुरक्षित प्राकृतिक एंटीऑक्सीडेंट और रोग प्रतिरोधक विटामिन।',
    isAllergen: false
  },
  {
    id: 'safe-ins-330',
    keywords: ['citric acid', 'ins 330', 'e330', 'ins330', 'lemon salt', 'nimbu sat'],
    insCodes: ['330', 'INS 330', 'E330'],
    canonicalNameEn: 'Citric Acid / Acidity Regulator (INS 330)',
    canonicalNameHi: 'सिट्रिक एसिड (INS 330)',
    hazardLevel: 'SAFE',
    category: 'PRESERVATIVE',
    healthRiskEn: 'Naturally occurring fruit acid used safely for pH balancing and freshness.',
    healthRiskHi: 'नींबू व खट्टे फलों में पाया जाने वाला सुरक्षित प्राकृतिक एसिड।',
    isAllergen: false
  },
  {
    id: 'safe-ins-307',
    keywords: ['tocopherols', 'vitamin e', 'ins 307', 'e307', 'ins307', 'mixed tocopherols'],
    insCodes: ['307', 'INS 307', 'E307'],
    canonicalNameEn: 'Tocopherols / Vitamin E (INS 307)',
    canonicalNameHi: 'टोकोफेरोल्स / विटामिन E (INS 307)',
    hazardLevel: 'SAFE',
    category: 'PRESERVATIVE',
    healthRiskEn: 'Natural fat-soluble antioxidant that protects freshness safely.',
    healthRiskHi: 'सुरक्षित प्राकृतिक विटामिन E एंटीऑक्सीडेंट।',
    isAllergen: false
  },
  {
    id: 'safe-natural-spices',
    keywords: ['turmeric', 'haldi', 'cumin', 'jeera', 'coriander', 'dhania', 'black pepper', 'kali mirch', 'cardamom', 'elaichi', 'ginger', 'garlic', 'cinnamon'],
    canonicalNameEn: 'Natural Spices & Herbs',
    canonicalNameHi: 'प्राकृतिक मसाले व जड़ी-बूटियां',
    hazardLevel: 'SAFE',
    category: 'NATURAL',
    healthRiskEn: 'Natural medicinal spices with potent anti-inflammatory and digestive benefits.',
    healthRiskHi: 'एंटी-इंफ्लेमेटरी व पाचन में सहायक सुरक्षित प्राकृतिक भारतीय मसाले।',
    isAllergen: false
  }
];
