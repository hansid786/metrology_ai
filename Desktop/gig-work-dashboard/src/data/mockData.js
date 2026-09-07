// Real-world Indian local services catalog and realistic mock dataset

export const TRADES_LIST = [
  'All Trades',
  'Electrician',
  'Plumber',
  'Home Cleaning',
  'Carpenter',
  'AC & Appliances',
  'Painting & Damp'
];

export const COOPERATIVE_CHAPTERS = [
  { id: 'all', name: 'All Local Guilds', city: 'National' },
  { id: 'blr-south', name: 'Bengaluru South Shramik Guild #174', city: 'Bengaluru' },
  { id: 'mum-west', name: 'Mumbai Dadar & Bandra Karigar Sahakari', city: 'Mumbai' },
  { id: 'del-south', name: 'Delhi South Karigar Union', city: 'New Delhi' }
];

export const SERVICE_CATEGORIES = [
  {
    id: 'electrical',
    name: 'Electrician',
    icon: 'Zap',
    badge: 'Popular',
    startingPrice: 199,
    description: 'Wiring, MCBs, fans, inverters & appliance installation',
    services: [
      { id: 'el-1', title: 'Fan Repair / Installation', price: 199, timeEst: '30 mins', desc: 'Ceiling fan hanging, regulator fix, capacitor change' },
      { id: 'el-2', title: 'Switch / Socket / MCB Tripping Fix', price: 249, timeEst: '45 mins', desc: 'Fuse fix, short circuit diagnostic, distribution board repair' },
      { id: 'el-3', title: 'Inverter & Battery Setup', price: 499, timeEst: '60 mins', desc: 'Complete backup power wiring with earthing test' },
      { id: 'el-4', title: 'Complete House Wiring Inspection', price: 399, timeEst: '60 mins', desc: 'Load balancing, fault detection & safety check' }
    ]
  },
  {
    id: 'plumbing',
    name: 'Plumber',
    icon: 'Droplets',
    badge: 'Emergency',
    startingPrice: 249,
    description: 'Pipe leaks, taps, geysers, flush tanks & blockages',
    services: [
      { id: 'pl-1', title: 'Tap & Mixer Valve Leak Repair', price: 249, timeEst: '30 mins', desc: 'Washer replacement, spindle fix, cartridge change' },
      { id: 'pl-2', title: 'Drain Blockage & Pipe Clearing', price: 349, timeEst: '45 mins', desc: 'Sink, bathroom drain or sewer line snake auger clearing' },
      { id: 'pl-3', title: 'Geyser / Water Heater Connection', price: 399, timeEst: '45 mins', desc: 'Inlet/outlet brass nipples, angle valves & safety check' },
      { id: 'pl-4', title: 'Flush Tank / Commode Repair', price: 299, timeEst: '40 mins', desc: 'Syphon replacement, inlet valve and leak fix' }
    ]
  },
  {
    id: 'cleaning',
    name: 'Home Cleaning',
    icon: 'Sparkles',
    badge: 'Top Rated',
    startingPrice: 499,
    description: 'Kitchen degreasing, bathroom descaling & sofa shampoo',
    services: [
      { id: 'cl-1', title: 'Intense Bathroom Descaling (1 Bath)', price: 499, timeEst: '60 mins', desc: 'Tile grime, hard-water stain removal & sanitization' },
      { id: 'cl-2', title: 'Kitchen Chimney & Counter Degreasing', price: 799, timeEst: '90 mins', desc: 'Heavy oil removal, filter wash & stove cleaning' },
      { id: 'cl-3', title: '3-Seater Sofa Foam Shampooing', price: 599, timeEst: '60 mins', desc: 'Deep extraction vacuuming & fabric stain removal' },
      { id: 'cl-4', title: 'Full 2BHK Deep Cleaning', price: 1899, timeEst: '3-4 hrs', desc: 'Floor scrub, windows, kitchen, 2 baths & balcony' }
    ]
  },
  {
    id: 'carpentry',
    name: 'Carpenter',
    icon: 'Hammer',
    badge: 'Reliable',
    startingPrice: 299,
    description: 'Door locks, modular hinges, wardrobe channels & repairs',
    services: [
      { id: 'cp-1', title: 'Door Lock / Latch Replacement', price: 299, timeEst: '30 mins', desc: 'Godrej/Yale cylinder installation & strike plate fix' },
      { id: 'cp-2', title: 'Hydraulic Hinge & Drawer Channel Fix', price: 349, timeEst: '45 mins', desc: 'Kitchen/Wardrobe soft-close channel replacement' },
      { id: 'cp-3', title: 'Curtain Rod / TV Wall Mount Setup', price: 299, timeEst: '40 mins', desc: 'Heavy anchor drilling & precision laser levelling' },
      { id: 'cp-4', title: 'Custom Wooden Furniture Repair', price: 499, timeEst: '60 mins', desc: 'Chair wobbles, table refinishing & joint strengthening' }
    ]
  },
  {
    id: 'ac-repair',
    name: 'AC & Appliances',
    icon: 'AirVent',
    badge: 'Seasonal',
    startingPrice: 599,
    description: 'Split AC jet servicing, gas filling & PCB diagnostics',
    services: [
      { id: 'ac-1', title: 'Split AC High-Pressure Jet Service', price: 599, timeEst: '45 mins', desc: 'Indoor foam wash, outdoor condenser jet wash & filter clean' },
      { id: 'ac-2', title: 'AC Gas Top-Up & Leak Fix (R32/R410)', price: 1499, timeEst: '60 mins', desc: 'Nitrogen pressure test, copper braze & genuine gas refill' },
      { id: 'ac-3', title: 'Washing Machine Drum & Motor Repair', price: 449, timeEst: '45 mins', desc: 'Drain pump fix, spin error check & belt replacement' },
      { id: 'ac-4', title: 'Microwave / Refrigerator Repair', price: 399, timeEst: '40 mins', desc: 'Thermostat, magnetron & cooling coil troubleshooting' }
    ]
  },
  {
    id: 'painting',
    name: 'Painting & Damp',
    icon: 'Paintbrush',
    badge: 'Long Life',
    startingPrice: 899,
    description: 'Damp proofing, texture walls, touch-ups & waterproofing',
    services: [
      { id: 'pn-1', title: 'Single Room Wall Touch-up & Repaint', price: 899, timeEst: '2-3 hrs', desc: 'Putty patch, primer coat & 2 coats Asian Paints Royale' },
      { id: 'pn-2', title: 'Ceiling Water Seepage / Damp Proofing', price: 1199, timeEst: '2 hrs', desc: 'Dr. Fixit crack fill, moisture barrier & acrylic sealant' },
      { id: 'pn-3', title: 'Balcony / Exterior Waterproofing', price: 1499, timeEst: '3 hrs', desc: 'Anti-fungal UV protective weather-proof coating' }
    ]
  }
];

