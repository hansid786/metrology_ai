import { DemoProductPreset } from '../types/inspection';

const toSvgDataUri = (svgContent: string): string => {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent.trim())}`;
};

const chipsSvg = toSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
  <rect width="600" height="800" rx="28" fill="#1e3a8a"/>
  <rect x="15" y="15" width="570" height="770" rx="20" fill="none" stroke="#3b82f6" stroke-width="2" stroke-opacity="0.3"/>
  <rect x="60" y="60" width="480" height="75" rx="14" fill="#f59e0b"/>
  <text x="300" y="108" font-family="Arial, sans-serif" font-weight="900" font-size="30" fill="#0f172a" text-anchor="middle">CRUNCHY SUPREME</text>
  <rect x="100" y="148" width="400" height="34" rx="6" fill="#1e293b"/>
  <text x="300" y="171" font-family="Arial, sans-serif" font-weight="700" font-size="14" fill="#93c5fd" text-anchor="middle">PREMIUM POTATO CHIPS - SALTED</text>
  <circle cx="300" cy="275" r="70" fill="#f59e0b" fill-opacity="0.2"/>
  <text x="300" y="288" font-size="40" text-anchor="middle">🥔🍟</text>
  <rect x="40" y="390" width="520" height="375" rx="12" fill="#ffffff"/>
  <rect x="40" y="390" width="520" height="30" rx="6" fill="#0f172a"/>
  <text x="300" y="410" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#ffffff" text-anchor="middle">LEGAL METROLOGY DECLARATIONS</text>
  <text x="60" y="460" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">NET QUANTITY:</text>
  <text x="60" y="484" font-family="Arial, sans-serif" font-size="18" fill="#0f172a" font-weight="bold">250 g</text>
  <text x="210" y="460" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">MAX. RETAIL PRICE (MRP):</text>
  <text x="210" y="484" font-family="Arial, sans-serif" font-size="18" fill="#0f172a" font-weight="bold">₹ 50.00</text>
  <text x="275" y="484" font-family="Arial, sans-serif" font-size="10" fill="#475569">(Incl. all taxes)</text>
  <rect x="390" y="448" width="155" height="44" rx="6" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.5"/>
  <text x="400" y="466" font-family="Arial, sans-serif" font-size="10" fill="#15803d" font-weight="bold">UNIT SALE PRICE (USP):</text>
  <text x="400" y="484" font-family="Arial, sans-serif" font-size="15" fill="#166534" font-weight="bold">₹ 0.20 / g</text>
  <line x1="60" y1="508" x2="540" y2="508" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="60" y="532" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">MFG DATE / PKG:</text>
  <text x="60" y="550" font-family="Arial, sans-serif" font-size="13" fill="#0f172a" font-weight="600">AUG 2026</text>
  <text x="180" y="532" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">BEST BEFORE:</text>
  <text x="180" y="550" font-family="Arial, sans-serif" font-size="13" fill="#0f172a" font-weight="600">6 MONTHS</text>
  <text x="380" y="532" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">COUNTRY OF ORIGIN:</text>
  <text x="380" y="550" font-family="Arial, sans-serif" font-size="13" fill="#0f172a" font-weight="bold">INDIA</text>
  <line x1="60" y1="570" x2="540" y2="570" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="60" y="592" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">MANUFACTURED &amp; PACKED BY:</text>
  <text x="60" y="610" font-family="Arial, sans-serif" font-size="12" fill="#1e293b">Apex Snack Foods Pvt. Ltd., Plot 42, Food Park, Okhla Phase-III, New Delhi</text>
  <line x1="60" y1="630" x2="540" y2="630" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="60" y="652" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">CONSUMER CARE HELPLINE:</text>
  <text x="60" y="670" font-family="Arial, sans-serif" font-size="12" fill="#1e293b">Toll-Free: 1800-112-990 | care@crunchysupreme.in</text>
  <line x1="60" y1="690" x2="540" y2="690" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="60" y="708" font-family="Arial, sans-serif" font-size="10" fill="#64748b" font-weight="bold">INGREDIENTS:</text>
  <text x="60" y="724" font-family="Arial, sans-serif" font-size="9" fill="#1e293b">Potato, Edible Vegetable Oil (Palmolein), Salt, Tartrazine (INS 102), MSG (INS 621), BHA (INS 320)</text>
</svg>`);

const oilSvg = toSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
  <rect width="600" height="800" rx="28" fill="#064e3b"/>
  <rect x="60" y="60" width="480" height="75" rx="14" fill="#059669"/>
  <text x="300" y="108" font-family="Arial, sans-serif" font-weight="900" font-size="30" fill="#ffffff" text-anchor="middle">VEDA ORGANICS</text>
  <rect x="100" y="148" width="400" height="34" rx="6" fill="#022c22"/>
  <text x="300" y="171" font-family="Arial, sans-serif" font-weight="700" font-size="14" fill="#a7f3d0" text-anchor="middle">COLD PRESSED VIRGIN COCONUT OIL</text>
  <circle cx="300" cy="275" r="70" fill="#10b981" fill-opacity="0.2"/>
  <text x="300" y="288" font-size="40" text-anchor="middle">🥥🌿</text>
  <rect x="40" y="390" width="520" height="375" rx="12" fill="#ffffff"/>
  <rect x="40" y="390" width="520" height="30" rx="6" fill="#064e3b"/>
  <text x="300" y="410" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#ffffff" text-anchor="middle">LEGAL METROLOGY DECLARATIONS</text>
  <text x="60" y="460" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">NET VOLUME:</text>
  <text x="60" y="484" font-family="Arial, sans-serif" font-size="18" fill="#0f172a" font-weight="bold">500 ml</text>
  <text x="210" y="460" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">MRP (INCL. TAXES):</text>
  <text x="210" y="484" font-family="Arial, sans-serif" font-size="18" fill="#0f172a" font-weight="bold">₹ 220.00</text>
  <rect x="390" y="448" width="155" height="44" rx="6" fill="#fff1f2" stroke="#e11d48" stroke-width="1.5" stroke-dasharray="4 2"/>
  <text x="467" y="475" font-family="Arial, sans-serif" font-size="10" fill="#e11d48" font-weight="bold" text-anchor="middle">[ USP NOT PRINTED ]</text>
  <line x1="60" y1="508" x2="540" y2="508" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="60" y="532" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">MFG DATE:</text>
  <text x="60" y="550" font-family="Arial, sans-serif" font-size="13" fill="#0f172a" font-weight="600">JUL 2026</text>
  <text x="180" y="532" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">BEST BEFORE:</text>
  <text x="180" y="550" font-family="Arial, sans-serif" font-size="13" fill="#0f172a" font-weight="600">12 MONTHS</text>
  <text x="380" y="532" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">COUNTRY OF ORIGIN:</text>
  <text x="380" y="550" font-family="Arial, sans-serif" font-size="13" fill="#0f172a" font-weight="bold">INDIA</text>
  <line x1="60" y1="570" x2="540" y2="570" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="60" y="592" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">PRODUCED &amp; PACKED BY:</text>
  <text x="60" y="610" font-family="Arial, sans-serif" font-size="12" fill="#1e293b">Veda Agro Products LLP, Kinfra Food Park, Kozhikode, Kerala 673019</text>
  <line x1="60" y1="630" x2="540" y2="630" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="60" y="652" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">CUSTOMER SUPPORT:</text>
  <text x="60" y="670" font-family="Arial, sans-serif" font-size="12" fill="#1e293b">Helpline: +91 9400 221100 | care@vedaorganics.in</text>
