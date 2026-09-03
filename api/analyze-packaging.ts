import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

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

  const { imageBase64, mimeType = 'image/jpeg', category = 'FOOD' } = req.body || {};

  if (!imageBase64) {
    res.status(400).json({ error: 'Missing imageBase64 in request body.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '';

  if (!apiKey) {
    res.status(503).json({
      error: 'GEMINI_API_KEY is not configured on server.',
      fallbackToClient: true
    });
    return;
  }

  const prompt = `You are a certified Legal Metrology optical inspector enforcing Legal Metrology (Packaged Commodities) Rules, 2011 & FSSAI regulations in India.

CRITICAL INSTRUCTION:
Extract ONLY the verbatim text visibly present on this packaging image.
NEVER invent, assume, or guess any value. If a value is missing or unreadable, return null.

Return ONLY a valid JSON object matching this schema:
{
  "productName": "exact commodity name printed on package or null",
  "brandName": "exact brand printed on package or null",
  "mrp": <exact numeric MRP amount without currency symbol or null>,
  "currency": "₹",
  "netQuantityValue": <exact numeric quantity or null>,
  "netQuantityUnit": "exact unit e.g. g, kg, ml, L, Unit, NOS, Tablets, Pages or null",
  "hasPrintedUSP": <true if printed on package else false>,
  "printedUSP": "exact printed unit sale price text or null",
  "printedUSPAmount": <exact printed USP number or null>,
  "printedUSPUnit": <exact printed unit e.g. g, ml, kg or null>,
  "mfgDate": "exact printed mfg/pkd date or null",
  "expiryDate": "exact printed expiry/best before date or null",
  "manufacturer": "exact printed manufacturer legal entity and address with PIN or null",
  "marketer": "exact marketed by entity if separate or null",
  "fssaiLicense": "14-digit FSSAI registration number or null",
  "drugLicense": "drug or AYUSH license number or null",
  "bisMark": "BIS ISI registration number or null",
  "batchNo": "exact batch number or null",
  "countryOfOrigin": "exact country of origin e.g. INDIA or null",
  "customerCare": "exact consumer care phone or email or null",
  "ingredientsList": "verbatim text printed under Ingredients/सामग्री block or null",
  "rawText": "verbatim text lines visible in image"
}`;

  try {
    const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const requestVision = (modelName: string) => fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inline_data: { mime_type: mimeType, data: cleanBase64 } }
          ]
        }],
        generationConfig: {
          temperature: 0.0,
          maxOutputTokens: 1024
        }
      })
      }
    );

    let response = await requestVision(model);
    for (const fallbackModel of ['gemini-2.5-flash-lite', 'gemini-2.0-flash', 'gemini-2.0-flash-001', 'gemini-2.0-flash-lite', 'gemini-1.5-flash']) {
      if (response.ok) break;
      response = await requestVision(fallbackModel);
    }

    if (!response.ok) {
      const errText = await response.text();
      res.status(502).json({ error: 'Gemini Vision API error', details: errText, fallbackToClient: true });
      return;
    }

    const data = await response.json();
    const rawContent = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (!rawContent) {
      res.status(502).json({ error: 'Empty vision AI response', fallbackToClient: true });
      return;
    }

    const cleaned = rawContent.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) {
      res.status(502).json({ error: 'Invalid JSON from vision model', raw: rawContent, fallbackToClient: true });
      return;
    }

    const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1));

    res.status(200).json({
      success: true,
      data: parsed,
      engine: 'MetrologyLens Cloud Vision AI (Grounded 1.5 Flash)'
    });
  } catch (err: any) {
    res.status(500).json({
      error: 'Server error processing packaging image',
      message: err?.message || 'Unknown error',
      fallbackToClient: true
    });
  }
}
