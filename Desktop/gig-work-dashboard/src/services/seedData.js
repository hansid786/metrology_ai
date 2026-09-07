// Realistic Seed Dataset - Human Designed for Hyperlocal Services Marketplace

export const SEED_CATEGORIES = [
  { id: 'cat-ac', name: 'AC Repair', slug: 'ac-repair', icon: 'AirVent', commissionPct: 5 },
  { id: 'cat-plumb', name: 'Plumbing', slug: 'plumbing', icon: 'Droplets', commissionPct: 5 },
  { id: 'cat-elec', name: 'Electrical', slug: 'electrical', icon: 'Zap', commissionPct: 5 },
  { id: 'cat-carp', name: 'Carpentry', slug: 'carpentry', icon: 'Hammer', commissionPct: 5 },
  { id: 'cat-paint', name: 'Painting', slug: 'painting', icon: 'Paintbrush', commissionPct: 5 },
  { id: 'cat-app', name: 'Appliance Repair', slug: 'appliance-repair', icon: 'Wrench', commissionPct: 5 },
  { id: 'cat-wm', name: 'Washing Machine', slug: 'washing-machine', icon: 'RotateCw', commissionPct: 5 },
  { id: 'cat-fridge', name: 'Refrigerator', slug: 'refrigerator', icon: 'Refrigerator', commissionPct: 5 },
  { id: 'cat-tv', name: 'TV & Audio', slug: 'tv-audio', icon: 'Tv', commissionPct: 5 },
  { id: 'cat-mech', name: 'Vehicle Mechanic', slug: 'mechanic', icon: 'Car', commissionPct: 5 },
  { id: 'cat-clean', name: 'Deep Cleaning', slug: 'cleaning', icon: 'Sparkles', commissionPct: 5 },
  { id: 'cat-pest', name: 'Pest Control', slug: 'pest-control', icon: 'Bug', commissionPct: 5 },
  { id: 'cat-ro', name: 'RO & Water Purifier', slug: 'ro-water-purifier', icon: 'GlassWater', commissionPct: 5 },
  { id: 'cat-comp', name: 'Computer & Laptop', slug: 'computer-laptop', icon: 'Laptop', commissionPct: 5 },
  { id: 'cat-movers', name: 'Movers & Packers', slug: 'movers-packers', icon: 'Truck', commissionPct: 5 },
  { id: 'cat-beauty', name: 'Grooming & Salon', slug: 'grooming-salon', icon: 'Scissors', commissionPct: 5 }
];

