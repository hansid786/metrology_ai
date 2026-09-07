// ============================================================================
// HOMMIE DOMAIN DATA MODEL & SEED REPOSITORY
// Strictly labeled sample data for demonstration. Zero fake reviews or metrics.
// ============================================================================

export const HOMMIE_CITIES = [
  {
    id: 'blr',
    name: 'Bengaluru',
    state: 'Karnataka',
    active: true,
    localities: [
      { id: 'indiranagar', name: 'Indiranagar', pincode: '560038', active: true, supportedCategories: ['electrician', 'plumber', 'ac-service', 'appliance', 'carpenter', 'cleaning'], centerCoords: { lat: 12.9784, lng: 77.6408 } },
      { id: 'koramangala', name: 'Koramangala', pincode: '560095', active: true, supportedCategories: ['electrician', 'plumber', 'ac-service', 'appliance', 'carpenter', 'cleaning'], centerCoords: { lat: 12.9352, lng: 77.6245 } },
      { id: 'hsr-layout', name: 'HSR Layout', pincode: '560102', active: true, supportedCategories: ['electrician', 'plumber', 'ac-service', 'appliance', 'carpenter', 'cleaning'], centerCoords: { lat: 12.9121, lng: 77.6446 } },
      { id: 'whitefield', name: 'Whitefield', pincode: '560066', active: true, supportedCategories: ['electrician', 'plumber', 'ac-service', 'appliance', 'cleaning'], centerCoords: { lat: 12.9698, lng: 77.7500 } },
      { id: 'bellandur', name: 'Bellandur', pincode: '560103', active: false, supportedCategories: [], centerCoords: { lat: 12.9304, lng: 77.6784 } }
    ]
  },
  {
    id: 'lko',
    name: 'Lucknow',
    state: 'Uttar Pradesh',
    active: true,
    localities: [
      { id: 'gomti-nagar', name: 'Gomti Nagar', pincode: '226010', active: true, supportedCategories: ['electrician', 'plumber', 'ac-service', 'appliance', 'carpenter', 'cleaning'], centerCoords: { lat: 26.8500, lng: 80.9950 } },
      { id: 'hazratganj', name: 'Hazratganj', pincode: '226001', active: true, supportedCategories: ['electrician', 'plumber', 'ac-service', 'appliance', 'carpenter', 'cleaning'], centerCoords: { lat: 26.8467, lng: 80.9462 } },
      { id: 'aliganj', name: 'Aliganj', pincode: '226024', active: true, supportedCategories: ['electrician', 'plumber', 'ac-service', 'appliance'], centerCoords: { lat: 26.8850, lng: 80.9400 } },
      { id: 'indira-nagar-lko', name: 'Indira Nagar', pincode: '226016', active: true, supportedCategories: ['electrician', 'plumber', 'ac-service', 'appliance', 'cleaning'], centerCoords: { lat: 26.8780, lng: 80.9850 } }
    ]
  }
];