</svg>`);

const attaSvg = toSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
  <rect width="600" height="800" rx="28" fill="#78350f"/>
  <rect x="60" y="60" width="480" height="75" rx="14" fill="#d97706"/>
  <text x="300" y="108" font-family="Arial, sans-serif" font-weight="900" font-size="30" fill="#ffffff" text-anchor="middle">SHAKTI BHOG</text>
  <rect x="100" y="148" width="400" height="34" rx="6" fill="#451a03"/>
  <text x="300" y="171" font-family="Arial, sans-serif" font-weight="700" font-size="14" fill="#fef3c7" text-anchor="middle">100% WHOLE WHEAT CHAKKI ATTA</text>
  <circle cx="300" cy="275" r="70" fill="#f59e0b" fill-opacity="0.2"/>
  <text x="300" y="288" font-size="40" text-anchor="middle">🌾🍞</text>
  <rect x="40" y="390" width="520" height="375" rx="12" fill="#ffffff"/>
  <rect x="40" y="390" width="520" height="30" rx="6" fill="#78350f"/>
  <text x="300" y="410" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#ffffff" text-anchor="middle">LEGAL METROLOGY DECLARATIONS</text>
  <text x="60" y="460" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">NET QUANTITY:</text>
  <text x="60" y="484" font-family="Arial, sans-serif" font-size="18" fill="#0f172a" font-weight="bold">5 kg</text>
  <text x="210" y="460" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">MRP (INCL. TAXES):</text>
  <text x="210" y="484" font-family="Arial, sans-serif" font-size="18" fill="#0f172a" font-weight="bold">₹ 240.00</text>
  <text x="390" y="460" font-family="Arial, sans-serif" font-size="11" fill="#15803d" font-weight="bold">UNIT SALE PRICE (USP):</text>
  <text x="390" y="484" font-family="Arial, sans-serif" font-size="17" fill="#166534" font-weight="bold">₹ 48.00 / kg</text>
  <line x1="60" y1="508" x2="540" y2="508" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="60" y="532" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">MFG DATE:</text>
  <text x="60" y="550" font-family="Arial, sans-serif" font-size="13" fill="#0f172a" font-weight="600">AUG 2026</text>
  <text x="180" y="532" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">BEST BEFORE:</text>
  <text x="180" y="550" font-family="Arial, sans-serif" font-size="13" fill="#0f172a" font-weight="600">3 MONTHS</text>
  <text x="380" y="532" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">COUNTRY OF ORIGIN:</text>
  <text x="380" y="550" font-family="Arial, sans-serif" font-size="13" fill="#0f172a" font-weight="bold">INDIA</text>
  <line x1="60" y1="570" x2="540" y2="570" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="60" y="592" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">MANUFACTURED &amp; PACKED BY:</text>
  <text x="60" y="610" font-family="Arial, sans-serif" font-size="12" fill="#1e293b">Shakti Bhog Foods Ltd., G.T. Karnal Road, Kundli, Haryana 131028</text>
  <line x1="60" y1="630" x2="540" y2="630" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="60" y="652" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">CUSTOMER SUPPORT:</text>
  <text x="60" y="670" font-family="Arial, sans-serif" font-size="12" fill="#1e293b">Toll-Free: 1800-419-5566 | customercare@shaktibhog.com</text>
</svg>`);