export const SEED_SERVICES = [
  // AC
  { id: 'srv-ac-1', categoryId: 'cat-ac', name: 'Split AC Foam & Jet Service', slug: 'split-ac-jet', basePrice: 499, duration: '45 mins', desc: 'Indoor coil deep foam wash, outdoor condenser pressure wash & filter check.' },
  { id: 'srv-ac-2', categoryId: 'cat-ac', name: 'AC Gas Refill & Leak Detection', slug: 'ac-gas-refill', basePrice: 1399, duration: '60 mins', desc: 'Nitrogen pressure leak test, copper brazing and genuine refrigerant refill.' },
  { id: 'srv-ac-3', categoryId: 'cat-ac', name: 'AC Installation / Uninstallation', slug: 'ac-install', basePrice: 799, duration: '60 mins', desc: 'Precision wall bracket mounting, copper piping vacuuming and test run.' },
  
  // Plumbing
  { id: 'srv-pl-1', categoryId: 'cat-plumb', name: 'Tap & Mixer Valve Leak Repair', slug: 'tap-leak-repair', basePrice: 249, duration: '30 mins', desc: 'Spindle replacement, internal washer change, angle valve fix.' },
  { id: 'srv-pl-2', categoryId: 'cat-plumb', name: 'Drain & Pipe Blockage Clearing', slug: 'drain-clearing', basePrice: 349, duration: '45 mins', desc: 'Mechanical snake auger clearing for kitchen sinks and bathroom drains.' },
  { id: 'srv-pl-3', categoryId: 'cat-plumb', name: 'Geyser Inlet / Outlet Fitting', slug: 'geyser-fitting', basePrice: 399, duration: '45 mins', desc: 'Heavy brass connections, safety relief valve and power check.' },

  // Electrical
  { id: 'srv-el-1', categoryId: 'cat-elec', name: 'Ceiling Fan Repair / Hanging', slug: 'fan-repair', basePrice: 199, duration: '30 mins', desc: 'Capacitor replacement, regulator fix and noise reduction balancing.' },
  { id: 'srv-el-2', categoryId: 'cat-elec', name: 'MCB Fuse Tripping Diagnostic', slug: 'mcb-tripping-fix', basePrice: 249, duration: '45 mins', desc: 'Short circuit isolation, fuse box load balancing and wire replacement.' },
  { id: 'srv-el-3', categoryId: 'cat-elec', name: 'Inverter & Battery Setup', slug: 'inverter-setup', basePrice: 499, duration: '60 mins', desc: 'Complete backup power wiring, earth line check and terminal lubrication.' },

  // Carpentry
  { id: 'srv-cp-1', categoryId: 'cat-carp', name: 'Door Lock / Latch Replacement', slug: 'lock-replacement', basePrice: 299, duration: '30 mins', desc: 'Godrej / Yale cylinder installation and strike plate alignment.' },
  { id: 'srv-cp-2', categoryId: 'cat-carp', name: 'Hydraulic Hinge & Channel Fix', slug: 'hinge-fix', basePrice: 349, duration: '45 mins', desc: 'Wardrobe drawer alignment and kitchen cabinet hinge replacement.' },

  // Cleaning
  { id: 'srv-cl-1', categoryId: 'cat-clean', name: 'Bathroom Hard-Water Descaling', slug: 'bathroom-descaling', basePrice: 449, duration: '60 mins', desc: 'Deep tile hard-water stain removal, tap polishing and sanitization.' },
  { id: 'srv-cl-2', categoryId: 'cat-clean', name: 'Kitchen Chimney & Stove Degreasing', slug: 'kitchen-degreasing', basePrice: 749, duration: '90 mins', desc: 'Filter degreasing, baffle wash and heavy oil removal.' },

  // Water Purifier / RO
  { id: 'srv-ro-1', categoryId: 'cat-ro', name: 'RO Complete Filter Replacement & Service', slug: 'ro-service', basePrice: 499, duration: '45 mins', desc: 'Sediment, Carbon, Membrane replacement with TDS calibration.' },

  // Refrigerator & Washing Machine
  { id: 'srv-fr-1', categoryId: 'cat-fridge', name: 'Double Door Fridge Cooling Repair', slug: 'fridge-cooling-repair', basePrice: 399, duration: '45 mins', desc: 'Thermostat check, compressor relay replacement and defrost timer fix.' },
  { id: 'srv-wm-1', categoryId: 'cat-wm', name: 'Front/Top Load Washing Machine Drum Fix', slug: 'wm-drum-fix', basePrice: 449, duration: '60 mins', desc: 'Belt replacement, motor carbon brush check and spin cycle balance.' },

  // Pest Control
  { id: 'srv-pst-1', categoryId: 'cat-pest', name: 'Kitchen Cockroach Herbal Gel Treatment', slug: 'pest-cockroach', basePrice: 599, duration: '30 mins', desc: 'Odorless non-toxic bait gel application with 90-day warranty.' },

  // Vehicle Mechanic
  { id: 'srv-mc-1', categoryId: 'cat-mech', name: 'Doorstep Two-Wheeler General Service', slug: 'bike-service', basePrice: 399, duration: '60 mins', desc: 'Engine oil change, carburetor tuning, brake cleaning and spark plug check.' }
];

