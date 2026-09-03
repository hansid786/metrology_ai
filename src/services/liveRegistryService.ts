export interface LiveProductData {
  found: boolean;
  barcode: string;
  productName?: string;
  brand?: string;
  quantity?: string;
  ingredientsText?: string;
  novaGroup?: number;
  nutriscoreGrade?: string;
  source: 'OpenFoodFacts' | 'GS1 India Master' | 'Local Database';
}

/**
 * Queries Open Food Facts live global API for instant product cross-verification.
 */
export async function fetchLiveProductByBarcode(barcode: string): Promise<LiveProductData | null> {
  if (!barcode || barcode.length < 8) return null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for fast response

    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'MetrologyLensAI - Legal Metrology Verification System - India'
      }
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;

    const data = await res.json();
    if (data.status === 1 && data.product) {
      const p = data.product;
      return {
        found: true,
        barcode,
        productName: p.product_name || p.product_name_en || p.generic_name || undefined,
        brand: p.brands || p.brand_owner || undefined,
        quantity: p.quantity || undefined,
        ingredientsText: p.ingredients_text || p.ingredients_text_en || undefined,
        novaGroup: p.nova_group ? Number(p.nova_group) : undefined,
        nutriscoreGrade: p.nutriscore_grade ? String(p.nutriscore_grade).toUpperCase() : undefined,
        source: 'OpenFoodFacts'
      };
    }
  } catch {
    // Non-fatal fallback
  }

  return null;
}
