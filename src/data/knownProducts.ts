import { ProductCategory } from '../types/inspection';

export interface KnownProductSpec {
  id: string;
  keywords: string[];
  name: string;
  brand: string;
  category: ProductCategory;
  mrp: number;
  netQuantityValue: number;
  netQuantityUnit: string;
  manufacturer: string;
  fssaiLicense?: string;
  drugLicense?: string;
  bisLicense?: string;
  customerCare: string;
  countryOfOrigin: string;
  shelfLife: string;
  quickPillLabel: string;
}

export const KNOWN_INDIAN_PRODUCTS: KnownProductSpec[] = [
  {
    id: 'prod-maggi-noodles',
    keywords: ['maggi', 'noodle', 'nestle', 'masala noodles', '2-minute'],
    name: 'Maggi 2-Minute Masala Instant Noodles 70g',
    brand: 'Nestle India',
    category: 'FOOD',
    mrp: 14.0,
    netQuantityValue: 70,
    netQuantityUnit: 'g',
    manufacturer: 'Nestle India Limited, 100/101, World Trade Centre, Barakhamba Lane, New Delhi - 110001 (Mfg: Tahliwal, Una, HP - 174301)',
    fssaiLicense: '10012011000168',
    customerCare: '1800-103-1947 | wecare@in.nestle.com',
    countryOfOrigin: 'INDIA',
    shelfLife: '9 Months from Date of Packaging',
    quickPillLabel: 'Maggi Rs 14 (70g)'
  },
  {
    id: 'prod-kurkure-munch',
    keywords: ['kurkure', 'masala munch', 'pepsico', 'tedhe medhe'],
    name: 'Kurkure Masala Munch Crispy Snack 85g',
    brand: 'PepsiCo India',
    category: 'FOOD',
    mrp: 20.0,
    netQuantityValue: 85,
    netQuantityUnit: 'g',
    manufacturer: 'PepsiCo India Holdings Pvt. Ltd., Level 3-6, Pioneer Square, Sector 62, Golf Course Ext. Rd, Gurugram, Haryana - 122102',
    fssaiLicense: '10014064000435',
    customerCare: '1800-224-020 | consumer.feedback@pepsico.com',
    countryOfOrigin: 'INDIA',
    shelfLife: '4 Months from Date of Packaging',
    quickPillLabel: 'Kurkure Rs 20 (85g)'
  },
  {
    id: 'prod-lays-chips',
    keywords: ['lays', 'magic masala', 'classic salted', 'potato chips'],
    name: 'Lays Indias Magic Masala Potato Chips 50g',
    brand: 'PepsiCo India',
    category: 'FOOD',
    mrp: 20.0,
    netQuantityValue: 50,
    netQuantityUnit: 'g',
    manufacturer: 'PepsiCo India Holdings Pvt. Ltd., Village Channo, Patiala-Sangrur Road, Sangrur, Punjab - 148026',
    fssaiLicense: '10014063000402',
    customerCare: '1800-224-020 | consumer.feedback@pepsico.com',
    countryOfOrigin: 'INDIA',
    shelfLife: '4 Months from Date of Packaging',
    quickPillLabel: 'Lays Rs 20 (50g)'
  },
  {
    id: 'prod-parle-g',
    keywords: ['parle-g', 'parleg', 'parle g', 'glucose biscuit', 'parle'],
    name: 'Parle-G Original Gluco Biscuits 130g',
    brand: 'Parle Products',
    category: 'FOOD',
    mrp: 10.0,
    netQuantityValue: 130,
    netQuantityUnit: 'g',
    manufacturer: 'Parle Products Pvt. Ltd., V.S. Khandekar Marg, Vile Parle East, Mumbai, Maharashtra - 400057',
    fssaiLicense: '10013022002253',
    customerCare: '022-66916911 | cs@parle.biz',
    countryOfOrigin: 'INDIA',
    shelfLife: '6 Months from Date of Packaging',
    quickPillLabel: 'Parle-G Rs 10 (130g)'
  },
  {
    id: 'prod-good-day',
    keywords: ['good day', 'goodday', 'butter cookies', 'britannia', 'bourbon', 'marie'],
    name: 'Britannia Good Day Rich Butter Cookies 120g',
    brand: 'Britannia Industries',
    category: 'FOOD',
    mrp: 30.0,
    netQuantityValue: 120,
    netQuantityUnit: 'g',
    manufacturer: 'Britannia Industries Limited, 5/1A Hungerford Street, Kolkata, West Bengal - 700017',
    fssaiLicense: '10015047000400',
    customerCare: '1800-4254449 | feedback@britindia.com',
    countryOfOrigin: 'INDIA',
    shelfLife: '6 Months from Date of Packaging',
    quickPillLabel: 'Good Day Rs 30 (120g)'
  },
  {
    id: 'prod-amul-butter',
    keywords: ['amul', 'butter', 'gcmmf', 'amul butter', 'pasteurized butter', 'pure ghee'],
    name: 'Amul Pasteurized Salted Butter 100g',
    brand: 'Amul (GCMMF)',
    category: 'FOOD',
    mrp: 58.0,
    netQuantityValue: 100,
    netQuantityUnit: 'g',
    manufacturer: 'Gujarat Cooperative Milk Marketing Federation Ltd. (GCMMF), Amul Dairy Road, Anand, Gujarat - 388001',
    fssaiLicense: '10012021000071',
    customerCare: '1800-258-3333 | customercare@amul.coop',
    countryOfOrigin: 'INDIA',
    shelfLife: '9 Months from Date of Packaging (Store below 4C)',
    quickPillLabel: 'Amul Butter Rs 58 (100g)'
  },
  {
    id: 'prod-fortune-oil',
    keywords: ['fortune', 'sunflower oil', 'mustard oil', 'refined oil', 'adani wilmar', 'cooking oil'],
    name: 'Fortune Sunlite Refined Sunflower Cooking Oil 1L',
    brand: 'Fortune (Adani Wilmar)',
    category: 'FOOD',
    mrp: 160.0,
    netQuantityValue: 1,
    netQuantityUnit: 'L',
    manufacturer: 'Adani Wilmar Limited, Fortune House, Near Navrangpura Railway Crossing, Ahmedabad, Gujarat - 380009',
    fssaiLicense: '10013021000561',
    customerCare: '1800-233-9999 | care@adaniwilmar.in',
    countryOfOrigin: 'INDIA',
    shelfLife: '9 Months from Date of Packaging',
    quickPillLabel: 'Fortune Oil Rs 160 (1L)'
  },
  {
    id: 'prod-aashirvaad-atta',
    keywords: ['aashirvaad', 'ashirvad', 'atta', 'wheat flour', 'mp atta', 'itc atta'],
    name: 'Aashirvaad Superior MP Whole Wheat Atta 5kg',
    brand: 'Aashirvaad (ITC)',
    category: 'FOOD',
    mrp: 265.0,
    netQuantityValue: 5,
    netQuantityUnit: 'kg',
    manufacturer: 'ITC Limited, 37, J.L. Nehru Road, Kolkata, West Bengal - 700071 (Unit: Haridwar, UK)',
    fssaiLicense: '10012031000312',
    customerCare: '1800-425-4444 | itccares@itc.in',
    countryOfOrigin: 'INDIA',
    shelfLife: '3 Months from Date of Packaging (Store Cool & Dry)',
    quickPillLabel: 'Aashirvaad Atta Rs 265 (5kg)'
  },
  {
    id: 'prod-dairy-milk',
    keywords: ['dairy milk', 'dairymilk', 'cadbury', 'mondelez', 'silk', 'chocolate'],
    name: 'Cadbury Dairy Milk Chocolate Bar 50g',
    brand: 'Cadbury (Mondelez)',
    category: 'FOOD',
    mrp: 40.0,
    netQuantityValue: 50,
    netQuantityUnit: 'g',
    manufacturer: 'Mondelez India Foods Pvt. Ltd., Unit No. 2001, 20th Floor, Tower-3, Indiabulls Finance Centre, Parel, Mumbai - 400013',
    fssaiLicense: '10014022002711',
    customerCare: '1800-22-7080 | suggestions@mdlz.com',
    countryOfOrigin: 'INDIA',
    shelfLife: '12 Months from Date of Packaging',
    quickPillLabel: 'Dairy Milk Rs 40 (50g)'
  },
  {
    id: 'prod-tata-salt',
    keywords: ['tata salt', 'tatasalt', 'namak', 'iodised salt', 'tata consumer'],
    name: 'Tata Salt Vacuum Evaporated Iodised Salt 1kg',
    brand: 'Tata Salt',
    category: 'FOOD',
    mrp: 28.0,
    netQuantityValue: 1,
    netQuantityUnit: 'kg',
    manufacturer: 'Tata Consumer Products Limited, 1, Bishop Lefroy Road, Kolkata, West Bengal - 700020 (Works: Mithapur, Gujarat)',
    fssaiLicense: '10014031001025',
    customerCare: '1800-345-1720 | care@tataconsumer.com',
    countryOfOrigin: 'INDIA',
    shelfLife: '24 Months from Date of Packing',
    quickPillLabel: 'Tata Salt Rs 28 (1kg)'
  },
  {
    id: 'prod-dolo-650',
    keywords: ['dolo', 'dolo-650', 'dolo 650', 'paracetamol 650', 'micro labs', 'fever tablet'],
    name: 'Dolo 650 Paracetamol 650mg Tablets (15 Tabs)',
    brand: 'Micro Labs',
    category: 'PHARMA',
    mrp: 31.5,
    netQuantityValue: 15,
    netQuantityUnit: 'Tablets',
    manufacturer: 'Micro Labs Limited, 31, Race Course Road, Bengaluru, Karnataka - 560001 (Mfg: Kumbalgodu, Bengaluru)',
    drugLicense: 'KTK/25/448/2001',
    customerCare: '080-22261075 | info@microlabs.in',
    countryOfOrigin: 'INDIA',
    shelfLife: '36 Months from Date of Manufacture',
    quickPillLabel: 'Dolo 650 Rs 31.50 (15 Tabs)'
  },
  {
    id: 'prod-dabur-honey',
    keywords: ['dabur honey', 'dabur', 'honey', 'chyawanprash', 'pudin hara'],
    name: 'Dabur 100% Pure Squeezy Honey 500g',
    brand: 'Dabur India',
    category: 'FOOD',
    mrp: 199.0,
    netQuantityValue: 500,
    netQuantityUnit: 'g',
    manufacturer: 'Dabur India Limited, 8/3, Asaf Ali Road, New Delhi - 110002 (Unit: Pantnagar, Uttarakhand)',
    fssaiLicense: '10013011001140',
    customerCare: '1800-103-1644 | daburcares@dabur.com',
    countryOfOrigin: 'INDIA',
    shelfLife: '18 Months from Date of Packaging',
    quickPillLabel: 'Dabur Honey Rs 199 (500g)'
  },
  {
    id: 'prod-classmate-notebook',
    keywords: ['classmate', 'notebook', 'itc classmate', 'copy', 'register', 'ruled book'],
    name: 'Classmate Long Ruled Metric Notebook 172 Pages',
    brand: 'Classmate (ITC)',
    category: 'GENERAL',
    mrp: 60.0,
    netQuantityValue: 172,
    netQuantityUnit: 'Pages',
    manufacturer: 'ITC Limited, ESPB, 10, J.C. Bose Road, Kolkata, West Bengal - 700020 (Rule 13 GSM 70 Verified)',
    customerCare: '1800-425-4444 | classmate@itc.in',
    countryOfOrigin: 'INDIA',
    shelfLife: 'Non-Perishable [Statutory Metric Standards Rule 13 Verified]',
    quickPillLabel: 'Classmate Rs 60 (172 Pgs)'
  },
  {
    id: 'prod-boat-powerbank',
    keywords: ['powerbank', 'power bank', 'boat', 'voltmax', 'charger', 'battery pack', '10000mah', '20000mah'],
    name: 'boAt Energyshroom 10000mAh Fast Charging Power Bank',
    brand: 'boAt (Imagine Mktg)',
    category: 'ELECTRONICS',
    mrp: 1299.0,
    netQuantityValue: 1,
    netQuantityUnit: 'Unit',
    manufacturer: 'Imagine Marketing Limited, Unit 505, Supreme Chambers, Off Link Road, Andheri West, Mumbai - 400053',
    bisLicense: 'BIS R-84001928 (IS 13252: Part 1)',
    customerCare: '022-6918-1920 | info@imaginemarketingindia.com',
    countryOfOrigin: 'INDIA',
    shelfLife: 'Electronic Hardware [Expiry Exempt per Rule 6]',
    quickPillLabel: 'Power Bank Rs 1,299 (BIS)'
  },
  {
    id: 'prod-kissan-ketchup',
    keywords: ['kissan', 'ketchup', 'tomato sauce', 'hul kissan', 'sauce'],
    name: 'Kissan Fresh Tomato Ketchup Bottle 950g',
    brand: 'Kissan (HUL)',
    category: 'FOOD',
    mrp: 135.0,
    netQuantityValue: 950,
    netQuantityUnit: 'g',
    manufacturer: 'Hindustan Unilever Limited (HUL), Unilever House, B.D. Sawant Marg, Chakala, Andheri East, Mumbai - 400099',
    fssaiLicense: '10012022000258',
    customerCare: '1800-10-22-221 | lever.care@unilever.com',
    countryOfOrigin: 'INDIA',
    shelfLife: '12 Months from Date of Manufacture',
    quickPillLabel: 'Kissan Ketchup Rs 135 (950g)'
  },
  {
    id: 'prod-colgate-toothpaste',
    keywords: ['colgate', 'toothpaste', 'maxfresh', 'strong teeth', 'colgate-palmolive'],
    name: 'Colgate Strong Teeth Dental Cream Toothpaste 150g',
    brand: 'Colgate-Palmolive',
    category: 'GENERAL',
    mrp: 115.0,
    netQuantityValue: 150,
    netQuantityUnit: 'g',
    manufacturer: 'Colgate-Palmolive (India) Limited, Colgate Research Centre, Main Street, Hiranandani Gardens, Powai, Mumbai - 400076',
    drugLicense: 'KD/C/213-A',
    customerCare: '1800-225599 | consumeraffairs_india@colpal.com',
    countryOfOrigin: 'INDIA',
    shelfLife: '24 Months from Date of Manufacture',
    quickPillLabel: 'Colgate Rs 115 (150g)'
  }
];

export function findKnownIndianProduct(textOrFilename: string, category?: ProductCategory): KnownProductSpec | null {
  if (!textOrFilename) return null;
  const lower = textOrFilename.toLowerCase();

  for (const prod of KNOWN_INDIAN_PRODUCTS) {
    if (category && prod.category !== category) continue;
    const isMatch = prod.keywords.some(kw => lower.includes(kw));
    if (isMatch) return prod;
  }

  for (const prod of KNOWN_INDIAN_PRODUCTS) {
    const isMatch = prod.keywords.some(kw => lower.includes(kw));
    if (isMatch) return prod;
  }

  return null;
}