export const SEED_WORKERS = [
  {
    id: 'w-101',
    userId: 'u-w-101',
    name: 'Arjun Singh',
    phone: '+91 98450 21984',
    email: 'arjun.singh@example.com',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
    trade: 'AC Repair',
    specialty: 'Inverter AC Jet Servicing & Gas Diagnostics',
    experienceYears: 9,
    bio: 'Certified HVAC & refrigeration technician with 9+ years experience. Specializes in Daikin, Voltas, and LG inverter systems. Uses specialized high-pressure foam jackets to prevent indoor water spills.',
    baseRate: 349,
    rateUnit: 'onwards',
    isAvailableNow: true,
    serviceRadiusKm: 8,
    city: 'Lucknow',
    locality: 'Gomti Nagar',
    locationLat: 26.8500,
    locationLng: 80.9990,
    distanceKm: '1.4 km away',
    ratingAvg: 4.9,
    reviewsCount: 142,
    completedJobsCount: 184,
    responseRatePct: 98,
    verificationStatus: 'verified',
    tradeCertified: 'Govt ITI Refrigeration License #7741',
    languages: ['Hindi', 'English'],
    toolsOwned: ['Mastercool Manifold', 'High-Pressure Jet Pump', 'Digital Clamp Meter'],
    skills: ['Split AC Jet Cleaning', 'Gas Leak Detection', 'Copper Brazing', 'PCB Diagnostics'],
    weeklySchedule: [
      { day: 'Mon', hours: '9:00 AM – 8:00 PM', available: true },
      { day: 'Tue', hours: '9:00 AM – 8:00 PM', available: true },
      { day: 'Wed', hours: '9:00 AM – 8:00 PM', available: true },
      { day: 'Thu', hours: '9:00 AM – 8:00 PM', available: true },
      { day: 'Fri', hours: '9:00 AM – 8:00 PM', available: true },
      { day: 'Sat', hours: '9:00 AM – 8:00 PM', available: true },
      { day: 'Sun', hours: '10:00 AM – 4:00 PM', available: true }
    ],
    reviews: [
      { author: 'Vikram Mehrotra', date: 'Yesterday', rating: 5, comment: 'Arjun arrived on time with his own pressure pump and floor cover sheets. The AC is cooling like brand new. Very respectful and clean work.', service: 'Split AC Foam & Jet Service' },
      { author: 'Pooja Tandon', date: '4 days ago', rating: 5, comment: 'Fixed a persistent cooling gas leak that two previous technicians failed to diagnose. Highly recommended.', service: 'AC Gas Refill' }
    ],
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'w-102',
    userId: 'u-w-102',
    name: 'Imran Khan',
    phone: '+91 94440 98765',
    email: 'imran.khan@example.com',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
    trade: 'Plumbing',
    specialty: 'Concealed Pipe Leak Detection & Bathroom Fittings',
    experienceYears: 12,
    bio: 'Senior plumbing specialist with 12+ years experience handling residential apartments and independent villas. Uses acoustic leak detection equipment to avoid unnecessary wall breaking.',
    baseRate: 299,
    rateUnit: 'onwards',
    isAvailableNow: true,
    serviceRadiusKm: 10,
    city: 'Lucknow',
    locality: 'Hazratganj',
    locationLat: 26.8530,
    locationLng: 80.9460,
    distanceKm: '2.1 km away',
    ratingAvg: 4.8,
    reviewsCount: 128,
    completedJobsCount: 165,
    responseRatePct: 96,
    verificationStatus: 'verified',
    tradeCertified: 'National Skill Development Corp (NSDC) Level 4',
    languages: ['Hindi', 'Urdu', 'English'],
    toolsOwned: ['Rothenberger Snake Auger', 'Ultrasonic Leak Detector', 'Hydraulic Press Tool'],
    skills: ['Concealed Leak Fix', 'Geyser Installation', 'CPVC Piping', 'Drain Clearing'],
    weeklySchedule: [
      { day: 'Mon – Sat', hours: '8:30 AM – 7:30 PM', available: true },
      { day: 'Sun', hours: 'Emergency Calls Only', available: true }
    ],
    reviews: [
      { author: 'Dr. R. K. Srivastava', date: '3 days ago', rating: 5, comment: 'Imran fixed our bathroom ceiling seepage in less than 40 minutes without damaging any tiles.', service: 'Concealed Pipe Leak Detection' }
    ],
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'w-103',
    userId: 'u-w-103',
    name: 'Rohit Verma',
    phone: '+91 98112 44321',
    email: 'rohit.verma@example.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    trade: 'Electrical',
    specialty: 'Master Wireman & Inverter Diagnostics',
    experienceYears: 11,
    bio: 'Government licensed wireman with expertise in fault isolation, MCB distribution boards, inverter battery setups, and smart home switchboard wiring.',
    baseRate: 249,
    rateUnit: 'onwards',
    isAvailableNow: true,
    serviceRadiusKm: 12,
    city: 'Lucknow',
    locality: 'Aliganj',
    locationLat: 26.8870,
    locationLng: 80.9420,
    distanceKm: '2.8 km away',
    ratingAvg: 4.9,
    reviewsCount: 215,
    completedJobsCount: 290,
    responseRatePct: 99,
    verificationStatus: 'verified',
    tradeCertified: 'Govt ITI Wireman License #88219',
    languages: ['Hindi', 'English'],
    toolsOwned: ['Fluke Multimeter', 'Bosch Drill', 'Insulated Precision Kit'],
    skills: ['MCB Tripping Fix', 'Inverter Wiring', 'Earthing Test', 'Concealed Wiring'],
    weeklySchedule: [
      { day: 'Mon – Sun', hours: '8:00 AM – 9:00 PM', available: true }
    ],
    reviews: [
      { author: 'Amitesh Mishra', date: '5 days ago', rating: 5, comment: 'Rohit arrived in 20 minutes for an emergency MCB short circuit. Very polite and fair pricing.', service: 'MCB Fuse Tripping Diagnostic' }
    ],
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'w-104',
    userId: 'u-w-104',
    name: 'Sunita Devi',
    phone: '+91 97654 33210',
    email: 'sunita.devi@example.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    trade: 'Cleaning',
    specialty: 'Deep Kitchen Degreasing & Bathroom Descaling',
    experienceYears: 8,
    bio: 'Professional housekeeping lead trained in steam descaling and eco-friendly sanitization for kitchens and bathrooms.',
    baseRate: 449,
    rateUnit: 'onwards',
    isAvailableNow: false,
    serviceRadiusKm: 15,
    city: 'Lucknow',
    locality: 'Indira Nagar',
    locationLat: 26.8780,
    locationLng: 80.9920,
    distanceKm: '3.4 km away',
    ratingAvg: 4.9,
    reviewsCount: 180,
    completedJobsCount: 240,
    responseRatePct: 97,
    verificationStatus: 'verified',
    tradeCertified: 'Certified Professional Housekeeping',
    languages: ['Hindi'],
    toolsOwned: ['Karcher Steam Cleaner', 'Wet-Dry Industrial Vacuum'],
    skills: ['Kitchen Degreasing', 'Bathroom Descaling', 'Sofa Shampoo'],
    weeklySchedule: [
      { day: 'Mon – Sat', hours: '9:00 AM – 6:00 PM', available: true }
    ],
    reviews: [
      { author: 'Deepika Shukla', date: '1 week ago', rating: 5, comment: 'Sunita and her assistant did a spotless job on our kitchen chimney and bathroom tiles.', service: 'Bathroom Hard-Water Descaling' }
    ],
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'w-105',
    userId: 'u-w-105',
    name: 'Rajesh Patil',
    phone: '+91 98201 88472',
    email: 'rajesh.patil@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    trade: 'Carpentry',
    specialty: 'Door Locks, Modular Hinges & Wardrobe Channels',
    experienceYears: 14,
    bio: 'Craftsman specializing in Godrej lock replacements, hydraulic soft-close cabinet hinges and custom wood repairs.',
    baseRate: 299,
    rateUnit: 'onwards',
    isAvailableNow: true,
    serviceRadiusKm: 10,
    city: 'Lucknow',
    locality: 'Mahanagar',
    locationLat: 26.8720,
    locationLng: 80.9540,
    distanceKm: '1.9 km away',
    ratingAvg: 4.8,
    reviewsCount: 110,
    completedJobsCount: 155,
    responseRatePct: 95,
    verificationStatus: 'verified',
    tradeCertified: 'Master Craftsman Guild Cert #4412',
    languages: ['Hindi', 'English'],
    toolsOwned: ['DeWalt Circular Saw', 'Router Tool', 'Laser Level'],
    skills: ['Godrej Lock Fit', 'Hydraulic Channels', 'Wardrobe Sliders'],
    weeklySchedule: [
      { day: 'Mon – Sat', hours: '9:00 AM – 7:00 PM', available: true }
    ],
    reviews: [
      { author: 'Kunal Saxena', date: '6 days ago', rating: 5, comment: 'Replaced our main door lock in 25 minutes. Clean and professional.', service: 'Door Lock / Latch Replacement' }
    ],
    portfolioPhotos: [
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=400&auto=format&fit=crop&q=80'
    ]
  }
];

