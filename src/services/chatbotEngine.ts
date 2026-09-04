import { Language } from '../context/LanguageContext';

export interface ChatResponse {
  text: string;
  suggestedFollowups?: string[];
}

interface IntentPattern {
  keywords: (string | RegExp)[];
  handler: (query: string, lang: Language, isHinglish: boolean) => ChatResponse;
}

const DEFAULT_FOLLOWUPS = [
  'How to file an overcharging complaint under Rule 6?',
  'What are the 8 mandatory declarations?',
  'What can you help me with?'
];

export function generateChatbotResponse(rawQuery: string, lang: Language): ChatResponse {
  const query = rawQuery.trim();
  const qLower = query.toLowerCase();

  // Detect Hinglish (Roman script Hindi)
  const isHinglish = /\b(kya|kaise|karo|batao|kuch|paise|jyada|zyada|chahiye|nahi|hota|hoga|hota|wala|wali|dukan|dukandar|shikayat|karna|h|hai|ho|raha|rahi|tha|thi|mere|tera|hum|apna|pani|khareeda|le|sakta|liya)\b/i.test(qLower);

  // 1. EXACT PRESET PROMPTS & CORE LEGAL CHECKLIST
  // Prompt 1: Unit Sale Price on Electronics
  if (/(electronic.*usp|usp.*electronic|unit\s*sale\s*price.*electronic|is\s*unit\s*sale\s*price\s*mandatory\s*on\s*electronic)/i.test(qLower)) {
    if (lang === 'hi' || isHinglish) {
      return {
        text: `⚖️ **इलेक्ट्रॉनिक्स पर USP छूट (Exemption):**\nविधिक मापविज्ञान (पैकेज्ड कमोडिटीज) नियम, 2011 के **नियम 6(1)(e)** के तहत, एकल इकाइयों (Piece/Unit/Number) में बेचे जाने वाले इलेक्ट्रॉनिक उपकरणों (जैसे पावर बैंक, मोबाइल, चार्जर) पर प्रति-ग्राम या प्रति-मिलीलीटर USP लिखना **अनिवार्य नहीं है (छूट प्राप्त है)**। इन पर केवल कुल MRP घोषित करना आवश्यक है।`,
        suggestedFollowups: [
          'What are the penalty rules under Section 36(1)?',
          'How to file an overcharging complaint under Rule 6?',
          'What is Principal Display Panel (PDP) rule?',
        ],
      };
    }
    return {
      text: `⚖️ **Legal Citation [Rule 6(1)(e) LM(PC) Rules, 2011]:**\nUnit Sale Price (₹/g or ₹/ml) is statutorily **EXEMPT** for electronic goods sold as discrete single units (piece/number). Only the Maximum Retail Price (MRP) per unit is legally mandatory.`,
      suggestedFollowups: [
        'What are the penalty rules under Section 36(1)?',
        'How to file an overcharging complaint under Rule 6?',
        'What is Principal Display Panel (PDP) rule?',
      ],
    };
  }

  // Prompt 2: How to file an overcharging complaint under Rule 6
  if (/(how to file.*overcharg|file.*complaint.*rule 6|overcharg.*complaint.*rule 6|shikayat.*kaise.*kare|complaint.*kaise)/i.test(qLower)) {
    if (lang === 'hi' || isHinglish) {
      return {
        text: `⚖️ **अधिक वसूली (Overcharging) की शिकायत प्रक्रिया:**\n1. **टोल-फ्री 1915** पर कॉल करें (सुबह 8 बजे से रात 8 बजे तक) या WhatsApp **8860001915** पर रसीद और MRP की फोटो भेजें।\n2. **National Consumer Helpline Portal** (consumerhelpline.gov.in) या NCH App पर ऑनलाइन शिकायत दर्ज करें।\n3. विधिक मापविज्ञान विभाग **धारा 36(1)** के तहत दुकानदार पर ₹25,000 तक का जुर्माना लगा सकता है।`,
        suggestedFollowups: [
          'What are the penalty rules under Section 36(1)?',
          'Can shops charge extra for cooling / fridge?',
          'What are the 8 mandatory declarations?',
        ],
      };
    }
    return {
      text: `⚖️ **Statutory Redressal [Rule 6 LM(PC) Rules & Section 36(1)]:**\n1. **Call 1915 (Toll-Free)** or WhatsApp packaging photo + retail bill to **8860001915**.\n2. Log a grievance on **consumerhelpline.gov.in** or the NCH Mobile App.\n3. The Legal Metrology Officer will initiate a Form PC-1 statutory inspection docket against the violator.`,
      suggestedFollowups: [
        'What are the penalty rules under Section 36(1)?',
        'Can shops charge extra for cooling / fridge?',
        'What are the 8 mandatory declarations?',
      ],
    };
  }

  // Prompt 3: Penalties under Section 36(1)
  if (/(penalty.*36\(1\)|section 36\(1\)|36\(1\).*penalty|penalt.*rules|fine.*kitna|saza.*kya)/i.test(qLower)) {
    if (lang === 'hi' || isHinglish) {
      return {
        text: `⚖️ **धारा 36(1) विधिक मापविज्ञान अधिनियम, 2009 के तहत दंड:**\n• **प्रथम अपराध (1st Offense):** ₹25,000 तक का नकद जुर्माना।\n• **द्वितीय अपराध (2nd Offense):** ₹50,000 तक का जुर्माना।\n• **बार-बार उल्लंघन (Subsequent Offenses):** ₹1,00,000 तक का जुर्माना या **1 वर्ष तक का कारावास** (जेल) या दोनों।`,
        suggestedFollowups: [
          'How to file an overcharging complaint under Rule 6?',
          'Is Unit Sale Price mandatory on electronic items?',
          'What are font size rules on packaging?',
        ],
      };
    }
    return {
      text: `⚖️ **Statutory Penalties [Section 36(1), Legal Metrology Act, 2009]:**\n• **1st Offense:** Fine up to ₹25,000 for manufacturing, packing or selling non-compliant goods.\n• **2nd Offense:** Fine up to ₹50,000.\n• **Subsequent Offenses:** Fine up to ₹1,00,000 or **imprisonment up to 1 year**, or both.`,
      suggestedFollowups: [
        'How to file an overcharging complaint under Rule 6?',
        'Is Unit Sale Price mandatory on electronic items?',
        'What are font size rules on packaging?',
      ],
    };
  }

  // 2. GREETINGS & INTRODUCTIONS
  if (/^(hi|hello|hey|namaste|namaskar|pranam|halo|hola|good\s*(morning|afternoon|evening)|kaise\s*ho|kya\s*haal|kese\s*ho|hlo)/i.test(qLower)) {
    if (lang === 'hi' || isHinglish) {
      return {
        text: `नमस्ते! 🙏 मैं **MetrologyLens Legal AI** हूँ — भारत सरकार के उपभोक्ता मामले विभाग की ओर से आपका आधिकारिक कानूनी सहायक।\n\nआप मुझसे MRP कानून, अधिक वसूली, एक्सपायरी, पैकेजिंग नियम (Rule 6, Rule 7, Rule 8), तराजू या 1915 हेल्पलाइन के बारे में कुछ भी पूछ सकते हैं।`,
        suggestedFollowups: [
          'Can shops charge extra for cold water / cooling?',
          'What are font size rules under Rule 7(3)?',
          'How to file an overcharging complaint under Rule 6?',
        ],
      };
    }
    return {
      text: `Hello! 👋 I am **MetrologyLens Legal AI**, your official assistant for Legal Metrology & Consumer Protection under the Department of Consumer Affairs, Govt. of India.\n\nAsk me anything about MRP compliance, packaging laws (Rules 6, 7 & 8), overcharging, or filing consumer grievances.`,
      suggestedFollowups: [
        'Can shops charge extra for cold water / cooling?',
        'What are font size rules under Rule 7(3)?',
        'How to file an overcharging complaint under Rule 6?',
      ],
    };
  }

  // 3. COOLING / REFRIGERATION / CHILLED CHARGES (Extra ₹5 on Cold Drinks / Milk / Water)
  if (/(cooling\s*charge|fridge\s*charge|chilled|thanda\s*karne|thandi\s*bottle|extra\s*5|5\s*rupaye\s*extra|extra\s*paisa|freezer)/i.test(qLower)) {
    if (lang === 'hi' || isHinglish) {
      return {
        text: `🧊 **'ठंडा करने का चार्ज' (Cooling Charge) पूरी तरह गैर-कानूनी है!**\nविधिक मापविज्ञान अधिनियम की **धारा 36(1)** के तहत MRP (अधिकतम खुदरा मूल्य) में सभी टैक्स और परिचालन लागत शामिल होते हैं। दुकानदार फ्रिज/कूलिंग के नाम पर ₹1 भी अतिरिक्त नहीं मांग सकता। ऐसा करने पर ₹25,000 तक का जुर्माना लगता है। तुरंत रसीद लेकर **1915** पर रिपोर्ट करें।`,
        suggestedFollowups: [
          'What are the penalty rules under Section 36(1)?',
          'How to file an overcharging complaint under Rule 6?',
        ],
      };
    }
    return {
      text: `🧊 **Cooling/Chilling Charges are Strictly ILLEGAL under Section 36(1)!**\nMRP is all-inclusive of taxes, storage, and cooling overheads. Charging even ₹1 extra for chilled water or beverages is an offence punishable with up to ₹25,000 fine. Demand a cash memo and report to NCH 1915.`,
      suggestedFollowups: [
        'What are the penalty rules under Section 36(1)?',
        'How to file an overcharging complaint under Rule 6?',
      ],
    };
  }

  // 4. FONT SIZE & READABILITY (Rule 7(3) & Rule 8 Table 1)
  if (/(font\s*size|readability|letter\s*height|chote\s*akshar|font\s*chota|rule\s*7\(3\)|rule\s*8|table\s*1|1mm|numeral\s*height)/i.test(qLower)) {
    if (lang === 'hi' || isHinglish) {
      return {
        text: `📏 **पैकेजिंग पर फॉन्ट आकार के कानूनी नियम (Rule 7(3) व Rule 8):**\n1. **सामान्य घोषणाएं:** फॉन्ट की ऊंचाई कम से कम **1.0 mm** (उभरे/ब्लोन अक्षरों पर **2.0 mm**) होनी चाहिए।\n2. **शुद्ध मात्रा (Net Qty Numerals - Rule 8 Table 1):**\n   • $\\le 200\\text{g/ml} \\to \\mathbf{2.0\\text{ mm}}$ न्यूनतम\n   • $200\\text{g} - 1\\text{kg/L} \\to \\mathbf{4.0\\text{ mm}}$ न्यूनतम\n   • $> 1\\text{kg/L} \\to \\mathbf{6.0\\text{ mm}}$ न्यूनतम`,
        suggestedFollowups: [
          'What is Principal Display Panel (PDP) rule?',
          'What are the 8 mandatory declarations?',
        ],
      };
    }
    return {
      text: `📏 **Statutory Font-Size Standards [Rule 7(3) & Rule 8 Table 1]:**\n1. **General Declarations:** Minimum height of **1.0 mm** (or **2.0 mm** if embossed/molded).\n2. **Net Quantity Numerals (Table 1):**\n   • $\\le 200\\text{g/ml} \\to \\mathbf{2.0\\text{ mm}}$\n   • $200\\text{g} - 1\\text{kg/L} \\to \\mathbf{4.0\\text{ mm}}$\n   • $> 1\\text{kg/L} \\to \\mathbf{6.0\\text{ mm}}$\nDeclarations smaller than these heights violate statutory readability.`,
      suggestedFollowups: [
        'What is Principal Display Panel (PDP) rule?',
        'What are the 8 mandatory declarations?',
      ],
    };
  }

  // 5. PRINCIPAL DISPLAY PANEL (PDP) (Rule 2(h) & Rule 7)
  if (/(pdp|principal\s*display|panel|placement|kaha\s*likha|front\s*face|seal\s*margin|exclusion\s*zone)/i.test(qLower)) {
    if (lang === 'hi' || isHinglish) {
      return {
        text: `📐 **प्रिंसिपल डिस्प्ले पैनल (PDP) नियम 2(h) व नियम 7:**\n• **आयताकार पैकेज (Rectangular):** पूरा सामने का भाग (100% Front Face = PDP)।\n• **बेलनाकार बोतल/पाइप (Cylindrical):** कुल सतह का **40% क्षेत्रफल**।\n• **सील मार्जिन छूट:** पैकेज के ऊपर/नीचे के 8% सीलिंग किनारों पर अनिवार्य विधिक घोषणाएं नहीं छापी जा सकतीं।`,
        suggestedFollowups: [
          'What are font size rules under Rule 7(3)?',
          'What are the 8 mandatory declarations?',
        ],
      };
    }
    return {
      text: `📐 **Principal Display Panel (PDP) Rules [Rule 2(h) & Rule 7]:**\n• **Rectangular:** 100% of front face area.\n• **Cylindrical/Bottles:** 40% of total surface area.\n• **Exclusion Zones:** Declarations placed on top/bottom seal crimps, bottle necks, or flanges are statutory placement violations.`,
      suggestedFollowups: [
        'What are font size rules under Rule 7(3)?',
        'What are the 8 mandatory declarations?',
      ],
    };
  }

  // 6. EXPIRED GOODS / BEST BEFORE DATE
  if (/(expir|best\s*before|kharab|date\s*nikal\s*gayi|purana\s*maal|mfg\s*date|batch\s*no)/i.test(qLower)) {
    if (lang === 'hi' || isHinglish) {
      return {
        text: `⏳ **एक्सपायरी डेट व बेस्ट बिफोर नियम (Rule 6(1)(c) व FSSAI):**\nएक्सपायर हो चुके सामान को बेचना उपभोक्ता संरक्षण अधिनियम 2019 एवं FSSAI नियमों के तहत गंभीर अपराध है। यदि आपको एक्सपायरी उत्पाद बेचा गया है, तो दुकानदार को पूरा रिफंड देना होगा और उस पर जुर्माना हो सकता है। रसीद के साथ **1915** पर रिपोर्ट करें।`,
        suggestedFollowups: [
          'How to file an overcharging complaint under Rule 6?',
          'What are the 8 mandatory declarations?',
        ],
      };
    }
    return {
      text: `⏳ **Expiry & Best Before Enforcement [Rule 6(1)(c) & FSSAI Act]:**\nSelling products beyond their expiry date is an unfair trade practice and food safety violation. Consumers are entitled to full refund/replacement plus compensation. Report with batch photo to NCH 1915.`,
      suggestedFollowups: [
        'How to file an overcharging complaint under Rule 6?',
        'What are the 8 mandatory declarations?',
      ],
    };
  }

  // 7. RESTAURANT SERVICE CHARGE
  if (/(service\s*charge|restaurant|hotel|khana\s*bill|dhabe|cafe)/i.test(qLower)) {
    if (lang === 'hi' || isHinglish) {
      return {
        text: `🍽️ **रेस्टोरेंट में सर्विस चार्ज पूरी तरह स्वैच्छिक (Optional) है:**\nCCPA दिशानिर्देश 2022 के अनुसार, कोई भी होटल या रेस्टोरेंट बिल में जबरन सर्विस चार्ज नहीं जोड़ सकता। आप इसे बिल से हटाने के लिए कह सकते हैं। मना करने पर **1915** पर तुरंत शिकायत करें।`,
        suggestedFollowups: [
          'How to file an overcharging complaint under Rule 6?',
          'What are the penalty rules under Section 36(1)?',
        ],
      };
    }
    return {
      text: `🍽️ **Service Charge is Strictly Voluntary [CCPA Guidelines 2022]:**\nHotels/restaurants cannot mandatorily add a service charge to food bills. Consumers can request its immediate removal. If refused, file a complaint on 1915 or the NCH App.`,
      suggestedFollowups: [
        'How to file an overcharging complaint under Rule 6?',
        'What are the penalty rules under Section 36(1)?',
      ],
    };
  }

  // 8. PETROL PUMP SHORT DISPENSING / WEIGHTS & SCALES
  if (/(petrol|diesel|fuel|pump|taraju|vajan|kam\s*tola|scale|weighing|stamping|seal)/i.test(qLower)) {
    if (lang === 'hi' || isHinglish) {
      return {
        text: `⛽ **पेट्रोल पंप एवं तराजू पर आपके अधिकार (धारा 24 व 30):**\n1. **पेट्रोल पंप:** आपको मौके पर सरकारी 5-लीटर प्रमाणित शंकु माप (5L Conical Measure) से जांच कराने का कानूनी अधिकार है।\n2. **दुकानों पर तराजू:** सभी इलेक्ट्रॉनिक कांटों पर विधिक मापविज्ञान विभाग की चालू वर्ष की सील व सत्यापन प्रमाणपत्र होना अनिवार्य है।`,
        suggestedFollowups: [
          'What are the penalty rules under Section 36(1)?',
          'How to file an overcharging complaint under Rule 6?',
        ],
      };
    }
    return {
      text: `⛽ **Weights & Measures Rights [Sections 24 & 30, LM Act]:**\n1. **Petrol Pumps:** Consumers have the statutory right to demand a 5-litre verified conical measure quantity test.\n2. **Commercial Scales:** All electronic weighing scales must bear an authentic verification stamp and hologram issued by the Legal Metrology Department.`,
      suggestedFollowups: [
        'What are the penalty rules under Section 36(1)?',
        'How to file an overcharging complaint under Rule 6?',
      ],
    };
  }

  // 9. 8 MANDATORY DECLARATIONS (Rule 6(1))
  if (/(8\s*declarations|mandatory\s*declarations|rule\s*6\(1\)|packet\s*par\s*kya|anivary\s*ghoshna|kya\s*kya\s*hona\s*chahiye)/i.test(qLower)) {
    if (lang === 'hi' || isHinglish) {
      return {
        text: `📋 **नियम 6(1) के तहत पैकेट पर 8 अनिवार्य घोषणाएं:**\n1. वस्तु का नाम (Generic Name)\n2. शुद्ध मात्रा (Net Quantity)\n3. अधिकतम खुदरा मूल्य (MRP ₹)\n4. प्रति इकाई विक्रय मूल्य (Unit Sale Price ₹/g या ₹/ml)\n5. निर्माण/पैकिंग की तिथि (Mfg/Pkg Date)\n6. मूल देश (Country of Origin)\n7. निर्माता/पैकर का पूरा नाम व पिनकोड\n8. उपभोक्ता सहायता हेल्पलाइन व ईमेल`,
        suggestedFollowups: [
          'Is Unit Sale Price mandatory on electronic items?',
          'What are font size rules under Rule 7(3)?',
        ],
      };
    }
    return {
      text: `📋 **8 Mandatory Declarations under Rule 6(1), PCR 2011:**\n1. Generic Commodity Name\n2. Net Quantity (Standard SI units)\n3. Maximum Retail Price (MRP inclusive of taxes)\n4. Unit Sale Price (USP in ₹/g or ₹/ml)\n5. Month & Year of Mfg/Packaging\n6. Country of Origin\n7. Complete Name & Address of Manufacturer/Packer with PIN\n8. Consumer Grievance Helpline & Email`,
      suggestedFollowups: [
        'Is Unit Sale Price mandatory on electronic items?',
        'What are font size rules under Rule 7(3)?',
      ],
    };
  }

  // 10. FSSAI & BIS / ISI LICENSES
  if (/(fssai|bis|isi|license|licence|fake\s*product|asli\s*nakli|fssai\s*number)/i.test(qLower)) {
    if (lang === 'hi' || isHinglish) {
      return {
        text: `🛡️ **FSSAI एवं BIS/ISI लाइसेंस सत्यापन:**\n• **खाद्य पदार्थ (Food):** 14 अंकों का FSSAI लाइसेंस नंबर और हरा/लाल शाकाहारी/मांसाहारी प्रतीक अनिवार्य है।\n• **इलेक्ट्रॉनिक्स व खिलौने:** BIS ISI मार्क और R-संख्या (जैसे R-84001928) अनिवार्य है। बिना ISI मार्क वाले इलेक्ट्रॉनिक्स बेचना अवैध है।`,
        suggestedFollowups: [
          'What are the 8 mandatory declarations?',
          'How to file an overcharging complaint under Rule 6?',
        ],
      };
    }
    return {
      text: `🛡️ **FSSAI & BIS/ISI Compliance:**\n• **Food Products:** 14-digit FSSAI registration number and Veg/Non-Veg logo are compulsory under FSSAI Regulations.\n• **Electronics & Appliances:** Must bear the mandatory BIS ISI safety mark with Registration number (e.g. R-84001928).`,
      suggestedFollowups: [
        'What are the 8 mandatory declarations?',
        'How to file an overcharging complaint under Rule 6?',
      ],
    };
  }

  // 11. HOW THIS METROLOGYLENS AI SCANNER WORKS
  if (/(scanner|how\s*to\s*use|kaise\s*use\s*kare|website\s*kya\s*hai|metrologylens|camera\s*scan)/i.test(qLower)) {
    if (lang === 'hi' || isHinglish) {
      return {
        text: `🔍 **MetrologyLens AI का उपयोग कैसे करें:**\n1. **उपभोक्ता पोर्टल (Consumer Desk):** श्रेणी चुनें ➔ लाइव कैमरा से फोटो खींचें या गैलरी से अपलोड करें ➔ AI 5 सेकंड में MRP, USP और एक्सपायरी की जांच करके परिणाम दिखाता है।\n2. **अधिकारी पोर्टल (Officer Portal):** अधिकारी फॉर्म PC-1 रिपोर्ट डाउनलोड कर सकते हैं और धारा 36(1) के तहत कानूनी नोटिस बना सकते हैं।`,
        suggestedFollowups: [
          'What are font size rules under Rule 7(3)?',
          'What is Principal Display Panel (PDP) rule?',
          'How to file an overcharging complaint under Rule 6?',
        ],
      };
    }
    return {
      text: `🔍 **How MetrologyLens AI Works:**\n1. **Citizen Portal:** Select category ➔ Capture package photo via camera/upload ➔ Neural OCR extracts all 8 mandatory declarations and calculates mathematical USP compliance in real-time.\n2. **Enforcement Officer Portal:** Officers review AI findings, measure millimeter font heights, verify PDP placement, and generate Form PC-1 statutory inspection reports.`,
      suggestedFollowups: [
        'What are font size rules under Rule 7(3)?',
        'What is Principal Display Panel (PDP) rule?',
        'How to file an overcharging complaint under Rule 6?',
      ],
    };
  }

  // 12. CONSUMER RIGHTS / JAGO GRAHAK JAGO / COURT / REFUND
  if (/(court|rights|adhikar|dhokha|refund|wapas|consumer\s*forum|e-daakhil|jago\s*grahak)/i.test(qLower)) {
    if (lang === 'hi' || isHinglish) {
      return {
        text: `⚖️ **उपभोक्ता अधिकार एवं ई-दाखिल (Consumer Protection Act 2019):**\nयदि विक्रेता या कंपनी आपकी बात नहीं सुनती है, तो आप **edaakhil.nic.in** पर बिना वकील के सीधे ऑनलाइन उपभोक्ता अदालत में केस दर्ज कर सकते हैं। आप हर्जाना और मानसिक क्षतिपूर्ति (Compensation) की मांग कर सकते हैं। हेल्पलाइन: **1915**.`,
        suggestedFollowups: [
          'How to file an overcharging complaint under Rule 6?',
          'What are the penalty rules under Section 36(1)?',
        ],
      };
    }
    return {
      text: `⚖️ **Consumer Protection Act, 2019 & e-Daakhil:**\nConsumers can file e-complaints directly in the Consumer Disputes Redressal Commission via **edaakhil.nic.in** without requiring a lawyer. You are entitled to replacement, refund, and damages compensation.`,
      suggestedFollowups: [
        'How to file an overcharging complaint under Rule 6?',
        'What are the penalty rules under Section 36(1)?',
      ],
    };
  }

  // 13. CHIPS / AIR IN CHIPS / SHORT WEIGHT (Net Quantity Violations)
  if (/(chips|hawa|air|weight\s*kam|vajan\s*kam|kam\s*nikla|gram\s*kam|quantity)/i.test(qLower)) {
    if (lang === 'hi' || isHinglish) {
      return {
        text: `⚖️ **वजन कम निकलने पर नियम (Rule 6(1)(b) व 5वीं अनुसूची):**\nपैकेट पर जितना वजन (Net Qty) लिखा है, सामग्री उतनी ही होनी चाहिए। अनुमेय त्रुटि (Permissible Error) से अधिक कम वजन होना **धारा 30** के तहत अपराध है। आप इसे 1915 पर दर्ज करा सकते हैं।`,
        suggestedFollowups: [
          'What are the penalty rules under Section 36(1)?',
          'What are font size rules under Rule 7(3)?',
        ],
      };
    }
    return {
      text: `⚖️ **Net Quantity & Weight Deficit [Rule 6(1)(b) & Fifth Schedule]:**\nPackages containing less net content than declared beyond the Maximum Permissible Error (MPE) violate Section 30 of the Legal Metrology Act, 2009. Report shortfall to NCH 1915.`,
      suggestedFollowups: [
        'What are the penalty rules under Section 36(1)?',
        'What are font size rules under Rule 7(3)?',
      ],
    };
  }

  if (/(thank|thanks|धन्यवाद|shukriya|bye|goodbye|see you)/i.test(qLower)) {
    return {
      text: lang === 'hi' || isHinglish
        ? 'आपका स्वागत है। किसी भी पैकेजिंग, MRP या उपभोक्ता शिकायत के लिए मैं यहां हूं।'
        : 'You are welcome. I can help with packaging, MRP, quantity, and consumer complaints anytime.',
      suggestedFollowups: DEFAULT_FOLLOWUPS,
    };
  }

  if (/(mrp|maximum retail|price|daam|rate|zyada charge|overcharg|bill|receipt|invoice)/i.test(qLower)) {
    return {
      text: lang === 'hi' || isHinglish
        ? 'MRP पैकेट पर छपी अधिकतम कीमत है और इसमें लागू टैक्स शामिल होते हैं। दुकानदार MRP से अधिक नहीं ले सकता। बिल/रसीद संभालकर रखें और अधिक वसूली होने पर 1915 या consumerhelpline.gov.in पर शिकायत करें।'
        : 'MRP is the maximum retail price printed on the package and includes applicable taxes. A retailer cannot charge more than MRP. Keep the bill and report overcharging to 1915 or consumerhelpline.gov.in.',
      suggestedFollowups: ['How to file an overcharging complaint under Rule 6?', 'Can shops charge extra for cooling / fridge?', 'What are the 8 mandatory declarations?'],
    };
  }

  if (/(return|refund|replacement|warranty|defect|damaged|खराब|वापस|रिफंड)/i.test(qLower)) {
    return {
      text: lang === 'hi' || isHinglish
        ? 'खराब या गलत उत्पाद के लिए पहले विक्रेता/प्लेटफॉर्म को बिल, फोटो और ऑर्डर विवरण के साथ लिखित शिकायत दें। समाधान न मिले तो National Consumer Helpline 1915 या consumerhelpline.gov.in पर शिकायत करें। वारंटी और रिफंड की शर्तें उत्पाद की नीति के अनुसार अलग हो सकती हैं।'
        : 'For a defective or incorrect product, first complain to the seller or platform in writing with the bill, photos, and order details. If unresolved, contact the National Consumer Helpline at 1915 or consumerhelpline.gov.in. Warranty and refund terms can vary by product policy.',
      suggestedFollowups: ['How to file an overcharging complaint under Rule 6?', 'What are my consumer rights?', 'Can I file a complaint online?'],
    };
  }

  if (/(online|amazon|flipkart|ecommerce|e-commerce|delivery|shopping)/i.test(qLower)) {
    return {
      text: lang === 'hi' || isHinglish
        ? 'ऑनलाइन खरीदारी में product page, seller name, invoice, delivery package और return policy के screenshots रखें। MRP से अधिक वसूली, गलत वस्तु या नकली उत्पाद की शिकायत पहले platform पर और फिर consumerhelpline.gov.in पर करें।'
        : 'For online purchases, save the product page, seller name, invoice, delivery-package photos, and return policy. Report overcharging, wrong goods, or suspected counterfeit products to the platform first and then consumerhelpline.gov.in if unresolved.',
      suggestedFollowups: ['How to file an overcharging complaint under Rule 6?', 'What are my consumer rights?', 'How do I report a fake product?'],
    };
  }

  if (/(what can you do|who are you|help|madad|helpful|capabilit)/i.test(qLower)) {
    return {
      text: lang === 'hi' || isHinglish
        ? 'मैं MRP, net quantity, USP, expiry, FSSAI/BIS, पैकेजिंग घोषणाएं, वजन की कमी, cooling charge, शिकायत प्रक्रिया और scanner इस्तेमाल करने में मदद कर सकता हूं। किसी घटना के लिए उत्पाद, कीमत, दुकान और तारीख बताएं।'
        : 'I can help with MRP, net quantity, USP, expiry, FSSAI/BIS, packaging declarations, short weight, cooling charges, complaint filing, and using the scanner. For an incident, share the product, price, seller, and date.',
      suggestedFollowups: DEFAULT_FOLLOWUPS,
    };
  }

  // 14. DYNAMIC INTELLIGENT FALLBACK (Handles ANY arbitrary user query naturally)
  const cleanQ = query.slice(0, 100);
  if (lang === 'hi' || isHinglish) {
    return {
      text: `📋 **मैं इस प्रश्न का निश्चित उत्तर नहीं दे पा रहा हूं:**\nआपने पूछा: *"${cleanQ}"*\n\nमैं Legal Metrology और consumer complaints पर मदद कर सकता हूं। कृपया उत्पाद, MRP, net quantity, दुकान, बिल, तारीख या समस्या का थोड़ा context दें। आप 1915 (टोल-फ्री) पर भी सहायता ले सकते हैं।`,
      suggestedFollowups: [
        'Is Unit Sale Price mandatory on electronic items?',
        'How to file an overcharging complaint under Rule 6?',
        'What are the penalty rules under Section 36(1)?',
      ],
    };
  } else {
    return {
      text: `📋 **I need a little more context to answer accurately:**\nYou asked: *"${cleanQ}"*\n\nI can help with Legal Metrology, packaging declarations, MRP, quantity, expiry, and consumer complaints. Share the product, seller, price, bill, date, or exact issue. For official help, call **1915 (Toll-Free)**.`,
      suggestedFollowups: [
        'Is Unit Sale Price mandatory on electronic items?',
        'How to file an overcharging complaint under Rule 6?',
        'What are the penalty rules under Section 36(1)?',
      ],
    };
  }
}