export const REAL_WORKERS = [
  {
    id: 'w-101',
    name: 'Ramesh Sharma',
    trade: 'Electrician',
    specialty: 'Master Wireman & Inverter Diagnostics',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
    experienceYears: 11,
    locality: 'Koramangala, Bengaluru',
    distanceKm: '1.2 km away',
    responseMins: '20-30 mins',
    coopUnit: 'Bengaluru South Shramik Guild #174',
    unionRegNo: 'KA-BSSG-2022-841',
    aadhaarVerified: true,
    policeCleared: true,
    tradeCertified: 'Govt ITI Wireman License #88219',
    rating: 4.94,
    reviewsCount: 312,
    baseRate: 249,
    rateType: 'Base visit + fixed labor rate card',
    phone: '+91 98450 21984',
    status: 'online',
    completedJobs: 418,
    totalLifetimeEarnings: 142800,
    walletBalance: 4280,
    recentReviews: [
      { author: 'Pooja Iyer', date: 'Yesterday', rating: 5, comment: 'Ramesh arrived within 25 mins. Identified the short circuit in the kitchen line quickly and replaced the MCB. Charged honest rate!' },
      { author: 'Vikram N.', date: '3 days ago', rating: 5, comment: 'Very professional, brought his own Fluke meter and Bosch drill. Clean work.' }
    ],
    skills: ['MCB Tripping', 'Inverter Battery', 'Smart Switches', 'Earthing Test', 'Concealed Wiring'],
    toolsOwned: ['Fluke Multimeter', 'Bosch Hammer Drill', 'Insulated Tool Kit']
  },
  {
    id: 'w-102',
    name: 'Sunita Devi',
    trade: 'Home Cleaning',
    specialty: 'Post-Renovation & Eco Kitchen Sanitization',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    experienceYears: 8,
    locality: 'HSR Layout Sector 4, Bengaluru',
    distanceKm: '2.4 km away',
    responseMins: '40 mins',
    coopUnit: 'Bengaluru South Shramik Guild #174',
    unionRegNo: 'KA-BSSG-2022-118',
    aadhaarVerified: true,
    policeCleared: true,
    tradeCertified: 'Certified Professional Housekeeping Union',
    rating: 4.98,
    reviewsCount: 428,
    baseRate: 499,
    rateType: 'Deep cleaning rate card',
    phone: '+91 98112 44321',
    status: 'online',
    completedJobs: 512,
    totalLifetimeEarnings: 184500,
    walletBalance: 6150,
    recentReviews: [
      { author: 'Ananya Deshmukh', date: '2 days ago', rating: 5, comment: 'Sunita and her teammate did an outstanding job on our kitchen chimney and tiles. Zero smell, spotless!' }
    ],
    skills: ['Kitchen Degreasing', 'Bathroom Descaling', 'Sofa Shampoo', 'Tile Polishing'],
    toolsOwned: ['Karcher Steam Cleaner', 'Wet-Dry Industrial Vacuum']
  },
  {
    id: 'w-103',
    name: 'Anand Murthy',
    trade: 'Plumber',
    specialty: 'Concealed Pipe Leak Detection & Geyser Line Setup',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    experienceYears: 14,
    locality: 'BTM 2nd Stage, Bengaluru',
    distanceKm: '1.8 km away',
    responseMins: '30 mins',
    coopUnit: 'Bengaluru South Shramik Guild #174',
    unionRegNo: 'KA-BSSG-2021-033',
    aadhaarVerified: true,
    policeCleared: true,
    tradeCertified: 'National Skill Development Corp (NSDC) Plumber Level 4',
    rating: 4.89,
    reviewsCount: 230,
    baseRate: 249,
    rateType: 'Standard fixture & piping rate card',
    phone: '+91 94440 98765',
    status: 'online',
    completedJobs: 345,
    totalLifetimeEarnings: 98200,
    walletBalance: 3100,
    recentReviews: [
      { author: 'Dr. Subramanian', date: '4 days ago', rating: 5, comment: 'Fixed a hidden pipe leak without breaking the main wall. Very knowledgeable.' }
    ],
    skills: ['CPVC / GI Piping', 'Pressure Pump Fix', 'Geyser Installation', 'Drain Snake Clearing'],
    toolsOwned: ['Pipe Threader', 'Ultrasonic Leak Detector', 'Rothenberger Snake']
  },
  {
    id: 'w-104',
    name: 'Rajesh Patil',
    trade: 'Carpenter',
    specialty: 'Modular Kitchen Hinges, Lock Repair & Custom Shelves',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    experienceYears: 12,
    locality: 'Indiranagar 100ft Road, Bengaluru',
    distanceKm: '3.1 km away',
    responseMins: '45 mins',
    coopUnit: 'Bengaluru Central Karigar Union',
    unionRegNo: 'KA-BCKU-2023-089',
    aadhaarVerified: true,
    policeCleared: true,
    tradeCertified: 'Master Craftsman Guild Cert #4412',
    rating: 4.88,
    reviewsCount: 195,
    baseRate: 299,
    rateType: 'Base repair + hardware installation',
    phone: '+91 98201 88472',
    status: 'online',
    completedJobs: 280,
    totalLifetimeEarnings: 112000,
    walletBalance: 4800,
    recentReviews: [
      { author: 'Amitava Sen', date: '5 days ago', rating: 5, comment: 'Replaced faulty wardrobe sliders in 30 mins. Highly recommended.' }
    ],
    skills: ['Godrej Lock Fit', 'Hydraulic Channels', 'Modular Cabinet Adjust', 'Curtain Rods'],
    toolsOwned: ['DeWalt Circular Saw', 'Router Tool', 'Laser Level Kit']
  },
  {
    id: 'w-105',
    name: 'Arshad Khan',
    trade: 'AC & Appliances',
    specialty: 'Inverter AC Jet Foam Servicing & Copper Brazing',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    experienceYears: 9,
    locality: 'Koramangala 1st Block, Bengaluru',
    distanceKm: '0.9 km away',
    responseMins: '25 mins',
    coopUnit: 'Bengaluru South Shramik Guild #174',
    unionRegNo: 'KA-BSSG-2023-055',
    aadhaarVerified: true,
    policeCleared: true,
    tradeCertified: 'Govt HVAC Refrigeration Cert #5512',
    rating: 4.92,
    reviewsCount: 276,
    baseRate: 599,
    rateType: 'High-pressure Jet Foam Service',
    phone: '+91 97654 33210',
    status: 'online',
    completedJobs: 380,
    totalLifetimeEarnings: 154000,
    walletBalance: 5900,
    recentReviews: [
      { author: 'Neha Kapoor', date: 'Last week', rating: 5, comment: 'AC is cooling like brand new. Completely clean service with cover sheet so no water spilled on floor.' }
    ],
    skills: ['Split AC Jet Wash', 'Gas Recharge (R32/R410)', 'PCB Circuit Repair', 'Washing Machine'],
    toolsOwned: ['Mastercool Manifold', 'Vacuum Pump', 'High-Pressure Foam Jet']
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-8921',
    customerName: 'Rahul Verma',
    customerPhone: '+91 98450 77123',
    serviceCategory: 'Electrical',
    serviceTitle: 'Main MCB Tripping & Kitchen Socket Line Repair',
    workerId: 'w-101',
    workerName: 'Ramesh Sharma',
    workerTrade: 'Electrician',
    workerPhone: '+91 98450 21984',
    address: 'Flat 304, Green Heights, 5th Cross, Koramangala 4th Block, Bengaluru',
    scheduledSlot: 'Today, 2:00 PM – 3:30 PM',
    distanceKm: '1.2 km away',
    status: 'In Progress',
    totalAmount: 349,
    workerPayout: 329,
    platformFee: 10,
    welfareFundFee: 10,
    paymentMode: 'Direct UPI upon Completion',
    createdAt: '45 mins ago',
    steps: [
      { title: 'Request Confirmed', time: '1:15 PM', done: true },
      { title: 'Worker Assigned (Ramesh Sharma)', time: '1:20 PM', done: true },
      { title: 'Worker Reached Location', time: '1:45 PM', done: true },
      { title: 'Service in Progress', time: '2:00 PM', done: true },
      { title: 'Completion & Direct Settlement', time: 'Pending', done: false }
    ]
  },
  {
    id: 'ORD-8919',
    customerName: 'Rahul Verma',
    customerPhone: '+91 98450 77123',
    serviceCategory: 'Home Cleaning',
    serviceTitle: 'Bathroom Hard-Water Descaling & Tile Scrub',
    workerId: 'w-102',
    workerName: 'Sunita Devi',
    workerTrade: 'Home Cleaning',
    workerPhone: '+91 98112 44321',
    address: 'Flat 304, Green Heights, 5th Cross, Koramangala 4th Block, Bengaluru',
    scheduledSlot: '24 Aug, 10:00 AM',
    distanceKm: '2.4 km away',
    status: 'Completed',
    totalAmount: 499,
    workerPayout: 474,
    platformFee: 15,
    welfareFundFee: 10,
    paymentMode: 'Direct Google Pay to Worker (UTR #3288192)',
    createdAt: '2 days ago',
    ratingGiven: 5.0,
    reviewGiven: 'Sunita did a fantastic job with bathroom descaling. Clean and on time.'
  }
];

export const WORKER_JOB_REQUESTS = [
  {
    id: 'REQ-1044',
    customerName: 'Kavita Menon',
    locality: 'Koramangala 6th Block (1.1 km away)',
    serviceTitle: 'Ceiling Fan Regulator & Inverter Switchboard Check',
    slot: 'Today, 4:30 PM - 5:30 PM',
    customerOffer: 349,
    workerNetPayout: 329,
    distance: '1.1 km',
    urgency: 'Immediate (Within 1 hr)'
  },
  {
    id: 'REQ-1045',
    customerName: 'Sanjay Deshmukh',
    locality: 'HSR Sector 2 (2.6 km away)',
    serviceTitle: 'Power Socket Installation for Microwave Oven',
    slot: 'Tomorrow, 10:00 AM - 11:30 AM',
    customerOffer: 299,
    workerNetPayout: 284,
    distance: '2.6 km',
    urgency: 'Scheduled'
  }
];