export const HOMMIE_CATEGORIES = [
  {
    id: 'ac-service',
    slug: 'ac-service',
    name: 'AC Service & Repair',
    shortName: 'AC Care',
    icon: 'Wind',
    color: 'sky',
    accentColor: '#0284c7',
    badge: 'Seasonal Essential',
    headline: 'Certified HVAC technicians for servicing, gas refill & repairs',
    inspectionFee: 249,
    startingPrice: 499,
    urgentAvailable: true,
    services: [
      { id: 'ac-deep-clean', name: 'Foam Jet Deep Cleaning (Split/Window)', timeEst: '45 mins', price: 499, pricingType: 'fixed' },
      { id: 'ac-gas-charge', name: 'Refrigerant Gas Top-up & Leak Fix', timeEst: '60 mins', price: 1850, pricingType: 'starting' },
      { id: 'ac-install', name: 'Split AC Installation with Bracket', timeEst: '90 mins', price: 1200, pricingType: 'fixed' },
      { id: 'ac-diagnostics', name: 'Cooling Breakdown Inspection', timeEst: '30 mins', price: 249, pricingType: 'inspection' }
    ]
  },
  {
    id: 'electrician',
    slug: 'electrician',
    name: 'Electrician',
    shortName: 'Electrical',
    icon: 'Zap',
    color: 'amber',
    accentColor: '#d97706',
    badge: '15-min Urgent Available',
    headline: 'Licensed wiremen for switchboards, MCBs, lighting & tripping',
    inspectionFee: 149,
    startingPrice: 199,
    urgentAvailable: true,
    services: [
      { id: 'elec-tripping', name: 'Short Circuit & MCB Tripping Diagnostic', timeEst: '30 mins', price: 249, pricingType: 'inspection' },
      { id: 'elec-fan-install', name: 'Ceiling Fan / Chandelier Installation', timeEst: '30 mins', price: 199, pricingType: 'fixed' },
      { id: 'elec-switch-replace', name: 'Switchboard Socket Replacement (Up to 3)', timeEst: '25 mins', price: 179, pricingType: 'fixed' },
      { id: 'elec-inverter', name: 'Inverter & Home Battery Wiring Setup', timeEst: '60 mins', price: 549, pricingType: 'starting' }
    ]
  },
  {
    id: 'plumber',
    slug: 'plumber',
    name: 'Plumber',
    shortName: 'Plumbing',
    icon: 'Droplets',
    color: 'blue',
    accentColor: '#2563eb',
    badge: 'Leak Emergency',
    headline: 'Experienced plumbers for leakages, taps, drains & motor pumps',
    inspectionFee: 149,
    startingPrice: 199,
    urgentAvailable: true,
    services: [
      { id: 'plumb-leak-fix', name: 'Concealed Pipe Leakage Detection & Repair', timeEst: '45 mins', price: 299, pricingType: 'starting' },
      { id: 'plumb-tap-replace', name: 'Tap / Shower Diverter Replacement', timeEst: '30 mins', price: 199, pricingType: 'fixed' },
      { id: 'plumb-drain-clear', name: 'Kitchen Sink / Basin Drain Clog Clearing', timeEst: '40 mins', price: 349, pricingType: 'fixed' },
      { id: 'plumb-motor-pump', name: 'Water Motor Pump Repair & Connection', timeEst: '60 mins', price: 499, pricingType: 'starting' }
    ]
  },
  {
    id: 'appliance',
    slug: 'appliance',
    name: 'Appliance Repair',
    shortName: 'Appliances',
    icon: 'Cpu',
    color: 'emerald',
    accentColor: '#059669',
    badge: 'Multi-Brand',
    headline: 'Specialists in Washing Machines, Refrigerators, RO Purifiers & Microwaves',
    inspectionFee: 199,
    startingPrice: 299,
    urgentAvailable: false,
    services: [
      { id: 'app-ro-service', name: 'RO Water Purifier Filter & Membrane Service', timeEst: '45 mins', price: 399, pricingType: 'fixed' },
      { id: 'app-wm-service', name: 'Washing Machine Drum & Motor Diagnostics', timeEst: '45 mins', price: 199, pricingType: 'inspection' },
      { id: 'app-fridge-service', name: 'Refrigerator Cooling & Compressor Check', timeEst: '40 mins', price: 249, pricingType: 'inspection' },
      { id: 'app-geyser-repair', name: 'Geyser Heating Element / Thermostat Repair', timeEst: '45 mins', price: 349, pricingType: 'starting' }
    ]
  },
  {
    id: 'carpenter',
    slug: 'carpenter',
    name: 'Carpenter',
    shortName: 'Carpentry',
    icon: 'Hammer',
    color: 'orange',
    accentColor: '#ea580c',
    badge: 'Furniture & Doors',
    headline: 'Master woodworkers for door locks, hinges, furniture assembly & fixes',
    inspectionFee: 149,
    startingPrice: 249,
    urgentAvailable: false,
    services: [
      { id: 'carp-lock-install', name: 'Main Door Lock & Handle Installation', timeEst: '45 mins', price: 349, pricingType: 'fixed' },
      { id: 'carp-furniture-assembly', name: 'Modular Bed / Wardrobe Assembly', timeEst: '90 mins', price: 699, pricingType: 'starting' },
      { id: 'carp-hinge-fix', name: 'Cabinet Channel / Drawer Hinge Repair', timeEst: '30 mins', price: 249, pricingType: 'fixed' }
    ]
  },
  {
    id: 'cleaning',
    slug: 'cleaning',
    name: 'Deep Cleaning',
    shortName: 'Cleaning',
    icon: 'Sparkles',
    color: 'purple',
    accentColor: '#9333ea',
    badge: 'Eco-Friendly Chemicals',
    headline: 'Intensive home, bathroom, kitchen & sofa sanitization specialists',
    inspectionFee: 0,
    startingPrice: 499,
    urgentAvailable: false,
    services: [
      { id: 'clean-bathroom', name: 'Intensive Bathroom Scale & Tile Descaling', timeEst: '60 mins', price: 499, pricingType: 'fixed' },
      { id: 'clean-kitchen', name: 'Kitchen Degreasing & Chimney Scrubbing', timeEst: '90 mins', price: 999, pricingType: 'fixed' },
      { id: 'clean-full-home', name: 'Full Home Deep Sanitization (2BHK)', timeEst: '240 mins', price: 2499, pricingType: 'fixed' },
      { id: 'clean-sofa-shampoo', name: '3-Seater Sofa Fabric Shampoo & Vacuum', timeEst: '60 mins', price: 599, pricingType: 'fixed' }
    ]
  }
];