export const DEMO_PRESETS: DemoProductPreset[] = [
  {
    id: 'demo-potato-chips',
    title: 'Crunchy Supreme Potato Chips (250g)',
    subtitle: 'Demo Benchmark — Synthetic Sample (Full Declaration Pass)',
    badge: '100% Compliant FMCG',
    description: 'Synthetic benchmark sample where MRP is ₹50 for 250g. Correctly declares Unit Sale Price as ₹0.20/g (₹50 ÷ 250g = ₹0.20/g).',
    imageUrl: chipsSvg,
    mrp: 50,
    netQuantity: '250 g',
    printedUSP: '₹0.20/g',
    data: {
      inspectionId: 'INSP-DL-2026-8842',
      timestamp: new Date().toISOString(),
      inspector: {
        id: 'INS-GOI-2026-8842',
        name: 'Officer A. K. Sharma',
        designation: 'Senior Legal Metrology Officer',
        jurisdiction: 'National Capital Territory of Delhi, Zone-IV'
      },
      product: {
        name: 'Crunchy Supreme Potato Chips - Salted',
        brand: 'Crunchy Supreme',
        category: 'Packaged Snacks / Food',
        imageUrl: chipsSvg
      },
      declarations: [
        {
          id: 'decl-mrp',
          key: 'mrp',
          name: 'Maximum Retail Price (MRP)',
          legalReference: 'Rule 6(1)(e) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: '₹ 50.00 (Incl. of all taxes)',
          confidence: 98.7,
          explanation: 'Clear MRP declared with rupee symbol and tax inclusion statement.',
          boundingBoxId: 'bbox-mrp'
        },
        {
          id: 'decl-net-qty',
          key: 'net_quantity',
          name: 'Net Quantity',
          legalReference: 'Rule 6(1)(b) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: '250 g',
          confidence: 97.4,
          explanation: 'Declared in standard SI weight unit (grams) with compliant height.',
          boundingBoxId: 'bbox-net-qty'
        },
        {
          id: 'decl-usp',
          key: 'unit_sale_price',
          name: 'Unit Sale Price (USP)',
          legalReference: 'Rule 6(1)(e) [Amendment 2021]',
          status: 'PASS',
          extractedValue: '₹ 0.20 / g',
          confidence: 98.5,
          explanation: 'Unit Sale Price is mathematically accurate: ₹50 ÷ 250g = ₹0.20/g (Compliant with Rule 6(1)(e)).',
          boundingBoxId: 'bbox-usp'
        },
        {
          id: 'decl-expiry',
          key: 'expiry_date',
          name: 'Expiry / Best Before / Mfg Date',
          legalReference: 'Rule 6(1)(c) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'PKG: AUG 2026 | Best Before: 6 Months',
          confidence: 95.8,
          explanation: 'Month & Year of packaging and consumption timeline declared clearly.',
          boundingBoxId: 'bbox-expiry'
        },
        {
          id: 'decl-origin',
          key: 'country_of_origin',
          name: 'Country of Origin',
          legalReference: 'Rule 6(10) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'INDIA',
          confidence: 99.1,
          explanation: 'Country of Origin explicitly declared as "INDIA".',
          boundingBoxId: 'bbox-origin'
        },
        {
          id: 'decl-mfg',
          key: 'manufacturer_details',
          name: 'Manufacturer / Packer Details',
          legalReference: 'Rule 6(1)(d) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'Apex Snack Foods Pvt. Ltd., Plot 42, Food Park, Okhla Phase-III, New Delhi',
          confidence: 94.8,
          explanation: 'Complete legal entity name, industrial premises address, and FSSAI license.',
          boundingBoxId: 'bbox-mfg'
        },
        {
          id: 'decl-care',
          key: 'customer_care',
          name: 'Customer Care Details',
          legalReference: 'Rule 6(1)(f) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'Toll-Free: 1800-112-990 | care@crunchysupreme.in',
          confidence: 96.5,
          explanation: 'Toll-free helpline and active consumer support email provided.',
          boundingBoxId: 'bbox-care'
        },
        {
          id: 'decl-name',
          key: 'generic_name',
          name: 'Generic / Common Product Name',
          legalReference: 'Rule 6(1)(a) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'PREMIUM POTATO CHIPS - SALTED',
          confidence: 99.4,
          explanation: 'Generic product commodity name declared prominently on principal display panel.',
          boundingBoxId: 'bbox-name'
        }
      ],
      verifiedCount: 8,
      totalCount: 8,
      compliancePercentage: 100,
      overallStatus: 'COMPLIANT',
      pricing: {
        mrpAmount: 50,
        mrpCurrency: '₹',
        netQuantityValue: 250,
        netQuantityUnit: 'g',
        standardizedQuantity: 250,
        standardUnit: 'g',
        hasPrintedUSP: true,
        printedUSPAmount: 0.20,
        printedUSPUnit: 'g',
        printedUSPText: '₹ 0.20 / g',
        calculatedUSPAmount: 0.20,
        calculatedUSPUnit: 'g',
        isDiscrepancy: false,
        differenceAmount: 0,
        differencePercentage: 0,
        discrepancyType: 'NONE',
        statusDescription: 'Unit Sale Price is mathematically accurate (₹50 ÷ 250g = ₹0.20/g). Fully compliant.',
        ruleReference: 'Rule 6(1)(e) of Legal Metrology (Packaged Commodities) Rules, 2011'
      },
      findings: [
        {
          id: 'f-1',
          severity: 'SUCCESS',
          title: 'Full Statutory Metrology Compliance',
          description: 'All 8 mandatory declarations verified with verified visual evidence. Unit Sale Price is mathematically accurate (₹50 ÷ 250g = ₹0.20/g).',
          legalActClause: 'Rule 6(1) & Rule 6(10) - Legal Metrology (PC) Rules, 2011'
        },
        {
          id: 'f-2',
          severity: 'SUCCESS',
          title: 'MRP & Tax Declaration Verified',
          description: 'Maximum Retail Price ₹50.00 declared with "inclusive of all taxes" under Rule 6(1)(e).',
          legalActClause: 'Rule 6(1)(e) Compliant',
          declarationKey: 'mrp'
        },
        {
          id: 'f-3',
          severity: 'SUCCESS',
          title: 'Net Quantity Standard Verified',
          description: 'Standard 250g declared with appropriate character font height.',
          legalActClause: 'Rule 6(1)(b) Compliant',
          declarationKey: 'net_quantity'
        },
        {
          id: 'f-4',
          severity: 'SUCCESS',
          title: 'Mandatory Contact & Origin Verified',
          description: 'Country of Origin (India) and Customer Care helpline 1800-112-990 declared.',
          legalActClause: 'Rule 6(10) & Rule 6(1)(f) Compliant'
        }
      ],
      boundingBoxes: [
        {
          id: 'bbox-name',
          declarationKey: 'generic_name',
          label: 'Generic Name',
          x: 16.5,
          y: 18.5,
          width: 67,
          height: 4.5,
          confidence: 99.4,
          status: 'PASS',
          extractedText: 'PREMIUM POTATO CHIPS - SALTED'
        },
        {
          id: 'bbox-net-qty',
          declarationKey: 'net_quantity',
          label: 'Net Quantity',
          x: 9.5,
          y: 56.5,
          width: 23,
          height: 5.5,
          confidence: 97.4,
          status: 'PASS',
          extractedText: '250 g'
        },
        {
          id: 'bbox-mrp',
          declarationKey: 'mrp',
          label: 'MRP (Incl. Taxes)',
          x: 34.5,
          y: 56.5,
          width: 30,
          height: 5.5,
          confidence: 98.7,
          status: 'PASS',
          extractedText: '₹ 50.00 (Incl. of all taxes)'
        },
        {
          id: 'bbox-usp',
          declarationKey: 'unit_sale_price',
          label: 'Unit Sale Price [MISMATCH]',
          x: 64.5,
          y: 55.5,
          width: 27,
          height: 6.0,
          confidence: 96.1,
          status: 'FAIL',
          extractedText: '₹ 0.25 / g (Expected: ₹ 0.20/g)'
        },
        {
          id: 'bbox-expiry',
          declarationKey: 'expiry_date',
          label: 'Mfg & Best Before',
          x: 9.5,
          y: 65.5,
          width: 50,
          height: 4.5,
          confidence: 95.8,
          status: 'PASS',
          extractedText: 'PKG: AUG 2026 | Best Before: 6 Months'
        },
        {
          id: 'bbox-origin',
          declarationKey: 'country_of_origin',
          label: 'Country of Origin',
          x: 63.0,
          y: 65.5,
          width: 27,
          height: 4.5,
          confidence: 99.1,
          status: 'PASS',
          extractedText: 'INDIA'
        },
        {
          id: 'bbox-mfg',
          declarationKey: 'manufacturer_details',
          label: 'Manufacturer Details',
          x: 9.5,
          y: 73.5,
          width: 81,
          height: 5.2,
          confidence: 94.8,
          status: 'PASS',
          extractedText: 'Apex Snack Foods Pvt. Ltd., Okhla Phase-III, New Delhi'
        },
        {
          id: 'bbox-care',
          declarationKey: 'customer_care',
          label: 'Customer Care Details',
          x: 9.5,
          y: 81.0,
          width: 75,
          height: 5.0,
          confidence: 96.5,
          status: 'PASS',
          extractedText: 'Toll-Free: 1800-112-990 | care@crunchysupreme.in'
        }
      ],
      ocrMetadata: {
        engine: 'MetrologyLens OCR v2.4 (Transformer/Paddle Engine)',
        processingTimeMs: 412,
        tokensDetected: 142,
        averageConfidence: 97.2
      }
    }
  },
  {
    id: 'demo-coconut-oil',
    title: 'Cold Pressed Virgin Coconut Oil (500ml)',
    subtitle: 'Demo Benchmark — Synthetic Sample (Missing USP Violation)',
    badge: 'Missing USP Violation',
    description: 'Synthetic benchmark sample of packaged edible oil with MRP ₹220 (500ml), where Unit Sale Price is completely missing from the label surface.',
    imageUrl: oilSvg,
    mrp: 220,
    netQuantity: '500 ml',
    printedUSP: 'Missing',
    data: {
      inspectionId: 'INSP-KL-2026-4419',
      timestamp: new Date().toISOString(),
      inspector: {
        id: 'INS-GOI-2026-8842',
        name: 'Officer A. K. Sharma',
        designation: 'Senior Legal Metrology Officer',
        jurisdiction: 'National Capital Territory of Delhi, Zone-IV'
      },
      product: {
        name: 'Cold Pressed Virgin Coconut Oil 500ml',
        brand: 'Veda Organics',
        category: 'Edible Oils & Commodities',
        imageUrl: oilSvg
      },
      declarations: [
        {
          id: 'decl-mrp-2',
          key: 'mrp',
          name: 'Maximum Retail Price (MRP)',
          legalReference: 'Rule 6(1)(e) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: '₹ 220.00 (Incl. of all taxes)',
          confidence: 99.0,
          explanation: 'Clear MRP declared with rupee symbol.',
          boundingBoxId: 'bbox-oil-mrp'
        },
        {
          id: 'decl-net-qty-2',
          key: 'net_quantity',
          name: 'Net Quantity',
          legalReference: 'Rule 6(1)(b) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: '500 ml',
          confidence: 98.2,
          explanation: 'Declared in standard liquid volume (ml).',
          boundingBoxId: 'bbox-oil-qty'
        },
        {
          id: 'decl-usp-2',
          key: 'unit_sale_price',
          name: 'Unit Sale Price (USP)',
          legalReference: 'Rule 6(1)(e) [Mandatory for retail packs]',
          status: 'FAIL',
          extractedValue: 'NOT DETECTED / MISSING',
          confidence: 0,
          explanation: 'Unit Sale Price declaration absent on package. Calculated USP should be ₹0.44/ml.',
          boundingBoxId: 'bbox-oil-usp'
        },
        {
          id: 'decl-expiry-2',
          key: 'expiry_date',
          name: 'Expiry / Best Before / Mfg Date',
          legalReference: 'Rule 6(1)(c) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'JUL 2026 | 12 Months from PKG',
          confidence: 96.5,
          explanation: 'Manufacturing date and shelf-life declared.',
          boundingBoxId: 'bbox-oil-expiry'
        },
        {
          id: 'decl-origin-2',
          key: 'country_of_origin',
          name: 'Country of Origin',
          legalReference: 'Rule 6(10) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'INDIA',
          confidence: 98.9,
          explanation: 'Country of Origin explicitly declared as India.',
          boundingBoxId: 'bbox-oil-origin'
        },
        {
          id: 'decl-mfg-2',
          key: 'manufacturer_details',
          name: 'Manufacturer / Packer Details',
          legalReference: 'Rule 6(1)(d) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'Veda Agro Products LLP, Kinfra Food Park, Kozhikode, Kerala 673019',
          confidence: 95.2,
          explanation: 'Producer address and legal entity declared.',
          boundingBoxId: 'bbox-oil-mfg'
        },
        {
          id: 'decl-care-2',
          key: 'customer_care',
          name: 'Customer Care Details',
          legalReference: 'Rule 6(1)(f) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'Helpline: +91 9400 221100 | care@vedaorganics.in',
          confidence: 97.0,
          explanation: 'Helpline telephone number and email verified.',
          boundingBoxId: 'bbox-oil-care'
        },
        {
          id: 'decl-name-2',
          key: 'generic_name',
          name: 'Generic / Common Product Name',
          legalReference: 'Rule 6(1)(a) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'COLD PRESSED VIRGIN COCONUT OIL',
          confidence: 99.2,
          explanation: 'Generic product commodity name declared prominently.',
          boundingBoxId: 'bbox-oil-name'
        }
      ],
      verifiedCount: 7,
      totalCount: 8,
      compliancePercentage: 87.5,
      overallStatus: 'ATTENTION_REQUIRED',
      pricing: {
        mrpAmount: 220,
        mrpCurrency: '₹',
        netQuantityValue: 500,
        netQuantityUnit: 'ml',
        standardizedQuantity: 500,
        standardUnit: 'ml',
        hasPrintedUSP: false,
        calculatedUSPAmount: 0.44,
        calculatedUSPUnit: 'ml',
        isDiscrepancy: true,
        differenceAmount: 0,
        differencePercentage: 0,
        discrepancyType: 'MISSING_USP',
        statusDescription: '⚠ Unit Sale Price Not Detected: Statutory violation under Rule 6(1)(e). Mandatory USP should be ₹0.44/ml.',
        ruleReference: 'Rule 6(1)(e) of Legal Metrology (Packaged Commodities) Rules, 2011'
      },
      findings: [
        {
          id: 'f-oil-1',
          severity: 'CRITICAL',
          title: 'Mandatory Unit Sale Price (USP) Omitted',
          description: 'Label omits Unit Sale Price declaration. Required for all consumer retail packs under the 2021 Legal Metrology Amendment.',
          legalActClause: 'Rule 6(1)(e) of Legal Metrology (PC) Rules, 2011',
          declarationKey: 'unit_sale_price'
        }
      ],
      boundingBoxes: [
        {
          id: 'bbox-oil-name',
          declarationKey: 'generic_name',
          label: 'Generic Name',
          x: 16.5,
          y: 18.5,
          width: 67,
          height: 4.5,
          confidence: 99.2,
          status: 'PASS',
          extractedText: 'COLD PRESSED VIRGIN COCONUT OIL'
        },
        {
          id: 'bbox-oil-qty',
          declarationKey: 'net_quantity',
          label: 'Net Quantity',
          x: 9.5,
          y: 56.5,
          width: 24,
          height: 5.5,
          confidence: 98.2,
          status: 'PASS',
          extractedText: '500 ml'
        },
        {
          id: 'bbox-oil-mrp',
          declarationKey: 'mrp',
          label: 'MRP (Incl. Taxes)',
          x: 34.5,
          y: 56.5,
          width: 30,
          height: 5.5,
          confidence: 99.0,
          status: 'PASS',
          extractedText: '₹ 220.00'
        },
        {
          id: 'bbox-oil-usp',
          declarationKey: 'unit_sale_price',
          label: 'USP [NOT FOUND]',
          x: 64.5,
          y: 55.5,
          width: 27,
          height: 6.0,
          confidence: 0,
          status: 'FAIL',
          extractedText: 'USP Not Printed on Package'
        }
      ],
      ocrMetadata: {
        engine: 'MetrologyLens OCR v2.4 (Transformer/Paddle Engine)',
        processingTimeMs: 388,
        tokensDetected: 118,
        averageConfidence: 96.8
      }
    }
  },
  {
    id: 'demo-whole-wheat-atta',
    title: 'Shakti Bhog 100% Whole Wheat Chakki Atta 5kg',
    subtitle: 'Demo Benchmark — Synthetic Sample (100% Compliant Staple)',
    badge: '100% Verified Pass',
    description: 'Synthetic benchmark sample of 5kg chakki atta packaging with all 8 mandatory declarations present, accurate USP (₹55/kg = ₹275 ÷ 5kg), and verified FSSAI/origin data.',
    imageUrl: attaSvg,
    mrp: 275,
    netQuantity: '5 kg',
    printedUSP: '₹55.00/kg',
    data: {
      inspectionId: 'INSP-HR-2026-1092',
      timestamp: new Date().toISOString(),
      inspector: {
        id: 'INS-GOI-2026-8842',
        name: 'Officer A. K. Sharma',
        designation: 'Senior Legal Metrology Officer',
        jurisdiction: 'National Capital Territory of Delhi, Zone-IV'
      },
      product: {
        name: 'Shakti Bhog 100% Whole Wheat Chakki Atta 5kg',
        brand: 'Shakti Bhog',
        category: 'Staples & Grains',
        imageUrl: attaSvg
      },
      declarations: [
        {
          id: 'decl-mrp-3',
          key: 'mrp',
          name: 'Maximum Retail Price (MRP)',
          legalReference: 'Rule 6(1)(e)',
          status: 'PASS',
          extractedValue: '₹ 275.00 (Incl. of all taxes)',
          confidence: 99.5,
          explanation: 'Clear MRP declaration with tax inclusion statement.',
          boundingBoxId: 'bbox-atta-mrp'
        },
        {
          id: 'decl-net-qty-3',
          key: 'net_quantity',
          name: 'Net Quantity',
          legalReference: 'Rule 6(1)(b)',
          status: 'PASS',
          extractedValue: '5 kg',
          confidence: 99.1,
          explanation: 'Standard weight declared in kg.',
          boundingBoxId: 'bbox-atta-qty'
        },
        {
          id: 'decl-usp-3',
          key: 'unit_sale_price',
          name: 'Unit Sale Price (USP)',
          legalReference: 'Rule 6(1)(e)',
          status: 'PASS',
          extractedValue: '₹ 55.00 / kg (₹ 0.055 / g)',
          confidence: 98.7,
          explanation: 'Mathematically exact: ₹275 ÷ 5kg = ₹55.00/kg (₹0.055/g).',
          boundingBoxId: 'bbox-atta-usp'
        },
        {
          id: 'decl-expiry-3',
          key: 'expiry_date',
          name: 'Expiry / Best Before / Mfg Date',
          legalReference: 'Rule 6(1)(c)',
          status: 'PASS',
          extractedValue: 'AUG 2026 | 3 Months from Mfg',
          confidence: 98.4,
          explanation: 'Manufacturing date and shelf-life declared.',
          boundingBoxId: 'bbox-atta-exp'
        },
        {
          id: 'decl-origin-3',
          key: 'country_of_origin',
          name: 'Country of Origin',
          legalReference: 'Rule 6(10)',
          status: 'PASS',
          extractedValue: 'INDIA',
          confidence: 99.6,
          explanation: 'Country of Origin declared as India.',
          boundingBoxId: 'bbox-atta-org'
        },
        {
          id: 'decl-mfg-3',
          key: 'manufacturer_details',
          name: 'Manufacturer / Packer Details',
          legalReference: 'Rule 6(1)(d)',
          status: 'PASS',
          extractedValue: 'Shakti Bhog Foods Ltd., G.T. Karnal Road, Kundli, Sonipat, Haryana 131028',
          confidence: 97.9,
          explanation: 'Manufacturer name and registered facility address verified.',
          boundingBoxId: 'bbox-atta-mfg'
        },
        {
          id: 'decl-care-3',
          key: 'customer_care',
          name: 'Customer Care Details',
          legalReference: 'Rule 6(1)(f)',
          status: 'PASS',
          extractedValue: 'Toll-Free: 1800-419-5566 | customercare@shaktibhog.com',
          confidence: 98.5,
          explanation: 'Customer support toll-free number and email verified.',
          boundingBoxId: 'bbox-atta-care'
        },
        {
          id: 'decl-name-3',
          key: 'generic_name',
          name: 'Generic / Common Product Name',
          legalReference: 'Rule 6(1)(a)',
          status: 'PASS',
          extractedValue: '100% WHOLE WHEAT CHAKKI ATTA',
          confidence: 99.7,
          explanation: 'Generic product commodity name declared.',
          boundingBoxId: 'bbox-atta-name'
        }
      ],
      verifiedCount: 8,
      totalCount: 8,
      compliancePercentage: 100.0,
      overallStatus: 'COMPLIANT',
      pricing: {
        mrpAmount: 275,
        mrpCurrency: '₹',
        netQuantityValue: 5,
        netQuantityUnit: 'kg',
        standardizedQuantity: 5000,
        standardUnit: 'g',
        hasPrintedUSP: true,
        printedUSPAmount: 55,
        printedUSPUnit: 'kg',
        printedUSPText: '₹ 55.00 / kg (₹ 0.055 / g)',
        calculatedUSPAmount: 55,
        calculatedUSPUnit: 'kg',
        isDiscrepancy: false,
        differenceAmount: 0,
        differencePercentage: 0,
        discrepancyType: 'NONE',
        statusDescription: 'Unit Sale Price mathematically verified: ₹275.00 ÷ 5kg = ₹55.00/kg = ₹0.055/g (100% accurate).',
        ruleReference: 'Rule 6(1)(e) of Legal Metrology (Packaged Commodities) Rules, 2011'
      },
      findings: [
        {
          id: 'f-atta-ok',
          severity: 'SUCCESS',
          title: 'Full Compliance Verified',
          description: 'All 8 mandatory declarations conform to Legal Metrology (Packaged Commodities) Rules, 2011. Unit pricing verified.',
          legalActClause: 'Fully Compliant with Section 18 & 36 of Legal Metrology Act, 2009'
        }
      ],
      boundingBoxes: [
        {
          id: 'bbox-atta-name',
          declarationKey: 'generic_name',
          label: 'Generic Name',
          x: 16.5,
          y: 18.5,
          width: 67,
          height: 4.5,
          confidence: 99.7,
          status: 'PASS',
          extractedText: '100% WHOLE WHEAT CHAKKI ATTA'
        },
        {
          id: 'bbox-atta-qty',
          declarationKey: 'net_quantity',
          label: 'Net Quantity',
          x: 9.5,
          y: 56.5,
          width: 24,
          height: 5.5,
          confidence: 99.1,
          status: 'PASS',
          extractedText: '5 kg'
        },
        {
          id: 'bbox-atta-mrp',
          declarationKey: 'mrp',
          label: 'MRP',
          x: 34.5,
          y: 56.5,
          width: 30,
          height: 5.5,
          confidence: 99.5,
          status: 'PASS',
          extractedText: '₹ 240.00'
        },
        {
          id: 'bbox-atta-usp',
          declarationKey: 'unit_sale_price',
          label: 'Unit Sale Price',
          x: 64.5,
          y: 56.5,
          width: 27,
          height: 5.5,
          confidence: 98.7,
          status: 'PASS',
          extractedText: '₹ 48.00 / kg'
        }
      ],
      ocrMetadata: {
        engine: 'MetrologyLens OCR v2.4 (Transformer/Paddle Engine)',
        processingTimeMs: 345,
        tokensDetected: 156,
        averageConfidence: 98.9
      }
    }
  },
  {
    id: 'demo-powerbank',
    title: 'VoltMax Power Core 20000mAh',
    subtitle: 'Demo Benchmark — Synthetic Sample (Electronics Exemption)',
    badge: '100% OK (Exempt USP)',
    description: 'Synthetic benchmark sample of electronics commodity package with Model, BIS R-number, Voltage rating, and legal exemption for USP.',
    imageUrl: toSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%"><rect width="600" height="800" rx="28" fill="#0f172a"/><rect x="15" y="15" width="570" height="770" rx="20" fill="none" stroke="#64748b" stroke-width="2" stroke-opacity="0.3"/><rect x="60" y="60" width="480" height="75" rx="14" fill="#2563eb"/><text x="300" y="108" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle">VOLTMAX POWER CORE</text><rect x="100" y="148" width="400" height="34" rx="6" fill="#1e293b"/><text x="300" y="171" font-family="Arial, sans-serif" font-weight="700" font-size="14" fill="#93c5fd" text-anchor="middle">20,000 mAh FAST CHARGE POWER BANK</text><circle cx="300" cy="275" r="70" fill="#3b82f6" fill-opacity="0.2"/><text x="300" y="288" font-size="40" text-anchor="middle">⚡🔋</text><rect x="40" y="380" width="520" height="390" rx="12" fill="#ffffff"/><rect x="40" y="380" width="520" height="30" rx="6" fill="#0f172a"/><text x="300" y="400" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#ffffff" text-anchor="middle">STATUTORY ELECTRONICS DECLARATIONS</text><text x="60" y="445" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">NET QUANTITY:</text><text x="60" y="468" font-family="Arial, sans-serif" font-size="17" fill="#0f172a" font-weight="bold">1 Unit (Power Bank + Cable)</text><text x="320" y="445" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">MAX. RETAIL PRICE (MRP):</text><text x="320" y="468" font-family="Arial, sans-serif" font-size="17" fill="#0f172a" font-weight="bold">₹ 1,999.00 (Incl. Taxes)</text><line x1="60" y1="490" x2="540" y2="490" stroke="#e2e8f0" stroke-width="1.5"/><text x="60" y="515" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">MODEL &amp; TYPE:</text><text x="60" y="533" font-family="Arial, sans-serif" font-size="13" fill="#0f172a" font-weight="bold">VM-20K-PRO (Li-Polymer 3.7V)</text><text x="320" y="515" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">RATED INPUT / OUTPUT:</text><text x="320" y="533" font-family="Arial, sans-serif" font-size="13" fill="#0f172a" font-weight="bold">5V⎓3A / 9V⎓2.22A (22.5W Max)</text><line x1="60" y1="555" x2="540" y2="555" stroke="#e2e8f0" stroke-width="1.5"/><text x="60" y="580" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">BIS SAFETY REGISTRATION:</text><text x="60" y="598" font-family="Arial, sans-serif" font-size="13" fill="#16a34a" font-weight="bold">IS 13252 (Part 1) / R-84001928 [ISI MARK]</text><text x="360" y="580" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">MFG / IMPORT DATE:</text><text x="360" y="598" font-family="Arial, sans-serif" font-size="13" fill="#0f172a" font-weight="bold">MAY 2026</text><line x1="60" y1="620" x2="540" y2="620" stroke="#e2e8f0" stroke-width="1.5"/><text x="60" y="645" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">MANUFACTURED / IMPORTED BY:</text><text x="60" y="663" font-family="Arial, sans-serif" font-size="11" fill="#1e293b">VoltMax Tech India Pvt. Ltd., Electronic City Phase-1, Bengaluru 560100</text><line x1="60" y1="685" x2="540" y2="685" stroke="#e2e8f0" stroke-width="1.5"/><text x="60" y="710" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">COUNTRY OF ORIGIN: INDIA | WARRANTY &amp; HELPLINE:</text><text x="60" y="728" font-family="Arial, sans-serif" font-size="11" fill="#1e293b">1 Year Warranty | 1800-889-2233 | support@voltmaxindia.com</text></svg>`),
    mrp: 1999,
    netQuantity: '1 Unit',
    printedUSP: 'EXEMPT',
    data: {
      inspectionId: 'INS-GOI-2026-8845',
      timestamp: new Date().toISOString(),
      inspector: {
        id: 'INS-GOI-2026-8842',
        name: 'Officer A. K. Sharma',
        designation: 'Senior Legal Metrology Officer',
        jurisdiction: 'NCT of Delhi, Zone-IV'
      },
      product: {
        name: 'VoltMax Power Core 20,000 mAh Fast Charge Power Bank',
        brand: 'VoltMax',
        category: 'ELECTRONICS',
        imageUrl: ''
      },
      declarations: [
        {
          id: 'decl-elec-mrp',
          key: 'mrp',
          name: 'Maximum Retail Price (MRP)',
          legalReference: 'Rule 6(1)(e) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: '₹ 1,999.00 (Incl. of all taxes)',
          confidence: 99.2,
          explanation: 'Clear MRP declared with inclusive tax wording.',
          boundingBoxId: 'bbox-elec-mrp'
        },
        {
          id: 'decl-elec-qty',
          key: 'net_quantity',
          name: 'Net Quantity',
          legalReference: 'Rule 6(1)(b) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: '1 Unit (Power Bank + Cable)',
          confidence: 98.4,
          explanation: 'Unit count declared clearly.',
          boundingBoxId: 'bbox-elec-qty'
        },
        {
          id: 'decl-elec-model',
          key: 'model_no',
          name: 'Model & Type Number',
          legalReference: 'Rule 6(1)(a) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'VM-20K-PRO (Li-Polymer 3.7V)',
          confidence: 97.9,
          explanation: 'Model number and battery chemistry specified.',
          boundingBoxId: 'bbox-elec-model'
        },
        {
          id: 'decl-elec-voltage',
          key: 'voltage_power',
          name: 'Rated Voltage & Power Rating',
          legalReference: 'BIS Act, 2016 Standards',
          status: 'PASS',
          extractedValue: '5V⎓3A / 9V⎓2.22A (22.5W Max)',
          confidence: 96.8,
          explanation: 'Input and output electrical parameters declared.',
          boundingBoxId: 'bbox-elec-volt'
        },
        {
          id: 'decl-elec-bis',
          key: 'bis_mark',
          name: 'BIS / ISI Safety Mark',
          legalReference: 'Electronics & IT Goods Compulsory Order, 2021',
          status: 'PASS',
          extractedValue: 'IS 13252 (Part 1) / R-84001928 [ISI MARK]',
          confidence: 99.0,
          explanation: 'Mandatory BIS Safety Standard Registration R-number printed.',
          boundingBoxId: 'bbox-elec-bis'
        },
        {
          id: 'decl-elec-mfg',
          key: 'mfg_date',
          name: 'Month & Year of Import / Mfg',
          legalReference: 'Rule 6(1)(c) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'MAY 2026',
          confidence: 98.1,
          explanation: 'Month and year of manufacture declared.',
          boundingBoxId: 'bbox-elec-mfg'
        },
        {
          id: 'decl-elec-origin',
          key: 'country_of_origin',
          name: 'Country of Origin',
          legalReference: 'Rule 6(10) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'INDIA',
          confidence: 99.5,
          explanation: 'Country of origin statement declared.',
          boundingBoxId: 'bbox-elec-origin'
        },
        {
          id: 'decl-elec-care',
          key: 'customer_care',
          name: 'Customer Service & Warranty Helpline',
          legalReference: 'Rule 6(1)(f) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: '1800-889-2233 | support@voltmaxindia.com',
          confidence: 97.4,
          explanation: 'Warranty period and dedicated service helpline present.',
          boundingBoxId: 'bbox-elec-care'
        },
        {
          id: 'decl-elec-usp',
          key: 'unit_sale_price',
          name: 'Unit Sale Price (USP)',
          legalReference: 'Rule 6(1)(e) - Exemption for Non-Commodity Electronics',
          status: 'EXEMPT',
          extractedValue: 'EXEMPT (Non-Commodity Retail Unit)',
          confidence: 100,
          explanation: 'Statutorily EXEMPT: Non-liquid / non-mass packaged electronics sold by piece are exempt from per-gram USP.',
          boundingBoxId: 'bbox-elec-usp',
          isExempt: true
        }
      ],
      verifiedCount: 8,
      totalCount: 8,
      compliancePercentage: 100,
      overallStatus: 'COMPLIANT',
      pricing: {
        mrpAmount: 1999,
        mrpCurrency: '₹',
        netQuantityValue: 1,
        netQuantityUnit: 'Unit',
        standardizedQuantity: 1,
        standardUnit: 'Unit',
        hasPrintedUSP: false,
        calculatedUSPAmount: 1999,
        calculatedUSPUnit: 'Unit',
        isDiscrepancy: false,
        differenceAmount: 0,
        differencePercentage: 0,
        discrepancyType: 'NONE',
        statusDescription: 'EXEMPT: Package is sold as a discrete single electrical unit.',
        ruleReference: 'Rule 6(1)(e) Exemption Clause'
      },
      findings: [
        {
          id: 'f-elec-1',
          severity: 'SUCCESS',
          title: 'Electronics Category Declarations 100% Verified',
          description: 'Package declares Model number, BIS ISI Registration (R-84001928), and complete importer details.',
          legalActClause: 'Rule 6(1) PCR 2011 & BIS Act, 2016 Compliant'
        }
      ],
      boundingBoxes: [
        {
          id: 'bbox-elec-name',
          declarationKey: 'model_no',
          label: 'Brand & Model',
          x: 10,
          y: 7.5,
          width: 80,
          height: 15,
          confidence: 99.2,
          status: 'PASS',
          extractedText: 'VOLTMAX POWER CORE 20,000 mAh'
        },
        {
          id: 'bbox-elec-mrp',
          declarationKey: 'mrp',
          label: 'MRP',
          x: 52,
          y: 54,
          width: 38,
          height: 6.5,
          confidence: 99.2,
          status: 'PASS',
          extractedText: '₹ 1,999.00'
        },
        {
          id: 'bbox-elec-bis',
          declarationKey: 'bis_mark',
          label: 'BIS Safety Mark',
          x: 9,
          y: 71,
          width: 50,
          height: 5.5,
          confidence: 99.0,
          status: 'PASS',
          extractedText: 'R-84001928 [ISI MARK]'
        }
      ],
      ocrMetadata: {
        engine: 'MetrologyLens OCR v2.4',
        processingTimeMs: 290,
        tokensDetected: 142,
        averageConfidence: 98.4
      }
    }
  },
  {
    id: 'demo-notebook',
    title: 'Classmate Pulse Exercise Notebook 172 Pgs',
    subtitle: 'General / Stationery Category • Dimensions & Pages Verified',
    badge: '100% OK (FSSAI N/A)',
    description: 'Stationery commodity with page count, GSM paper weight, dimensions, and publisher info.',
    imageUrl: toSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%"><rect width="600" height="800" rx="28" fill="#1e1b4b"/><rect x="15" y="15" width="570" height="770" rx="20" fill="none" stroke="#818cf8" stroke-width="2" stroke-opacity="0.3"/><rect x="60" y="60" width="480" height="75" rx="14" fill="#4f46e5"/><text x="300" y="108" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#ffffff" text-anchor="middle">CLASSMATE PULSE NOTEBOOK</text><rect x="100" y="148" width="400" height="34" rx="6" fill="#312e81"/><text x="300" y="171" font-family="Arial, sans-serif" font-weight="700" font-size="14" fill="#c7d2fe" text-anchor="middle">SINGLE LINE LONG EXERCISE BOOK</text><circle cx="300" cy="275" r="70" fill="#6366f1" fill-opacity="0.2"/><text x="300" y="288" font-size="40" text-anchor="middle">📖✏️</text><rect x="40" y="380" width="520" height="390" rx="12" fill="#ffffff"/><rect x="40" y="380" width="520" height="30" rx="6" fill="#1e1b4b"/><text x="300" y="400" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#ffffff" text-anchor="middle">LEGAL METROLOGY (PACKAGED COMMODITIES) DECLARATIONS</text><text x="60" y="445" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">NET QUANTITY / PAGE COUNT:</text><text x="60" y="468" font-family="Arial, sans-serif" font-size="17" fill="#0f172a" font-weight="bold">172 Pages (1 Book)</text><text x="320" y="445" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">MAX. RETAIL PRICE (MRP):</text><text x="320" y="468" font-family="Arial, sans-serif" font-size="17" fill="#0f172a" font-weight="bold">₹ 75.00 (Incl. of all taxes)</text><line x1="60" y1="490" x2="540" y2="490" stroke="#e2e8f0" stroke-width="1.5"/><text x="60" y="515" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">DIMENSIONS / SIZE:</text><text x="60" y="533" font-family="Arial, sans-serif" font-size="13" fill="#0f172a" font-weight="bold">24.0 cm × 18.0 cm (Paper: 70 GSM)</text><text x="320" y="515" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">MONTH &amp; YEAR OF MFG:</text><text x="320" y="533" font-family="Arial, sans-serif" font-size="13" fill="#0f172a" font-weight="bold">JUNE 2026</text><line x1="60" y1="555" x2="540" y2="555" stroke="#e2e8f0" stroke-width="1.5"/><text x="60" y="580" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">MANUFACTURED &amp; MARKETED BY:</text><text x="60" y="598" font-family="Arial, sans-serif" font-size="12" fill="#1e293b">ITC Limited, Paperboards &amp; Specialty Papers Division, Sec-44, Gurugram 122003</text><line x1="60" y1="620" x2="540" y2="620" stroke="#e2e8f0" stroke-width="1.5"/><text x="60" y="645" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">COUNTRY OF ORIGIN:</text><text x="60" y="663" font-family="Arial, sans-serif" font-size="13" fill="#0f172a" font-weight="bold">INDIA</text><line x1="60" y1="685" x2="540" y2="685" stroke="#e2e8f0" stroke-width="1.5"/><text x="60" y="710" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">CONSUMER CARE EXECUTIVE:</text><text x="60" y="728" font-family="Arial, sans-serif" font-size="11" fill="#1e293b">Toll-Free: 1800-425-4444 | Email: classmatecare@itc.in</text></svg>`),
    mrp: 75,
    netQuantity: '172 Pages',
    printedUSP: 'EXEMPT',
    data: {
      inspectionId: 'INS-GOI-2026-8846',
      timestamp: new Date().toISOString(),
      inspector: {
        id: 'INS-GOI-2026-8842',
        name: 'Officer A. K. Sharma',
        designation: 'Senior Legal Metrology Officer',
        jurisdiction: 'NCT of Delhi, Zone-IV'
      },
      product: {
        name: 'Classmate Pulse Exercise Notebook 172 Pgs',
        brand: 'Classmate',
        category: 'GENERAL',
        imageUrl: ''
      },
      declarations: [
        {
          id: 'decl-gen-mrp',
          key: 'mrp',
          name: 'Maximum Retail Price (MRP)',
          legalReference: 'Rule 6(1)(e) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: '₹ 75.00 (Incl. of all taxes)',
          confidence: 99.6,
          explanation: 'Clear MRP declared with tax inclusivity.',
          boundingBoxId: 'bbox-gen-mrp'
        },
        {
          id: 'decl-gen-qty',
          key: 'net_quantity',
          name: 'Net Quantity / Page Count',
          legalReference: 'Rule 6(1)(b) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: '172 Pages (1 Book)',
          confidence: 98.8,
          explanation: 'Page count and piece quantity declared.',
          boundingBoxId: 'bbox-gen-qty'
        },
        {
          id: 'decl-gen-name',
          key: 'generic_name',
          name: 'Product Title & Description',
          legalReference: 'Rule 6(1)(a) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'SINGLE LINE LONG EXERCISE BOOK',
          confidence: 99.1,
          explanation: 'Generic product title and ruling type clearly declared.',
          boundingBoxId: 'bbox-gen-name'
        },
        {
          id: 'decl-gen-dims',
          key: 'dimensions',
          name: 'Dimensions & Paper Specifications',
          legalReference: 'Rule 13 - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: '24.0 cm × 18.0 cm (Paper: 70 GSM)',
          confidence: 97.5,
          explanation: 'Physical dimensions and paper GSM density declared.',
          boundingBoxId: 'bbox-gen-dims'
        },
        {
          id: 'decl-gen-mfg',
          key: 'mfg_date',
          name: 'Month & Year of Manufacture / Publication',
          legalReference: 'Rule 6(1)(c) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'JUNE 2026',
          confidence: 98.2,
          explanation: 'Month and year of manufacture declared.',
          boundingBoxId: 'bbox-gen-mfg'
        },
        {
          id: 'decl-gen-origin',
          key: 'country_of_origin',
          name: 'Country of Origin',
          legalReference: 'Rule 6(10) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'INDIA',
          confidence: 99.5,
          explanation: 'Country of origin statement declared.',
          boundingBoxId: 'bbox-gen-origin'
        },
        {
          id: 'decl-gen-mfr',
          key: 'manufacturer_details',
          name: 'Publisher / Maker Address',
          legalReference: 'Rule 6(1)(d) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'ITC Limited, Paperboards & Specialty Papers Division, Sec-44, Gurugram 122003',
          confidence: 97.9,
          explanation: 'Complete legal entity name and marketing address.',
          boundingBoxId: 'bbox-gen-mfr'
        },
        {
          id: 'decl-gen-care',
          key: 'customer_care',
          name: 'Customer Grievance Helpline',
          legalReference: 'Rule 6(1)(f) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: '1800-425-4444 | classmatecare@itc.in',
          confidence: 98.1,
          explanation: 'Toll-free consumer care helpline and email provided.',
          boundingBoxId: 'bbox-gen-care'
        },
        {
          id: 'decl-gen-fssai',
          key: 'fssai_lic',
          name: 'FSSAI License',
          legalReference: 'FSSAI Regulations - Exempt for Non-Food',
          status: 'NOT_APPLICABLE',
          extractedValue: 'NOT APPLICABLE (Stationery Item)',
          confidence: 100,
          explanation: 'Statutorily NOT APPLICABLE: Non-food items do not require FSSAI certification.',
          boundingBoxId: 'bbox-gen-fssai',
          isExempt: true
        }
      ],
      verifiedCount: 8,
      totalCount: 8,
      compliancePercentage: 100,
      overallStatus: 'COMPLIANT',
      pricing: {
        mrpAmount: 75,
        mrpCurrency: '₹',
        netQuantityValue: 172,
        netQuantityUnit: 'Pages',
        standardizedQuantity: 172,
        standardUnit: 'Pages',
        hasPrintedUSP: false,
        calculatedUSPAmount: 75,
        calculatedUSPUnit: 'Book',
        isDiscrepancy: false,
        differenceAmount: 0,
        differencePercentage: 0,
        discrepancyType: 'NONE',
        statusDescription: 'EXEMPT: Stationery exercise books are sold as discrete items.',
        ruleReference: 'Rule 6(1)(e) Exemption Clause'
      },
      findings: [
        {
          id: 'f-gen-1',
          severity: 'SUCCESS',
          title: 'Stationery Declarations 100% Verified',
          description: 'Package accurately declares Page count (172 Pages), Dimensions (24.0 x 18.0 cm), and Publisher details.',
          legalActClause: 'Rule 6(1) & Rule 13 PCR 2011 Compliant'
        }
      ],
      boundingBoxes: [
        {
          id: 'bbox-gen-name',
          declarationKey: 'generic_name',
          label: 'Brand & Title',
          x: 10,
          y: 7.5,
          width: 80,
          height: 15,
          confidence: 99.1,
          status: 'PASS',
          extractedText: 'CLASSMATE PULSE NOTEBOOK'
        },
        {
          id: 'bbox-gen-mrp',
          declarationKey: 'mrp',
          label: 'MRP',
          x: 52,
          y: 54,
          width: 38,
          height: 6.5,
          confidence: 99.6,
          status: 'PASS',
          extractedText: '₹ 75.00'
        },
        {
          id: 'bbox-gen-dims',
          declarationKey: 'dimensions',
          label: 'Dimensions & GSM',
          x: 9,
          y: 63,
          width: 44,
          height: 6.5,
          confidence: 97.5,
          status: 'PASS',
          extractedText: '24.0 cm × 18.0 cm (70 GSM)'
        }
      ],
      ocrMetadata: {
        engine: 'MetrologyLens OCR v2.4',
        processingTimeMs: 310,
        tokensDetected: 128,
        averageConfidence: 98.7
      }
    }
  },
  {
    id: 'demo-aykara-pharma',
    title: 'Aykara Pharma Ayurvedic Capsules 120 Caps',
    subtitle: 'Demo Benchmark — Synthetic Sample (AYUSH Pharma Registration)',
    badge: '100% Compliant (8/8)',
    description: 'Synthetic benchmark sample of ayurvedic capsule bottle with all mandatory declarations including USP, batch/expiry, manufacturer PIN, and consumer care.',
    imageUrl: toSvgDataUri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
  <rect width="600" height="800" rx="28" fill="#0c4a6e"/>
  <rect x="15" y="15" width="570" height="770" rx="20" fill="none" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.3"/>
  <rect x="60" y="55" width="480" height="80" rx="14" fill="#0284c7"/>
  <text x="300" y="95" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="#ffffff" text-anchor="middle">AYKARA AYUR PHARMA</text>
  <text x="300" y="118" font-family="Arial, sans-serif" font-weight="700" font-size="13" fill="#bae6fd" text-anchor="middle">AYURVEDIC HEALTH CAPSULES</text>
  <rect x="100" y="148" width="400" height="34" rx="6" fill="#075985"/>
  <text x="300" y="171" font-family="Arial, sans-serif" font-weight="700" font-size="13" fill="#7dd3fc" text-anchor="middle">120 CAPSULES (NOS) • MADE IN INDIA</text>
  <circle cx="300" cy="270" r="65" fill="#0ea5e9" fill-opacity="0.15"/>
  <text x="300" y="283" font-size="38" text-anchor="middle">💊🌿</text>
  <rect x="40" y="365" width="520" height="405" rx="12" fill="#ffffff"/>
  <rect x="40" y="365" width="520" height="30" rx="6" fill="#0c4a6e"/>
  <text x="300" y="385" font-family="Arial, sans-serif" font-weight="bold" font-size="12" fill="#ffffff" text-anchor="middle">LEGAL METROLOGY (PACKAGED COMMODITIES) DECLARATIONS</text>
  <text x="60" y="428" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">NET QUANTITY:</text>
  <text x="60" y="450" font-family="Arial, sans-serif" font-size="18" fill="#0f172a" font-weight="bold">120 NOS (Capsules)</text>
  <text x="320" y="428" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">MAX. RETAIL PRICE (MRP):</text>
  <text x="320" y="450" font-family="Arial, sans-serif" font-size="18" fill="#0f172a" font-weight="bold">₹ 2,250.00</text>
  <text x="320" y="464" font-family="Arial, sans-serif" font-size="10" fill="#475569">(Incl. of all taxes)</text>
  <line x1="60" y1="482" x2="540" y2="482" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="60" y="505" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">UNIT SALE PRICE (USP):</text>
  <text x="60" y="523" font-family="Arial, sans-serif" font-size="15" fill="#15803d" font-weight="bold">₹ 18.75 / nos  ✓ (2250 ÷ 120 = 18.75)</text>
  <text x="350" y="505" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">MFG / EXPIRY DATE:</text>
  <text x="350" y="523" font-family="Arial, sans-serif" font-size="13" fill="#0f172a" font-weight="bold">01/04/25 – 01/03/28</text>
  <line x1="60" y1="542" x2="540" y2="542" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="60" y="565" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">MANUFACTURER &amp; MARKETED BY:</text>
  <text x="60" y="583" font-family="Arial, sans-serif" font-size="12" fill="#1e293b">Aykara Ayur Pharma Pvt. Ltd., Industrial Estate, Kollam - 691502, Kerala</text>
  <line x1="60" y1="602" x2="540" y2="602" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="60" y="626" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">COUNTRY OF ORIGIN:</text>
  <text x="60" y="644" font-family="Arial, sans-serif" font-size="13" fill="#0f172a" font-weight="bold">INDIA</text>
  <text x="220" y="626" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">FSSAI / AYUSH LICENSE:</text>
  <text x="220" y="644" font-family="Arial, sans-serif" font-size="12" fill="#15803d" font-weight="bold">AYUSH/R-102/2024 [Valid]</text>
  <line x1="60" y1="662" x2="540" y2="662" stroke="#e2e8f0" stroke-width="1.5"/>
  <text x="60" y="686" font-family="Arial, sans-serif" font-size="11" fill="#64748b" font-weight="bold">CONSUMER CARE:</text>
  <text x="60" y="704" font-family="Arial, sans-serif" font-size="12" fill="#1e293b">Ph: 8281216251 | aykara.care@ayurpharma.in | www.aykarapharma.in</text>
  <rect x="440" y="718" width="110" height="34" rx="8" fill="#dcfce7" stroke="#16a34a" stroke-width="1.5"/>
  <text x="495" y="740" font-family="Arial, sans-serif" font-size="12" fill="#15803d" font-weight="black" text-anchor="middle">✓ 100% OK</text>
</svg>`),
    mrp: 2250,
    netQuantity: '120 NOS',
    printedUSP: '₹ 18.75 / nos',
    data: {
      inspectionId: 'INS-GOI-2026-9001',
      timestamp: new Date().toISOString(),
      inspector: {
        id: 'INS-GOI-2026-8842',
        name: 'Officer A. K. Sharma',
        designation: 'Senior Legal Metrology Officer',
        jurisdiction: 'NCT of Delhi, Zone-IV'
      },
      product: {
        name: 'Aykara Ayurvedic Capsules 120 NOS',
        brand: 'Aykara Ayur Pharma',
        category: 'FOOD',
        imageUrl: ''
      },
      declarations: [
        {
          id: 'decl-pharma-mrp',
          key: 'mrp',
          name: 'Maximum Retail Price (MRP)',
          legalReference: 'Rule 6(1)(e) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: '₹ 2,250.00 (Incl. of all taxes)',
          confidence: 99.5,
          explanation: 'MRP clearly declared with tax inclusivity statement on bottle label.'
        },
        {
          id: 'decl-pharma-qty',
          key: 'net_quantity',
          name: 'Net Quantity',
          legalReference: 'Rule 6(1)(b) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: '120 NOS (Capsules)',
          confidence: 99.8,
          explanation: 'Net quantity declared as 120 NOS (Number of Capsules) — standard count unit.'
        },
        {
          id: 'decl-pharma-usp',
          key: 'unit_sale_price',
          name: 'Unit Sale Price (USP)',
          legalReference: 'Rule 6(1)(e) [Amendment 2021]',
          status: 'PASS',
          extractedValue: '₹ 18.75 / nos',
          confidence: 99.9,
          explanation: 'Mathematical Check: ₹2250 ÷ 120 = ₹18.75/nos. Printed USP is 100% accurate.'
        },
        {
          id: 'decl-pharma-expiry',
          key: 'expiry_date',
          name: 'Mfg Date & Expiry',
          legalReference: 'Rule 6(1)(c) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'MFG: 01/04/2025 | EXP: 01/03/2028 (3 Years)',
          confidence: 99.7,
          explanation: 'Manufacture and expiry dates clearly stated. Valid 3-year shelf life declared.'
        },
        {
          id: 'decl-pharma-fssai',
          key: 'fssai_lic',
          name: 'AYUSH / FSSAI License',
          legalReference: 'FSSAI / AYUSH Packaging Regulations',
          status: 'PASS',
          extractedValue: 'AYUSH/R-102/2024 [Valid Registration]',
          confidence: 98.8,
          explanation: 'Valid AYUSH registration number confirmed for ayurvedic formulation.'
        },
        {
          id: 'decl-pharma-origin',
          key: 'country_of_origin',
          name: 'Country of Origin',
          legalReference: 'Rule 6(10) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'INDIA',
          confidence: 99.9,
          explanation: 'Country of origin declared as INDIA on bottle label.'
        },
        {
          id: 'decl-pharma-mfr',
          key: 'manufacturer_details',
          name: 'Manufacturer & Address with PIN',
          legalReference: 'Rule 6(1)(d) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'Aykara Ayur Pharma Pvt. Ltd., Industrial Estate, Kollam - 691502, Kerala',
          confidence: 99.6,
          explanation: 'Full manufacturer name, address, and PIN code (691502) declared. Rule 6(1)(d) compliant.'
        },
        {
          id: 'decl-pharma-care',
          key: 'customer_care',
          name: 'Consumer Care Contact',
          legalReference: 'Rule 6(1)(f) - Legal Metrology (PC) Rules, 2011',
          status: 'PASS',
          extractedValue: 'Ph: 8281216251 | aykara.care@ayurpharma.in',
          confidence: 99.4,
          explanation: 'Active phone number and verified consumer care email provided.'
        }
      ],
      pricing: {
        mrpAmount: 2250,
        mrpCurrency: '₹',
        netQuantityValue: 120,
        netQuantityUnit: 'nos',
        standardizedQuantity: 120,
        standardUnit: 'nos',
        hasPrintedUSP: true,
        printedUSPAmount: 18.75,
        printedUSPUnit: 'nos',
        printedUSPText: '₹ 18.75 / nos',
        calculatedUSPAmount: 18.75,
        calculatedUSPUnit: 'nos',
        isDiscrepancy: false,
        differenceAmount: 0,
        differencePercentage: 0,
        discrepancyType: 'NONE',
        statusDescription: 'Unit Sale Price is mathematically accurate. ₹2250 ÷ 120 = ₹18.75/nos.',
        ruleReference: 'Rule 6(1)(e) - Legal Metrology (Packaged Commodities) Amendment Rules, 2021'
      },
      findings: [
        {
          id: 'find-pharma-1',
          severity: 'SUCCESS',
          title: 'Perfect Statutory Compliance',
          description: 'All 8 mandatory declarations under Legal Metrology (PC) Rules 2011 are present, accurate, and mathematically verified.',
          legalActClause: 'Rule 6(1)(a-f) & Rule 6(10) - Legal Metrology Act, 2009'
        },
        {
          id: 'find-pharma-2',
          severity: 'SUCCESS',
          title: 'USP Mathematical Audit Passed',
          description: '₹2,250.00 ÷ 120 NOS = ₹18.75/nos. Printed USP matches the statutory calculation exactly.',
          legalActClause: 'Rule 6(1)(e) [Amendment 2021]'
        }
      ],
      verifiedCount: 8,
      totalCount: 8,
      compliancePercentage: 100,
      overallStatus: 'COMPLIANT',
      boundingBoxes: [
        {
          id: 'bbox-pharma-mrp',
          declarationKey: 'mrp',
          label: 'MRP',
          x: 53, y: 42, width: 37, height: 5.5,
          confidence: 99.5, status: 'PASS',
          extractedText: '₹ 2,250.00 (Incl. of all taxes)'
        },
        {
          id: 'bbox-pharma-qty',
          declarationKey: 'net_quantity',
          label: 'Net Qty',
          x: 10, y: 42, width: 35, height: 5.5,
          confidence: 99.8, status: 'PASS',
          extractedText: '120 NOS'
        },
        {
          id: 'bbox-pharma-usp',
          declarationKey: 'unit_sale_price',
          label: 'USP ✓',
          x: 10, y: 53.5, width: 55, height: 5,
          confidence: 99.9, status: 'PASS',
          extractedText: '₹ 18.75 / nos'
        },
        {
          id: 'bbox-pharma-expiry',
          declarationKey: 'expiry_date',
          label: 'MFG/EXP',
          x: 58, y: 53.5, width: 33, height: 5,
          confidence: 99.7, status: 'PASS',
          extractedText: '01/04/25 – 01/03/28'
        },
        {
          id: 'bbox-pharma-mfr',
          declarationKey: 'manufacturer_details',
          label: 'Manufacturer',
          x: 10, y: 64, width: 80, height: 5,
          confidence: 99.6, status: 'PASS',
          extractedText: 'Aykara Ayur Pharma, Kollam-691502'
        },
        {
          id: 'bbox-pharma-care',
          declarationKey: 'customer_care',
          label: 'Care',
          x: 10, y: 74, width: 70, height: 5,
          confidence: 99.4, status: 'PASS',
          extractedText: 'Ph: 8281216251 | aykara.care@ayurpharma.in'
        }
      ],
      ocrMetadata: {
        engine: 'MetrologyLens OCR v2.4 (Transformer Engine)',
        processingTimeMs: 318,
        tokensDetected: 164,
        averageConfidence: 99.6
      }
    }
  }
];