export const SEED_CUSTOMERS = [
  {
    id: 'cust-1',
    userId: 'u-cust-1',
    name: 'Hanzala',
    phone: '+91 98450 77123',
    email: 'hanzala@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'customer',
    city: 'Lucknow',
    locality: 'Gomti Nagar',
    savedAddresses: [
      { id: 'addr-1', label: 'Home', addressLine1: 'House 42, Sector B, Near City Park', locality: 'Gomti Nagar', city: 'Lucknow', postalCode: '226010', isDefault: true },
      { id: 'addr-2', label: 'Office', addressLine1: 'Tech Hub, 3rd Floor, Vibhuti Khand', locality: 'Gomti Nagar', city: 'Lucknow', postalCode: '226010', isDefault: false }
    ]
  }
];

export const SEED_ADMIN = {
  id: 'admin-1',
  userId: 'u-admin-1',
  name: 'Platform Operations Admin',
  email: 'admin@gigwork.coop',
  phone: '+91 99000 11223',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
};

export const SEED_BOOKINGS = [
  {
    id: 'bk-8921',
    bookingRef: 'ORD-8921',
    customerId: 'u-cust-1',
    customerName: 'Hanzala',
    customerPhone: '+91 98450 77123',
    workerId: 'w-101',
    workerName: 'Arjun Singh',
    workerPhone: '+91 98450 21984',
    workerTrade: 'AC Repair',
    serviceTitle: 'Split AC Foam & Jet Service',
    status: 'on_the_way',
    scheduledDate: 'Today',
    scheduledSlot: '2:00 PM – 3:30 PM',
    addressText: 'House 42, Sector B, Near City Park, Gomti Nagar, Lucknow',
    problemDescription: 'Indoor unit making rattling sound and low air throw. Needs deep jet clean.',
    estimatedAmount: 499,
    finalAmount: 499,
    platformFee: 10,
    welfareFee: 10,
    workerPayout: 479,
    paymentMode: 'Direct UPI upon Completion',
    paymentStatus: 'pending',
    createdAt: '35 mins ago',
    statusHistory: [
      { status: 'requested', note: 'Booking placed by customer', timestamp: '1:15 PM' },
      { status: 'accepted', note: 'Arjun accepted the request', timestamp: '1:20 PM' },
      { status: 'on_the_way', note: 'Arjun left workshop, arriving in 15 mins', timestamp: '1:45 PM' }
    ]
  }
];