export const HOMMIE_PROFESSIONALS = [
  {
    id: 'pro-arjun',
    userId: 'u-pro-1',
    name: 'Arjun Singh',
    trade: 'AC Service & Repair Specialist',
    categoryIds: ['ac-service', 'appliance'],
    avatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80',
    headline: '11+ Years Experience • HVAC Certified • Daikin & Voltas Master',
    about: 'I have been servicing residential air conditioners across Bengaluru and Lucknow for over a decade. I believe in transparent troubleshooting: I always show the client what part is faulty before quoting.',
    phone: '+91 98450 21984',
    email: 'arjun.hvac@hommie.pro',
    city: 'Bengaluru',
    primaryLocality: 'Indiranagar',
    serviceLocalities: ['Indiranagar', 'Koramangala', 'HSR Layout', 'Whitefield'],
    serviceRadiusKm: 12,
    languages: ['Hindi', 'Kannada', 'English'],
    experienceYears: 11,
    baseRate: 499,
    inspectionFee: 249,
    pricingModel: 'starting',
    isAvailable: true,
    availableNow: true,
    earliestArrivalMins: 20,
    ratingAvg: 4.9,
    ratingCount: 148,
    jobsCompleted: 312,
    responseRatePercent: 98,
    avgResponseMinutes: 4,
    repeatCustomerCount: 42,
    verifications: {
      phoneVerified: true,
      identityDocumentSubmitted: true,
      backgroundCheckCompleted: true,
      addressVerified: true,
      hommieVerified: true
    },
    kycStatus: 'verified',
    payoutBank: {
      accountHolder: 'Arjun Singh',
      accountMasked: '•••• •••• 8842',
      ifsc: 'HDFC0001245',
      upiId: 'arjun.singh@okhdfcbank'
    },
    portfolio: [
      { id: 'p1', title: 'Copper Pipe Gas Leakage Repair', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' },
      { id: 'p2', title: 'Dual Inverter Split AC Setup', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80' }
    ],
    reviews: [
      { id: 'r1', customerName: 'Siddharth M.', rating: 5, date: '3 days ago', comment: 'Arjun diagnosed our AC cooling issue in 15 mins. Super clean foam jet service and very polite.', service: 'AC Deep Clean' },
      { id: 'r2', customerName: 'Priya Narayanan', rating: 5, date: '2 weeks ago', comment: 'Always book Arjun for our annual home servicing. Extremely reliable and fair pricing.', service: 'Foam Jet Deep Cleaning' }
    ]
  },
  {
    id: 'pro-imran',
    userId: 'u-pro-2',
    name: 'Imran Khan',
    trade: 'Senior Master Plumber',
    categoryIds: ['plumber'],
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    headline: '8 Years Experience • Expert in Concealed Leakages & Pressure Pumps',
    about: 'Government ITI certified plumber with hands-on expertise in multi-story residential plumbing, pressure pumps, and bathroom fittings like Jaquar and Kohler.',
    phone: '+91 97412 88491',
    email: 'imran.plumbing@hommie.pro',
    city: 'Bengaluru',
    primaryLocality: 'Koramangala',
    serviceLocalities: ['Koramangala', 'HSR Layout', 'Indiranagar'],
    serviceRadiusKm: 8,
    languages: ['Hindi', 'Urdu', 'English', 'Kannada'],
    experienceYears: 8,
    baseRate: 299,
    inspectionFee: 149,
    pricingModel: 'starting',
    isAvailable: true,
    availableNow: true,
    earliestArrivalMins: 15,
    ratingAvg: 4.8,
    ratingCount: 94,
    jobsCompleted: 186,
    responseRatePercent: 96,
    avgResponseMinutes: 6,
    repeatCustomerCount: 28,
    verifications: {
      phoneVerified: true,
      identityDocumentSubmitted: true,
      backgroundCheckCompleted: true,
      addressVerified: true,
      hommieVerified: true
    },
    kycStatus: 'verified',
    payoutBank: {
      accountHolder: 'Imran Khan',
      accountMasked: '•••• •••• 3190',
      ifsc: 'SBIN0004210',
      upiId: 'imrankhan@icici'
    },
    portfolio: [
      { id: 'p3', title: 'Wall-Mount Diverter Restoration', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80' }
    ],
    reviews: [
      { id: 'r3', customerName: 'Vikram Seth', rating: 5, date: '1 week ago', comment: 'Fixed a persistent kitchen leak that two other plumbers failed to locate. Highly recommend Imran!', service: 'Concealed Pipe Leak' }
    ]
  },
  {
    id: 'pro-rohit',
    userId: 'u-pro-3',
    name: 'Rohit Verma',
    trade: 'Licensed Master Electrician',
    categoryIds: ['electrician'],
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    headline: '9 Years Experience • Grade-A Wireman License • Smart Home Wiring',
    about: 'I handle all high-voltage and low-voltage home electrical work. Specializing in distribution box overhauls, inverter installations, and safety earth-leakage inspections.',
    phone: '+91 94150 33812',
    email: 'rohit.electric@hommie.pro',
    city: 'Bengaluru',
    primaryLocality: 'HSR Layout',
    serviceLocalities: ['HSR Layout', 'Koramangala', 'Indiranagar', 'Whitefield'],
    serviceRadiusKm: 15,
    languages: ['Hindi', 'English'],
    experienceYears: 9,
    baseRate: 249,
    inspectionFee: 149,
    pricingModel: 'starting',
    isAvailable: true,
    availableNow: true,
    earliestArrivalMins: 25,
    ratingAvg: 4.9,
    ratingCount: 112,
    jobsCompleted: 240,
    responseRatePercent: 99,
    avgResponseMinutes: 3,
    repeatCustomerCount: 35,
    verifications: {
      phoneVerified: true,
      identityDocumentSubmitted: true,
      backgroundCheckCompleted: true,
      addressVerified: true,
      hommieVerified: true
    },
    kycStatus: 'verified',
    payoutBank: {
      accountHolder: 'Rohit Verma',
      accountMasked: '•••• •••• 9912',
      ifsc: 'PUNB0123400',
      upiId: 'rohit.wireman@axl'
    },
    portfolio: [
      { id: 'p4', title: 'Modular MCB Board Overhaul', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80' }
    ],
    reviews: [
      { id: 'r4', customerName: 'Ananya Rao', rating: 5, date: '5 days ago', comment: 'Rohit is our go-to electrician for the whole apartment complex. Safe, quick, and neat work.', service: 'MCB Tripping Fix' }
    ]
  },
  {
    id: 'pro-sunita',
    userId: 'u-pro-4',
    name: 'Sunita Devi',
    trade: 'Deep Sanitization & Housekeeping Lead',
    categoryIds: ['cleaning'],
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    headline: '7 Years Experience • Chemical-Safe Certified • 5-Star Cleanliness Rating',
    about: 'I lead an independent team of 3 trained women cleaners. We use certified non-toxic Taski detergents and industrial steam machines for thorough kitchen, bathroom, and sofa sanitization.',
    phone: '+91 96110 55210',
    email: 'sunita.cleaning@hommie.pro',
    city: 'Bengaluru',
    primaryLocality: 'Indiranagar',
    serviceLocalities: ['Indiranagar', 'Koramangala', 'HSR Layout'],
    serviceRadiusKm: 10,
    languages: ['Hindi', 'Kannada', 'Tamil'],
    experienceYears: 7,
    baseRate: 499,
    inspectionFee: 0,
    pricingModel: 'fixed',
    isAvailable: true,
    availableNow: false,
    earliestArrivalMins: 60,
    ratingAvg: 4.9,
    ratingCount: 76,
    jobsCompleted: 142,
    responseRatePercent: 95,
    avgResponseMinutes: 8,
    repeatCustomerCount: 22,
    verifications: {
      phoneVerified: true,
      identityDocumentSubmitted: true,
      backgroundCheckCompleted: true,
      addressVerified: true,
      hommieVerified: true
    },
    kycStatus: 'verified',
    payoutBank: {
      accountHolder: 'Sunita Devi',
      accountMasked: '•••• •••• 5541',
      ifsc: 'BARB0INDIRA',
      upiId: 'sunita.clean@ybl'
    },
    portfolio: [
      { id: 'p5', title: 'Tile & Grout Deep Steam Clean', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80' }
    ],
    reviews: [
      { id: 'r5', customerName: 'Manish Kaul', rating: 5, date: '2 weeks ago', comment: 'Bathrooms look brand new. Sunita and her team were punctual and extremely detailed.', service: 'Bathroom Deep Clean' }
    ]
  },
  {
    id: 'pro-dinesh',
    userId: 'u-pro-5',
    name: 'Dinesh Kumar',
    trade: 'Appliance Repair Technician',
    categoryIds: ['appliance'],
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    headline: '6 Years Experience • RO Water Purifiers & Washing Machine Specialist',
    about: 'Specialist in Kent, Aquaguard, Pureit RO water purifiers, and front/top load washing machines (LG, Samsung, IFB). Authentic spare parts only.',
    phone: '+91 98860 11982',
    email: 'dinesh.appliance@hommie.pro',
    city: 'Bengaluru',
    primaryLocality: 'Indiranagar',
    serviceLocalities: ['Indiranagar', 'Koramangala', 'Whitefield'],
    serviceRadiusKm: 10,
    languages: ['Hindi', 'English', 'Kannada'],
    experienceYears: 6,
    baseRate: 399,
    inspectionFee: 199,
    pricingModel: 'starting',
    isAvailable: true,
    availableNow: true,
    earliestArrivalMins: 30,
    ratingAvg: 4.7,
    ratingCount: 58,
    jobsCompleted: 110,
    responseRatePercent: 94,
    avgResponseMinutes: 10,
    repeatCustomerCount: 18,
    verifications: {
      phoneVerified: true,
      identityDocumentSubmitted: true,
      backgroundCheckCompleted: false,
      addressVerified: true,
      hommieVerified: false
    },
    kycStatus: 'pending',
    payoutBank: {
      accountHolder: 'Dinesh Kumar',
      accountMasked: '•••• •••• 7720',
      ifsc: 'CNRB0001092',
      upiId: 'dineshkumar@paytm'
    },
    portfolio: [
      { id: 'p6', title: 'RO Membrane & TDS Tuning', image: 'https://images.unsplash.com/photo-1584622781564-1d987f7333c1?w=600&auto=format&fit=crop&q=80' }
    ],
    reviews: [
      { id: 'r6', customerName: 'Deepak J.', rating: 5, date: '1 month ago', comment: 'Replaced our RO filters and fixed TDS level. Water tastes crystal clear now.', service: 'RO Purifier Service' }
    ]
  },
  {
    id: 'pro-rajesh',
    userId: 'u-pro-6',
    name: 'Rajesh Mistry',
    trade: 'Master Furniture & Woodwork Carpenter',
    categoryIds: ['carpenter'],
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    headline: '14 Years Experience • Architectural Woodwork & Door Specialist',
    about: 'Expert carpenter specializing in precision lock fitting, squeaky door realignment, modular furniture assembly, and kitchen cabinet hardware replacement.',
    phone: '+91 93420 77190',
    email: 'rajesh.mistry@hommie.pro',
    city: 'Bengaluru',
    primaryLocality: 'Koramangala',
    serviceLocalities: ['Koramangala', 'HSR Layout', 'Indiranagar'],
    serviceRadiusKm: 10,
    languages: ['Hindi', 'Kannada'],
    experienceYears: 14,
    baseRate: 349,
    inspectionFee: 149,
    pricingModel: 'starting',
    isAvailable: true,
    availableNow: true,
    earliestArrivalMins: 45,
    ratingAvg: 4.8,
    ratingCount: 82,
    jobsCompleted: 165,
    responseRatePercent: 97,
    avgResponseMinutes: 5,
    repeatCustomerCount: 26,
    verifications: {
      phoneVerified: true,
      identityDocumentSubmitted: true,
      backgroundCheckCompleted: true,
      addressVerified: true,
      hommieVerified: true
    },
    kycStatus: 'verified',
    payoutBank: {
      accountHolder: 'Rajesh Mistry',
      accountMasked: '•••• •••• 4410',
      ifsc: 'UTIB0000120',
      upiId: 'rajeshmistry@axisbank'
    },
    portfolio: [
      { id: 'p7', title: 'Hardwood Door Lock & Hydraulic Closer', image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80' }
    ],
    reviews: [
      { id: 'r7', customerName: 'Anita Menon', rating: 5, date: '3 weeks ago', comment: 'Rajesh fixed 3 wardrobe doors that were stuck. Very clean work and punctual.', service: 'Wardrobe Hinge Fix' }
    ]
  }
];

export const HOMMIE_SEED_CUSTOMER = {
  id: 'u-cust-1',
  name: 'Hanzala Siddiqui',
  phone: '+91 98450 77123',
  email: 'hanzala@example.com',
  role: 'customer',
  city: 'Bengaluru',
  activeLocality: 'Indiranagar',
  savedAddresses: [
    {
      id: 'addr-1',
      label: 'Home',
      tag: 'default',
      addressLine1: 'Flat 402, Royal Palms, 12th Main Road',
      locality: 'Indiranagar',
      city: 'Bengaluru',
      landmark: 'Near Indiranagar Metro Station',
      pincode: '560038',
      lat: 12.9784,
      lng: 77.6408,
      isDefault: true
    },
    {
      id: 'addr-2',
      label: 'Office / Studio',
      tag: 'work',
      addressLine1: 'Suite 3B, Innovation Hub, 80 Feet Road',
      locality: 'Koramangala',
      city: 'Bengaluru',
      landmark: 'Opposite Sony World Signal',
      pincode: '560095',
      lat: 12.9352,
      lng: 77.6245,
      isDefault: false
    }
  ]
};

export const HOMMIE_MY_HOME_ASSETS = [
  {
    id: 'asset-ac-living',
    name: 'Living Room Split AC',
    category: 'ac-service',
    brand: 'Daikin 1.5 Ton 5-Star Inverter',
    installedDate: 'March 2024',
    locationRoom: 'Living Room',
    warrantyStatus: 'Active (Compressor Warranty until 2029)',
    lastServiced: '15 March 2026',
    servicedByProId: 'pro-arjun',
    servicedByProName: 'Arjun Singh',
    serviceFrequencyMonths: 6,
    nextDueReminderDate: '15 September 2026',
    reminderNote: 'Post-monsoon filter deep cleaning & gas pressure check',
    status: 'due_soon',
    history: [
      { date: '15 March 2026', type: 'Foam Jet Deep Cleaning', cost: 499, pro: 'Arjun Singh', invoiceRef: 'INV-HOM-2601' },
      { date: '10 Oct 2025', type: 'Gas Top-up & Condenser Wash', cost: 1850, pro: 'Arjun Singh', invoiceRef: 'INV-HOM-2588' }
    ]
  },
  {
    id: 'asset-ro-kitchen',
    name: 'Kitchen RO Water Purifier',
    category: 'appliance',
    brand: 'Kent Grand Plus 9L',
    installedDate: 'January 2024',
    locationRoom: 'Kitchen Sink',
    warrantyStatus: 'Expired (Standard Care)',
    lastServiced: '10 December 2025',
    servicedByProId: 'pro-dinesh',
    servicedByProName: 'Dinesh Kumar',
    serviceFrequencyMonths: 6,
    nextDueReminderDate: '10 June 2026',
    reminderNote: 'Sediment & Carbon filter cartridge replacement',
    status: 'healthy',
    history: [
      { date: '10 Dec 2025', type: 'Sediment Filter & Membrane Tune', cost: 650, pro: 'Dinesh Kumar', invoiceRef: 'INV-HOM-2540' }
    ]
  },
  {
    id: 'asset-wm-balcony',
    name: 'Washing Machine',
    category: 'appliance',
    brand: 'LG 8kg AI Front Load Direct Drive',
    installedDate: 'August 2023',
    locationRoom: 'Utility Balcony',
    warrantyStatus: 'Active (Motor Warranty until 2033)',
    lastServiced: '20 January 2026',
    servicedByProId: 'pro-dinesh',
    servicedByProName: 'Dinesh Kumar',
    serviceFrequencyMonths: 12,
    nextDueReminderDate: '20 January 2027',
    reminderNote: 'Drum scaling descaling cycle & inlet valve inspection',
    status: 'healthy',
    history: [
      { date: '20 Jan 2026', type: 'Descaling & Drain Filter Flush', cost: 399, pro: 'Dinesh Kumar', invoiceRef: 'INV-HOM-2562' }
    ]
  },
  {
    id: 'asset-elec-mcb',
    name: 'Main Electrical Distribution Board',
    category: 'electrician',
    brand: 'Schneider Electric 8-Way DB & RCCB',
    installedDate: '2022',
    locationRoom: 'Foyer / Hallway',
    warrantyStatus: 'Lifetime Board',
    lastServiced: '02 Feb 2026',
    servicedByProId: 'pro-rohit',
    servicedByProName: 'Rohit Verma',
    serviceFrequencyMonths: 12,
    nextDueReminderDate: '02 Feb 2027',
    reminderNote: 'Earth-leakage breaker tripping test & phase load balance',
    status: 'healthy',
    history: [
      { date: '02 Feb 2026', type: 'RCCB Safety Trip Test & Phase Tuning', cost: 350, pro: 'Rohit Verma', invoiceRef: 'INV-HOM-2571' }
    ]
  }
];

export const HOMMIE_SEED_BOOKINGS = [
  {
    id: 'b-active-1',
    bookingRef: 'HOM-2026-9812',
    customerId: 'u-cust-1',
    customerName: 'Hanzala Siddiqui',
    customerPhone: '+91 98450 77123',
    workerId: 'pro-arjun',
    workerName: 'Arjun Singh',
    workerTrade: 'AC Service & Repair Specialist',
    workerPhone: '+91 98450 21984',
    workerAvatar: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80',
    categoryId: 'ac-service',
    serviceTitle: 'Foam Jet Deep Cleaning (Split AC)',
    servicePrice: 499,
    inspectionFee: 249,
    platformFee: 15,
    safetyFee: 15,
    finalAmount: 529,
    requestMode: 'instant',
    scheduledDate: 'Today',
    scheduledSlot: 'Arriving in ~18 mins (Instant Request)',
    addressText: 'Flat 402, Royal Palms, 12th Main Road, Indiranagar, Bengaluru - 560038',
    locality: 'Indiranagar',
    city: 'Bengaluru',
    problemDescription: 'AC indoor unit blowing low air and mild whistling sound.',
    status: 'en_route',
    paymentStatus: 'pending',
    paymentMode: 'Direct UPI / QR on Completion',
    createdAt: '15 mins ago',
    etaMinutes: 18,
    timeline: [
      { status: 'requested', timestamp: '15 mins ago', note: 'Customer requested instant matching in Indiranagar' },
      { status: 'accepted', timestamp: '12 mins ago', note: 'Arjun Singh accepted the job request' },
      { status: 'en_route', timestamp: '8 mins ago', note: 'Technician is en route with equipment' }
    ],
    chatMessages: [
      { id: 'm1', senderRole: 'pro', senderName: 'Arjun Singh', text: 'Namaste Hanzala ji, I am on 100 Feet Road now. Carrying foam jet pump. ETA 15 mins.', time: '8 mins ago' },
      { id: 'm2', senderRole: 'customer', senderName: 'Hanzala Siddiqui', text: 'Great! Please buzz flat 402 when you reach the gate.', time: '6 mins ago' }
    ]
  },
  {
    id: 'b-completed-2',
    bookingRef: 'HOM-2026-9740',
    customerId: 'u-cust-1',
    customerName: 'Hanzala Siddiqui',
    customerPhone: '+91 98450 77123',
    workerId: 'pro-imran',
    workerName: 'Imran Khan',
    workerTrade: 'Senior Master Plumber',
    workerPhone: '+91 97412 88491',
    workerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    categoryId: 'plumber',
    serviceTitle: 'Concealed Pipe Leakage Detection & Repair',
    servicePrice: 599,
    inspectionFee: 149,
    platformFee: 15,
    safetyFee: 15,
    finalAmount: 629,
    requestMode: 'scheduled',
    scheduledDate: '28 Aug 2026',
    scheduledSlot: '2:00 PM – 3:30 PM',
    addressText: 'Flat 402, Royal Palms, 12th Main Road, Indiranagar, Bengaluru - 560038',
    locality: 'Indiranagar',
    city: 'Bengaluru',
    problemDescription: 'Washbasin drain dripping under cabinet.',
    status: 'completed',
    paymentStatus: 'paid',
    paymentMode: 'UPI QR (PhonePe)',
    paymentId: 'pay_hom_9740_upi',
    createdAt: '28 Aug 2026',
    customerRating: 5,
    customerReview: 'Imran replaced the cracked seal washer in 20 mins. Zero mess left behind.',
    timeline: [
      { status: 'requested', timestamp: '28 Aug 10:00 AM', note: 'Booking requested' },
      { status: 'accepted', timestamp: '28 Aug 10:15 AM', note: 'Imran accepted' },
      { status: 'completed', timestamp: '28 Aug 03:15 PM', note: 'Service verified completed' },
      { status: 'paid', timestamp: '28 Aug 03:20 PM', note: 'Paid ₹629 via UPI' }
    ]
  }
];