import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
};

export interface PackagingVisionResponse {
  productName: string | null;
  brandName: string | null;
  genericProductName: string | null;
  mrp: number | null;
  currency?: string;
  netQuantityValue: number | null;
  netQuantityUnit: string | null;
  printedUSP: string | null;
  mfgDate: string | null;
  expiryDate: string | null;
  bestBefore: string | null;
  manufacturer: string | null;
  packer: string | null;
  importer: string | null;
  countryOfOrigin: string | null;
  customerCare: string | null;
  category: 'FOOD' | 'PHARMA' | 'ELECTRONICS' | 'COSMETICS' | 'GENERAL' | null;
  fssaiLicense?: string | null;
  drugLicense?: string | null;
  bisMark?: string | null;
  batchNo?: string | null;
  rawText: string[];
  evidence: Record<string, string>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Only POST is supported.' });
    return;
  }

  const { imageBase64, mimeType = 'image/jpeg', categoryHint = 'FOOD' } = req.body || {};

  if (!imageBase64) {
    res.status(400).json({ error: 'Missing imageBase64 in request body.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

  if (!apiKey) {
    res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on server.',
      fallbackToClient: false,
      code: 'SERVER_KEY_MISSING'
    });
    return;
  }

  const systemPrompt = `You are an expert Indian Legal Metrology Auditor specializing in the Legal Metrology (Packaged Commodities) Rules, 2011 (LMPC Rules) and FSSAI Packaging & Labelling Standards.
Packaging Category Hint: ${categoryHint || 'GENERAL'}.

Your task is to extract, verify, and audit mandatory statutory declarations from the provided product package image.

RULES FOR EXTRACTION:
1. Extract only what is visibly legible in the provided image. Do not invent or hallucinate missing text.
2. Packaging declarations often span multiple sides (Front, Back, Bottom). If a mandatory declaration is not visible in this specific angle, set its field to null, but DO NOT reject the entire scan.
3. Verify compliance based strictly on Indian LMPC standards:
   - Manufacturer/Packer/Importer: Complete name and physical address must be present.
   - Country of Origin: Must be explicitly declared (especially for imported goods).
   - Net Quantity: Must include standard SI units (g, kg, ml, l, m, or count/number).
   - MRP: Must be written as "Maximum or Max. Retail Price Rs./₹ ... incl. of all taxes" or similar standard wording.
   - Unit Sale Price (USP): Required for packages > 1kg/1L/1m or items packed in numbers. Must be ₹ per g/ml/piece/unit.
   - Consumer Care: Must contain at least name/designation, phone number, and email or address.
   - Month & Year of Manufacture/Packing/Import: Must follow MM/YYYY or standard readable formats.
   - Best Before / Expiry: Mandatory for perishable items/cosmetics/food (FSSAI/LMPC alignment).
4. Distinguish between:
   - "manufacturer": Look for "Manufactured by", "Mfd by", "Mfg by".
   - "packer": Look for "Packed by", "Pkd by".
   - "importer": Look for "Imported by".
   - "brandName": The commercial brand (e.g. "Maggi", "Lay's", "Parle-G").
   - "genericProductName": The common commodity name (e.g. "Instant Noodles", "Potato Chips", "Biscuits").
   - "mfgDate": The manufacture or packaging date (e.g. "08/2026", "15/09/2026").
   - "expiryDate" / "bestBefore": The expiry or best before declaration.
5. In "rawText", return an array of all distinct visible text lines from top to bottom.
6. For every non-null field you extract, you MUST populate the "evidence" object with the EXACT, verbatim supporting visible text line where you saw that value.

Return strictly valid JSON with no markdown formatting, matching this exact schema:
{
  "productName": string or null,
  "brandName": string or null,
  "genericProductName": string or null,
  "mrp": number or null,
  "netQuantityValue": number or null,
  "netQuantityUnit": string or null,
  "printedUSP": string or null,
  "mfgDate": string or null,
  "expiryDate": string or null,
  "bestBefore": string or null,
  "manufacturer": string or null,
  "packer": string or null,
  "importer": string or null,
  "countryOfOrigin": string or null,
  "customerCare": string or null,
  "category": "FOOD" | "PHARMA" | "ELECTRONICS" | "COSMETICS" | "GENERAL" | null,
  "fssaiLicense": string or null,
  "drugLicense": string or null,
  "bisMark": string or null,
  "batchNo": string or null,
  "rawText": [string],
  "evidence": {
    "mrp": "verbatim text e.g. MRP Rs. 120 (incl. of all taxes)",
    "netQuantity": "verbatim text e.g. Net Wt. 500 g",
    "mfgDate": "verbatim text e.g. MFD: 12/2026",
    "expiryDate": "verbatim text e.g. Best Before 9 Months from PKD",
    "manufacturer": "verbatim text e.g. Mfd by Nestlé India Ltd, Industrial Area...",
    "customerCare": "verbatim text e.g. Call 1800-103-1947 or email care@...",
    "countryOfOrigin": "verbatim text e.g. Made in India"
  }
}`;

  try {
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const candidateModels = [
      process.env.GEMINI_MODEL || 'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-2.0-flash',
      'gemini-2.0-flash-001',
      'gemini-2.0-flash-lite',
      'gemini-1.5-flash'
    ];

    let lastError: any = null;
    let parsedData: PackagingVisionResponse | null = null;
    let successfulModel = '';

    for (const modelName of candidateModels) {
      if (!modelName) continue;
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 25000); // 25s timeout for vision AI

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              contents: [{
                parts: [
                  { text: systemPrompt },
                  { inline_data: { mime_type: mimeType, data: cleanBase64 } }
                ]
              }],
              generationConfig: {
                temperature: 0.0,
                maxOutputTokens: 2048,
                responseMimeType: 'application/json'
              }
            })
          }
        );
        clearTimeout(timeoutId);

        if (!response.ok) {
          const errStatus = response.status;
          const errText = await response.text();
          lastError = { status: errStatus, message: errText, model: modelName };
          if (errStatus === 429 || errStatus >= 500) {
            continue; // try fallback model
          }
          continue;
        }

        const resJson: any = await response.json();
        const rawContent = resJson?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        if (!rawContent) {
          lastError = { status: 502, message: 'Empty vision response part', model: modelName };
          continue;
        }

        const cleaned = rawContent
          .replace(/^```(?:json)?\s*/i, '')
          .replace(/\s*```$/g, '')
          .trim();

        const jsonStart = cleaned.indexOf('{');
        const jsonEnd = cleaned.lastIndexOf('}');
        if (jsonStart === -1 || jsonEnd === -1) {
          lastError = { status: 502, message: 'Malformed JSON response', raw: rawContent, model: modelName };
          continue;
        }

        const jsonStr = cleaned.slice(jsonStart, jsonEnd + 1);
        parsedData = JSON.parse(jsonStr);
        successfulModel = modelName;
        break;
      } catch (callErr: any) {
        lastError = { status: 500, message: callErr?.message || 'Network/timeout exception', model: modelName };
        continue;
      }
    }

    if (!parsedData) {
      res.status(lastError?.status || 502).json({
        error: 'Gemini Vision AI failed across all models',
        details: lastError,
        fallbackToLocalOcr: true
      });
      return;
    }

    // Ensure rawText is an array
    if (typeof parsedData.rawText === 'string') {
      parsedData.rawText = (parsedData.rawText as string).split('\n').map(s => s.trim()).filter(Boolean);
    } else if (!Array.isArray(parsedData.rawText)) {
      parsedData.rawText = [];
    }

    // Ensure evidence is an object
    if (!parsedData.evidence || typeof parsedData.evidence !== 'object') {
      parsedData.evidence = {};
    }

    res.status(200).json({
      success: true,
      data: parsedData,
      modelUsed: successfulModel,
      engine: `MetrologyLens Vision AI (${successfulModel})`
    });
  } catch (err: any) {
    res.status(500).json({
      error: 'Internal server error processing packaging image',
      message: err?.message || 'Unknown error',
      fallbackToLocalOcr: true
    });
  }
}
