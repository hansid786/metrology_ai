export interface VerifiedProductRecord {
  barcode: string;
  name: string;
  brand: string;
  category: 'FOOD' | 'PHARMA' | 'ELECTRONICS' | 'GENERAL' | 'COSMETICS';
  officialMrp: number;
  netQuantity: string;
  netQuantityValue: number;
  netQuantityUnit: string;
  calculatedUSP: string;
  fssaiNumber?: string;
  drugLic?: string;
  bisLic?: string;
  manufacturer: string;
  manufacturerAddress: string;
  pinCode: string;
  customerCare: string;
  countryOfOrigin: string;
  verifiedIngredients: string[];
  allergens: string[];
  imageUrl?: string;
}

export const INDIAN_PRODUCT_MASTER_DB: Record<string, VerifiedProductRecord> = {
  // 1. Maggi 2-Minute Noodles (70g)
  '8901058852393': {
    barcode: '8901058852393',
    name: 'Maggi 2-Minute Masala Instant Noodles 70g',
    brand: 'Nestlé Maggi',
    category: 'FOOD',
    officialMrp: 14.00,
    netQuantity: '70 g',
    netQuantityValue: 70,
    netQuantityUnit: 'g',
    calculatedUSP: '₹ 0.20 / g',
    fssaiNumber: '10012011000168',
    manufacturer: 'Nestlé India Limited',
    manufacturerAddress: '100/101, World Trade Centre, Barakhamba Lane, New Delhi',
    pinCode: '110001',
    customerCare: '1800-103-1947 | wecare@in.nestle.com',
    countryOfOrigin: 'INDIA',
    verifiedIngredients: ['Refined Wheat Flour (Maida)', 'Palm Oil', 'Salt', 'Spices & Condiments', 'Hydrolysed Groundnut Protein', 'Acidity Regulators (INS 501(i), INS 500(i))', 'Flavor Enhancers (INS 635)'],
    allergens: ['Gluten', 'Peanut']
  },

  // 2. Parle-G Original Glucose Biscuits (250g)
  '8901719101037': {
    barcode: '8901719101037',
    name: 'Parle-G Original Gluco Biscuits 250g',
    brand: 'Parle',
    category: 'FOOD',
    officialMrp: 25.00,
    netQuantity: '250 g',
    netQuantityValue: 250,
    netQuantityUnit: 'g',
    calculatedUSP: '₹ 0.10 / g',
    fssaiNumber: '10013022002253',
    manufacturer: 'Parle Products Pvt. Ltd.',
    manufacturerAddress: 'North Level Crossing, Vile Parle East, Mumbai, Maharashtra',
    pinCode: '400057',
    customerCare: '1800-22-2090 | cs@parle.biz',
    countryOfOrigin: 'INDIA',
    verifiedIngredients: ['Wheat Flour (Atta)', 'Sugar', 'Edible Vegetable Oil (Palmolein)', 'Invert Sugar Syrup', 'Raising Agents (INS 503(ii), INS 500(ii))', 'Milk Solids', 'Salt', 'Emulsifier (INS 471)'],
    allergens: ['Gluten', 'Milk']
  },

  // 3. Lay's India's Magic Masala (50g)
  '8901491101830': {
    barcode: '8901491101830',
    name: "Lay's India's Magic Masala Potato Chips 50g",
    brand: "Lay's",
    category: 'FOOD',
    officialMrp: 20.00,
    netQuantity: '50 g',
    netQuantityValue: 50,
    netQuantityUnit: 'g',
    calculatedUSP: '₹ 0.40 / g',
    fssaiNumber: '10014064000435',
    manufacturer: 'PepsiCo India Holdings Pvt. Ltd.',
    manufacturerAddress: 'Level 3-6, Pioneer Square, Sector 62, Near Golf Course Ext. Road, Gurugram, Haryana',
    pinCode: '122101',
    customerCare: '1800-22-4020 | consumer.feedback@pepsico.com',
    countryOfOrigin: 'INDIA',
    verifiedIngredients: ['Potato', 'Edible Vegetable Oil (Palmolein)', 'Spices and Condiments (Onion Powder, Chilli Powder, Dry Mango Powder, Coriander Powder, Ginger Powder, Garlic Powder)', 'Salt', 'Black Salt', 'Sugar', 'Acidity Regulator (INS 330)'],
    allergens: []
  },

  // 4. Crunchy Supreme Potato Chips 250g (Demo 1)
  '8904018800421': {
    barcode: '8904018800421',
    name: 'Crunchy Supreme Potato Chips - Classic Salted 250g',
    brand: 'Crunchy Supreme',
    category: 'FOOD',
    officialMrp: 50.00,
    netQuantity: '250 g',
    netQuantityValue: 250,
    netQuantityUnit: 'g',
    calculatedUSP: '₹ 0.20 / g',
    fssaiNumber: '11521018000214',
    manufacturer: 'Apex Snack Foods Pvt. Ltd.',
    manufacturerAddress: 'Plot 42, Food Park, Okhla Phase-III, New Delhi',
    pinCode: '110020',
    customerCare: '1800-112-990 | care@crunchysupreme.in',
    countryOfOrigin: 'INDIA',
    verifiedIngredients: ['Potato', 'Edible Vegetable Oil (Palmolein)', 'Iodised Salt', 'Tartrazine (INS 102)', 'Flavor Enhancer (INS 621)', 'Antioxidant BHA (INS 320)'],
    allergens: ['Gluten', 'Soy']
  },

  // 5. Fortune Sunlite Refined Sunflower Oil 1L
  '8906007280014': {
    barcode: '8906007280014',
    name: 'Fortune Sunlite Refined Sunflower Oil 1 Litre',
    brand: 'Fortune',
    category: 'FOOD',
    officialMrp: 165.00,
    netQuantity: '1 L',
    netQuantityValue: 1,
    netQuantityUnit: 'L',
    calculatedUSP: '₹ 165.00 / L',
    fssaiNumber: '10013021000561',
    manufacturer: 'Adani Wilmar Limited',
    manufacturerAddress: 'Fortune House, Near Navrangpura Railway Crossing, Ahmedabad, Gujarat',
    pinCode: '380009',
    customerCare: '1800-233-9999 | care@adaniwilmar.in',
    countryOfOrigin: 'INDIA',
    verifiedIngredients: ['Refined Sunflower Oil', 'Vitamin A', 'Vitamin D', 'Antioxidant (INS 319)'],
    allergens: []
  },

  // 6. Amul Butter Pasteurized 100g
  '8901262010025': {
    barcode: '8901262010025',
    name: 'Amul Pasteurized Butter 100g',
    brand: 'Amul',
    category: 'FOOD',
    officialMrp: 60.00,
    netQuantity: '100 g',
    netQuantityValue: 100,
    netQuantityUnit: 'g',
    calculatedUSP: '₹ 0.60 / g',
    fssaiNumber: '10012021000071',
    manufacturer: 'Gujarat Co-operative Milk Marketing Federation Ltd. (GCMMF)',
    manufacturerAddress: 'Amul Dairy Road, Anand, Gujarat',
    pinCode: '388001',
    customerCare: '1800-258-3333 | customercare@amul.coop',
    countryOfOrigin: 'INDIA',
    verifiedIngredients: ['Butter (Pasteurized Cream from Cow/Buffalo Milk)', 'Common Salt', 'Permitted Natural Color (INS 160a(i) Annatto)'],
    allergens: ['Milk']
  },

  // 7. Dolo 650 Paracetamol Tablets (15 Tablets)
  '8901117002014': {
    barcode: '8901117002014',
    name: 'Dolo 650 Paracetamol Tablets IP (Strip of 15 Tablets)',
    brand: 'Micro Labs Dolo',
    category: 'PHARMA',
    officialMrp: 33.60,
    netQuantity: '15 Tablets',
    netQuantityValue: 15,
    netQuantityUnit: 'Tablets',
    calculatedUSP: '₹ 2.24 / Tablet',
    drugLic: 'MFG/KTK/25/487/2020',
    manufacturer: 'Micro Labs Limited',
    manufacturerAddress: 'No. 92, Sipcot Industrial Complex, Phase-I, Hosur, Tamil Nadu',
    pinCode: '635126',
    customerCare: '080-22234073 | regulatory@microlabs.in',
    countryOfOrigin: 'INDIA',
    verifiedIngredients: ['Paracetamol IP 650mg', 'Excipients q.s.'],
    allergens: []
  },

  // 8. VoltMax Power Core 20000mAh Power Bank
  '8908849201994': {
    barcode: '8908849201994',
    name: 'VoltMax Power Core 20000mAh Fast Charging Power Bank',
    brand: 'VoltMax',
    category: 'ELECTRONICS',
    officialMrp: 2499.00,
    netQuantity: '1 Unit',
    netQuantityValue: 1,
    netQuantityUnit: 'Unit',
    calculatedUSP: '₹ 2499.00 / Unit',
    bisLic: 'R-84001928 (IS 13252 Part 1)',
    manufacturer: 'VoltMax Tech India Pvt. Ltd.',
    manufacturerAddress: 'Plot 18, Electronics City Phase-II, Bengaluru, Karnataka',
    pinCode: '560100',
    customerCare: '1800-889-2233 | support@voltmaxindia.com',
    countryOfOrigin: 'INDIA',
    verifiedIngredients: [],
    allergens: []
  }
};