export const SEED_MESSAGES = [
  {
    id: 'msg-1',
    bookingId: 'bk-8921',
    senderId: 'u-w-101',
    senderName: 'Arjun Singh',
    recipientId: 'u-cust-1',
    text: 'Namaste Hanzala ji! I have left the Gomti Nagar workshop with the pressure jet pump and will reach your house in about 12 minutes.',
    createdAt: '1:46 PM',
    isRead: true
  },
  {
    id: 'msg-2',
    bookingId: 'bk-8921',
    senderId: 'u-cust-1',
    senderName: 'Hanzala',
    recipientId: 'u-w-101',
    text: 'Sure Arjun ji, please come to Sector B, house 42 right next to City Park gate 2.',
    createdAt: '1:48 PM',
    isRead: true
  }
];

export const SEED_VERIFICATION_REQUESTS = [
  {
    id: 'kyc-101',
    workerId: 'w-101',
    workerName: 'Arjun Singh',
    trade: 'AC Repair',
    idType: 'Aadhaar Card',
    idDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=80',
    tradeCertUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=400&auto=format&fit=crop&q=80',
    submittedAt: 'Yesterday, 11:00 AM',
    status: 'verified',
    adminNotes: 'Aadhaar identity and ITI refrigeration trade license verified.'
  },
  {
    id: 'kyc-106',
    workerId: 'w-106',
    workerName: 'Vikas Yadav',
    trade: 'Mechanic',
    idType: 'Driving License',
    idDocUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
    selfieUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
    tradeCertUrl: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=400&auto=format&fit=crop&q=80',
    submittedAt: 'Today, 9:30 AM',
    status: 'pending',
    adminNotes: 'Awaiting operator review.'
  }
];

export const SEED_NOTIFICATIONS = [
  {
    id: 'notif-1',
    userId: 'u-cust-1',
    title: 'Technician on the Way',
    message: 'Arjun Singh has departed and is arriving in ~12 mins for your AC Service.',
    type: 'booking_status',
    entityId: 'bk-8921',
    createdAt: '10 mins ago',
    isRead: false
  }
];
