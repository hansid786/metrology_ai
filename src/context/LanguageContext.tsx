import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const dictionary: Translations = {
  // Required Master Checklist Translations
  legalMetrology: {
    en: 'Legal Metrology',
    hi: 'विधिक मापविज्ञान',
  },
  mandatoryDeclarations: {
    en: 'Mandatory Declarations',
    hi: 'अनिवार्य विधिक घोषणाएं',
  },
  passedCompliant: {
    en: '🟢 Compliant (Verified)',
    hi: '🟢 मान्य (सत्यापित)',
  },
  violationDetected: {
    en: '🔴 Violation Detected',
    hi: '🔴 नियम उल्लंघन',
  },
  unitSalePrice: {
    en: 'Unit Sale Price (USP)',
    hi: 'प्रति इकाई विक्रय मूल्य',
  },
  downloadPDF: {
    en: 'Download PDF Report',
    hi: 'निरीक्षण रिपोर्ट डाउनलोड करें',
  },

  // Common & Header
  portalTitle: {
    en: 'National Legal Metrology Portal',
    hi: 'राष्ट्रीय विधिक मापविज्ञान पोर्टल',
  },
  deptName: {
    en: 'Department of Consumer Affairs • Govt. of India',
    hi: 'उपभोक्ता मामले विभाग • भारत सरकार',
  },
  helpline: {
    en: 'National Consumer Helpline',
    hi: 'राष्ट्रीय उपभोक्ता हेल्पलाइन',
  },
  call1915: {
    en: 'Toll-Free: 1915',
    hi: 'टोल-फ्री: 1915',
  },
  consumerDesk: {
    en: 'Consumer Desk',
    hi: 'उपभोक्ता डेस्क',
  },
  officerPortal: {
    en: 'Officer Portal',
    hi: 'अधिकारी पोर्टल',
  },
  myScans: {
    en: 'My Scans',
    hi: 'मेरे स्कैन',
  },
  switchPortal: {
    en: 'Switch Portal',
    hi: 'पोर्टल बदलें',
  },

  // Navigation Items
  dashboardOverview: {
    en: 'Dashboard Overview',
    hi: 'डैशबोर्ड अवलोकन',
  },
  newFieldInspection: {
    en: 'New Field Inspection',
    hi: 'नया क्षेत्रीय निरीक्षण',
  },
  inspectionRecords: {
    en: 'Inspection Records',
    hi: 'निरीक्षण रिकॉर्ड्स',
  },
  nationalAnalytics: {
    en: 'National Analytics',
    hi: 'राष्ट्रीय विश्लेषण',
  },
  complianceRuleMatrix: {
    en: 'Compliance Rule Matrix',
    hi: 'अनुपालन नियम मैट्रिक्स',
  },
  officialReports: {
    en: 'Official Reports (PC-1)',
    hi: 'आधिकारिक रिपोर्ट (PC-1)',
  },
  officerSettings: {
    en: 'Officer Settings',
    hi: 'अधिकारी सेटिंग्स',
  },
  switchToConsumer: {
    en: 'Switch to Consumer Portal',
    hi: 'उपभोक्ता पोर्टल पर जाएं',
  },

  // Login Gateway
  selectProfile: {
    en: 'Select Your Portal Entry',
    hi: 'अपना पोर्टल चुनें',
  },
  selectProfileSubtitle: {
    en: 'Please choose whether you are a Consumer or an Enforcement Officer',
    hi: 'कृपया चुनें कि आप एक आम उपभोक्ता हैं या विभागीय अधिकारी',
  },
  citizenCardTitle: {
    en: 'Citizen / Consumer',
    hi: 'आम नागरिक / उपभोक्ता',
  },
  citizenCardSub: {
    en: 'Jago Grahak Jago Desk',
    hi: 'जागो ग्राहक जागो डेस्क',
  },
  officerCardTitle: {
    en: 'Enforcement Officer',
    hi: 'विभागीय प्रवर्तन अधिकारी',
  },
  officerCardSub: {
    en: 'LMO / Controller Portal',
    hi: 'LMO / नियंत्रक पोर्टल',
  },
  loginAsConsumer: {
    en: 'Login as Consumer',
    hi: 'उपभोक्ता के रूप में लॉगिन करें',
  },
  loginAsOfficer: {
    en: 'Login as Officer',
    hi: 'अधिकारी के रूप में लॉगिन करें',
  },
  officerPasscodeLogin: {
    en: 'Official Passcode Login',
    hi: 'पासकोड से लॉगिन करें',
  },

  // Consumer Scan Page
  scanBannerTitle: {
    en: 'Scan Any Product Package in 5 Seconds',
    hi: 'किसी भी पैकेट को 5 सेकंड में स्कैन करें',
  },
  scanBannerSub: {
    en: 'Verify Maximum Retail Price (MRP), check for hidden price overcharging (USP), and verify Expiry Date & FSSAI / BIS licenses before purchasing!',
    hi: 'अधिकतम खुदरा मूल्य (MRP) की जांच करें, छुपी हुई अधिक वसूली (USP) पकड़ें, और एक्सपायरी डेट व FSSAI / BIS लाइसेंस सत्यापित करें!',
  },
  step1Category: {
    en: '1. Select Product Category',
    hi: '1. उत्पाद श्रेणी चुनें',
  },
  step2Media: {
    en: '2. Capture Photo with Live Camera or Upload',
    hi: '2. लाइव कैमरा से फोटो लें या गैलरी से अपलोड करें',
  },
  openLiveCamera: {
    en: 'Open Live Camera & Snap',
    hi: 'लाइव कैमरा खोलें और फोटो लें',
  },
  uploadGallery: {
    en: 'Upload Image from Gallery',
    hi: 'गैलरी से फोटो अपलोड करें',
  },
  scanVerifyNow: {
    en: 'Scan & Verify Package Now ➔',
    hi: 'पैकेट को अभी स्कैन और सत्यापित करें ➔',
  },
  orBenchmark: {
    en: 'Or Test with Pre-Loaded Benchmark Samples:',
    hi: 'या पहले से लोड किए गए नमूनों से जांचें:',
  },

  // Results Page
  verificationSlip: {
    en: 'Official Verification Slip',
    hi: 'आधिकारिक सत्यापन पर्ची',
  },
  mrpPrinted: {
    en: 'Maximum Retail Price (MRP)',
    hi: 'अधिकतम खुदरा मूल्य (MRP)',
  },
  expiryBestBefore: {
    en: 'Best Before / Expiry',
    hi: 'उपयोग की अंतिम तिथि / एक्सपायरी',
  },
  manufacturer: {
    en: 'Manufacturer & Packer',
    hi: 'निर्माता एवं पैकर विवरण',
  },
  reportViolation: {
    en: 'Report Violation to 1915',
    hi: '1915 पर शिकायत दर्ज करें',
  },
  downloadSlip: {
    en: 'Download Slip (PDF)',
    hi: 'निरीक्षण रिपोर्ट डाउनलोड करें (PDF)',
  },
  scanAnother: {
    en: 'Scan Another Product',
    hi: 'दूसरा उत्पाद स्कैन करें',
  },
  copyComplaint: {
    en: '📋 Copy Complaint Draft',
    hi: '📋 शिकायत प्रारूप कॉपी करें',
  },
  complaintCopied: {
    en: '✓ Complaint Draft Copied to Clipboard!',
    hi: '✓ शिकायत प्रारूप क्लिपबोर्ड पर कॉपी हो गया!',
  },

  // Officer Dashboard
  officerDashboard: {
    en: 'Officer Dashboard',
    hi: 'अधिकारी डैशबोर्ड',
  },
  totalInspections: {
    en: 'Total Inspections',
    hi: 'कुल निरीक्षण',
  },
  fullyCompliant: {
    en: 'Fully Compliant',
    hi: 'पूर्णतः नियम सम्मत',
  },
  violationsFlagged: {
    en: 'Violations Flagged',
    hi: 'उल्लंघन दर्ज',
  },
  pendingReviews: {
    en: 'Pending Reviews',
    hi: 'लंबित समीक्षाएं',
  },
  conductToday: {
    en: 'conducted today',
    hi: 'आज किए गए',
  },
  passRate: {
    en: 'Pass rate',
    hi: 'सफलता दर',
  },
  criticalNotices: {
    en: 'Critical notices',
    hi: 'गंभीर नोटिस',
  },
  awaitingOfficerDecision: {
    en: 'Awaiting officer decision',
    hi: 'अधिकारी निर्णय की प्रतीक्षा',
  },
  startNewInspection: {
    en: 'Conduct New Inspection',
    hi: 'नया निरीक्षण शुरू करें',
  },
  formPC1Reports: {
    en: 'Form PC-1 Reports',
    hi: 'फॉर्म PC-1 रिपोर्ट',
  },
  enforcementVelocity: {
    en: 'Enforcement Activity & Compliance Velocity',
    hi: 'प्रवर्तन गतिविधि एवं अनुपालन दर',
  },
  violationsBySector: {
    en: 'Violations by Sector',
    hi: 'क्षेत्रवार उल्लंघन',
  },
  recentDockets: {
    en: 'Recent Field Inspection Dockets',
    hi: 'हाल के निरीक्षण डॉकेट',
  },
  commonBreachClauses: {
    en: 'Common Breach Clauses',
    hi: 'मुख्य नियम उल्लंघन',
  },
  viewAll: {
    en: 'View All',
    hi: 'सभी देखें',
  },
  clickDocketInspect: {
    en: 'Click any docket to view full evidence & adjudication',
    hi: 'पूर्ण साक्ष्य एवं निर्णय देखने के लिए किसी भी डॉकेट पर क्लिक करें',
  },
  statutoryScore: {
    en: 'Statutory Score',
    hi: 'वैधानिक स्कोर',
  },
  statutoryFindings: {
    en: 'Statutory Findings & Regulatory Anomalies',
    hi: 'वैधानिक निष्कर्ष एवं नियम उल्लंघन',
  },
  adjudicateBreach: {
    en: 'Inspect and adjudicate each detected clause breach',
    hi: 'प्रत्येक नियम उल्लंघन की जांच एवं अंतिम निर्णय लें',
  },
  officerDecision: {
    en: 'Officer Decision',
    hi: 'अधिकारी निर्णय',
  },
  accept: {
    en: 'Accept',
    hi: 'स्वीकार करें',
  },
  reject: {
    en: 'Reject',
    hi: 'अस्वीकार करें',
  },
  manualReview: {
    en: 'Manual Review',
    hi: 'मैन्युअल समीक्षा',
  },
  note: {
    en: 'Note',
    hi: 'टिप्पणी',
  },
  saveNote: {
    en: 'Save Note',
    hi: 'टिप्पणी सहेजें',
  },
  cancel: {
    en: 'Cancel',
    hi: 'रद्द करें',
  },
  generatePdfReport: {
    en: 'Generate Official PDF Report',
    hi: 'आधिकारिक PDF रिपोर्ट बनाएं',
  },
  ratifyDocket: {
    en: 'Ratify & Finalize Docket',
    hi: 'डॉकेट की पुष्टि एवं अंतिम रूप दें',
  },
  backToHistory: {
    en: 'Back to Inspection History',
    hi: 'निरीक्षण इतिहास पर वापस जाएं',
  },

  // History Page
  searchPlaceholder: {
    en: 'Search by ID, Product, Retailer, Officer...',
    hi: 'आईडी, उत्पाद, विक्रेता, अधिकारी द्वारा खोजें...',
  },
  allCategories: {
    en: 'All Categories',
    hi: 'सभी श्रेणियां',
  },
  allStatuses: {
    en: 'All Statuses',
    hi: 'सभी स्थितियां',
  },
  foodFmcg: {
    en: 'Food & FMCG',
    hi: 'खाद्य व उपभोक्ता सामान',
  },
  electronics: {
    en: 'Electronics',
    hi: 'इलेक्ट्रॉनिक्स',
  },
  generalGoods: {
    en: 'General Goods',
    hi: 'सामान्य वस्तुएं',
  },
  pharma: {
    en: 'Pharmaceuticals',
    hi: 'दवा व स्वास्थ्य उत्पाद',
  },
  inspectionId: {
    en: 'Inspection ID',
    hi: 'निरीक्षण आईडी',
  },
  productAndCategory: {
    en: 'Product & Category',
    hi: 'उत्पाद एवं श्रेणी',
  },
  establishment: {
    en: 'Establishment',
    hi: 'प्रतिष्ठान / दुकान',
  },
  officer: {
    en: 'Officer',
    hi: 'अधिकारी',
  },
  score: {
    en: 'Score',
    hi: 'स्कोर',
  },
  status: {
    en: 'Status',
    hi: 'स्थिति',
  },
  actions: {
    en: 'Actions',
    hi: 'कार्रवाई',
  },
};

interface LanguageContextType {
  lang: Language;
  setLang: (l: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('metrologylens_lang');
    return (saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem('metrologylens_lang', newLang);
  };

  const t = (key: string): string => {
    if (dictionary[key]) {
      return dictionary[key][lang] || dictionary[key]['en'];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
