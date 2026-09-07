// ============================================================================
// HOMMIE CENTRAL REACTIVE STATE ENGINE & PERSISTENCE LAYER
// Real marketplace lifecycle state machine, validation, and audit tracking
// ============================================================================

import {
  HOMMIE_CITIES,
  HOMMIE_CATEGORIES,
  HOMMIE_PROFESSIONALS,
  HOMMIE_SEED_CUSTOMER,
  HOMMIE_MY_HOME_ASSETS,
  HOMMIE_SEED_BOOKINGS
} from '../data/hommieData';

const STORAGE_KEYS = {
  CITIES: 'hommie_cities_v1',
  CATEGORIES: 'hommie_categories_v1',
  PROFESSIONALS: 'hommie_pros_v1',
  CUSTOMER: 'hommie_customer_v1',
  HOME_ASSETS: 'hommie_assets_v1',
  BOOKINGS: 'hommie_bookings_v1',
  AUDIT_LOGS: 'hommie_audit_logs_v1',
  DISPUTES: 'hommie_disputes_v1',
  SAFETY_REPORTS: 'hommie_safety_reports_v1'
};

// Safe localStorage loader with seed fallback
function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('[HOMMIE Storage Load Error]:', e);
  }
  return fallback;
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('[HOMMIE Storage Save Error]:', e);
  }
}

// In-Memory Global State Singletons
let _cities = loadFromStorage(STORAGE_KEYS.CITIES, HOMMIE_CITIES);
let _categories = loadFromStorage(STORAGE_KEYS.CATEGORIES, HOMMIE_CATEGORIES);
let _pros = loadFromStorage(STORAGE_KEYS.PROFESSIONALS, HOMMIE_PROFESSIONALS);
let _customer = loadFromStorage(STORAGE_KEYS.CUSTOMER, HOMMIE_SEED_CUSTOMER);
let _homeAssets = loadFromStorage(STORAGE_KEYS.HOME_ASSETS, HOMMIE_MY_HOME_ASSETS);
let _bookings = loadFromStorage(STORAGE_KEYS.BOOKINGS, HOMMIE_SEED_BOOKINGS);
let _auditLogs = loadFromStorage(STORAGE_KEYS.AUDIT_LOGS, [
  { id: 'log-1', timestamp: '2026-08-28 10:15 AM', actor: 'System', action: 'BOOKING_CREATED', details: 'Seed booking HOM-2026-9740 initiated in Indiranagar' },
  { id: 'log-2', timestamp: '2026-08-28 03:20 PM', actor: 'Customer (Hanzala)', action: 'PAYMENT_CAPTURED', details: 'Paid ₹629 via PhonePe UPI (Ref: pay_hom_9740_upi)' }
]);
let _disputes = loadFromStorage(STORAGE_KEYS.DISPUTES, []);
let _safetyReports = loadFromStorage(STORAGE_KEYS.SAFETY_REPORTS, []);

// Listeners for reactivity
const listeners = new Set();
function notifyStateChanged() {
  listeners.forEach((fn) => {
    try { fn(); } catch (e) {}
  });
}

export function subscribeHommieState(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// --- 1. LOCALITY & SERVICEABILITY ---

export function getCities() {
  return _cities;
}

export function getActiveCity() {
  return _cities.find((c) => c.name === (_customer?.city || 'Bengaluru')) || _cities[0];
}

export function getActiveLocality() {
  const city = getActiveCity();
  const targetName = _customer?.activeLocality || 'Indiranagar';
  return city.localities.find((l) => l.name.toLowerCase() === targetName.toLowerCase()) || city.localities[0];
}

export function setCustomerLocality(cityName, localityName) {
  if (_customer) {
    _customer.city = cityName;
    _customer.activeLocality = localityName;
    saveToStorage(STORAGE_KEYS.CUSTOMER, _customer);
    recordAuditLog('Customer location updated to ' + localityName + ', ' + cityName, 'Customer');
    notifyStateChanged();
  }
}

export function checkCategoryServiceability(categorySlug, localityName) {
  const city = getActiveCity();
  const loc = city.localities.find((l) => l.name.toLowerCase() === (localityName || '').toLowerCase());
  if (!loc || !loc.active) return { serviceable: false, reason: 'Locality not yet live on HOMMIE' };
  const hasCategory = loc.supportedCategories.includes(categorySlug);
  return {
    serviceable: hasCategory,
    reason: hasCategory ? 'Available for instant & scheduled dispatch' : 'Category launching soon in this sector'
  };
}

// --- 2. CATEGORIES ---

export function getCategories() {
  return _categories;
}

export function getCategoryBySlug(slug) {
  return _categories.find((c) => c.slug === slug || c.id === slug);
}

// --- 3. PROFESSIONALS & MATCHING ---

export function getProfessionals(filters = {}) {
  let list = [..._pros];

  // Category filter
  if (filters.categorySlug) {
    list = list.filter((p) => p.categoryIds.includes(filters.categorySlug));
  }

  // Locality serviceability filter
  if (filters.locality) {
    list = list.filter((p) => p.serviceLocalities.some((l) => l.toLowerCase() === filters.locality.toLowerCase()));
  }

  // Available Now filter
  if (filters.availableNowOnly) {
    list = list.filter((p) => p.isAvailable && p.availableNow);
  }

  // Rating filter
  if (filters.minRating) {
    list = list.filter((p) => p.ratingAvg >= filters.minRating);
  }

  // Hommie Verified badge filter
  if (filters.verifiedOnly) {
    list = list.filter((p) => p.verifications?.hommieVerified);
  }

  // Language filter
  if (filters.language) {
    list = list.filter((p) => p.languages.includes(filters.language));
  }

  // Query search
  if (filters.query && filters.query.trim()) {
    const q = filters.query.toLowerCase();
    list = list.filter((p) => 
      p.name.toLowerCase().includes(q) ||
      p.trade.toLowerCase().includes(q) ||
      p.headline.toLowerCase().includes(q) ||
      p.about.toLowerCase().includes(q)
    );
  }

  // Priority sorting: Verified > Rating > Completed Jobs
  list.sort((a, b) => {
    if (a.verifications?.hommieVerified !== b.verifications?.hommieVerified) {
      return a.verifications?.hommieVerified ? -1 : 1;
    }
    return b.ratingAvg - a.ratingAvg;
  });

  return list;
}

export function getProfessionalById(id) {
  return _pros.find((p) => p.id === id || p.userId === id);
}

export function toggleProAvailability(proId, isOnline) {
  const pro = _pros.find((p) => p.id === proId || p.userId === proId);
  if (pro) {
    pro.isAvailable = isOnline;
    pro.availableNow = isOnline;
    saveToStorage(STORAGE_KEYS.PROFESSIONALS, _pros);
    recordAuditLog('Professional ' + pro.name + ' set availability to ' + (isOnline ? 'Online' : 'Offline'), pro.name);
    notifyStateChanged();
  }
}

export function updateProProfile(proId, updates) {
  const idx = _pros.findIndex((p) => p.id === proId || p.userId === proId);
  if (idx !== -1) {
    _pros[idx] = { ..._pros[idx], ...updates };
    saveToStorage(STORAGE_KEYS.PROFESSIONALS, _pros);
    notifyStateChanged();
    return { success: true, pro: _pros[idx] };
  }
  return { success: false, error: 'Professional not found' };
}

// --- 4. BOOKINGS LIFECYCLE STATE MACHINE (17 STATES) ---

export function getBookings(filters = {}) {
  let list = [..._bookings];
  if (filters.customerId) {
    list = list.filter((b) => b.customerId === filters.customerId);
  }
  if (filters.workerId) {
    list = list.filter((b) => b.workerId === filters.workerId || b.workerUserId === filters.workerId);
  }
  if (filters.status) {
    list = list.filter((b) => b.status === filters.status);
  }
  // Newest first
  return list.reverse();
}

export function getBookingById(bookingId) {
  return _bookings.find((b) => b.id === bookingId || b.bookingRef === bookingId);
}

export function createBooking(payload) {
  const category = getCategoryBySlug(payload.categoryId) || _categories[0];
  const pro = getProfessionalById(payload.workerId) || _pros[0];

  const basePrice = payload.servicePrice || pro.baseRate || 499;
  const platformFee = 15;
  const safetyFee = 15;
  const finalAmount = basePrice + platformFee + safetyFee;

  const newBooking = {
    id: 'b-' + Date.now(),
    bookingRef: 'HOM-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
    customerId: payload.customerId || _customer?.id || 'u-cust-1',
    customerName: payload.customerName || _customer?.name || 'Hanzala Siddiqui',
    customerPhone: payload.customerPhone || _customer?.phone || '+91 98450 77123',
    workerId: pro.id,
    workerUserId: pro.userId,
    workerName: pro.name,
    workerTrade: pro.trade,
    workerPhone: pro.phone,
    workerAvatar: pro.avatar,
    categoryId: category.id,
    serviceTitle: payload.serviceTitle || (category.name + ' Inspection & Repair'),
    servicePrice: basePrice,
    inspectionFee: category.inspectionFee || 149,
    platformFee,
    safetyFee,
    bookingType: payload.bookingType || 'instant', // instant | scheduled
    scheduledDate: payload.scheduledDate || 'Today',
    scheduledTimeSlot: payload.scheduledTimeSlot || 'Within 30 mins',
    urgencyLevel: payload.urgencyLevel || 'standard',
    status: payload.bookingType === 'instant' ? 'pro_assigned' : 'scheduled_confirmed',
    statusHistory: [
      {
        status: 'draft',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actor: 'Customer',
        note: 'Booking requested by customer'
      },
      {
        status: payload.bookingType === 'instant' ? 'pro_assigned' : 'scheduled_confirmed',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actor: 'System',
        note: pro.name + ' accepted service dispatch'
      }
    ],
    address: payload.address || {
      flatNo: 'A-402, Green Glen Layout',
      street: '12th Main Road',
      locality: _customer?.activeLocality || 'Indiranagar',
      city: _customer?.city || 'Bengaluru',
      pincode: '560038',
      formattedAddress: 'A-402, Green Glen, 12th Main, Indiranagar, Bengaluru - 560038'
    },
    notes: payload.notes || 'Please ring bell upon arrival',
    safetyGuidelinesAcknowledged: true,
    pricingSummary: {
      baseQuote: basePrice,
      partsCost: 0,
      laborCost: basePrice,
      platformFee,
      safetyFee,
      totalTax: 0,
      discount: 0,
      finalAmount
    },
    quote: null,
    payment: {
      status: 'unpaid',
      method: null,
      transactionId: null,
      paidAt: null
    },
    customerRating: null,
    workerRating: null,
    timeline: [
      { step: 1, title: 'Dispatch Confirmed', completed: true, time: 'Just now' },
      { step: 2, title: 'Pro En Route', completed: false },
      { step: 3, title: 'On-Site Diagnostic', completed: false },
      { step: 4, title: 'Quote Approval & Repair', completed: false },
      { step: 5, title: 'Payment & 30-Day Guarantee', completed: false }
    ],
    messages: [
      {
        id: 'msg-init-1',
        senderRole: 'system',
        text: 'Booking confirmed with ' + pro.name + '. Standard inspection fee is ₹' + (category.inspectionFee || 149) + '.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]
  };

  _bookings.unshift(newBooking);
  saveToStorage(STORAGE_KEYS.BOOKINGS, _bookings);
  recordAuditLog('New booking ' + newBooking.bookingRef + ' created for ' + pro.name, 'Customer');
  notifyStateChanged();
  return newBooking;
}

export function advanceBookingStatus(bookingId, nextStatus, options = {}) {
  const booking = _bookings.find((b) => b.id === bookingId || b.bookingRef === bookingId);
  if (!booking) return { success: false, error: 'Booking not found' };

  const prevStatus = booking.status;
  booking.status = nextStatus;

  booking.statusHistory.push({
    status: nextStatus,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actor: options.actor || 'System',
    note: options.note || ('Status transitioned from ' + prevStatus + ' to ' + nextStatus)
  });

  saveToStorage(STORAGE_KEYS.BOOKINGS, _bookings);
  recordAuditLog('Booking ' + booking.bookingRef + ' updated to ' + nextStatus + ' by ' + (options.actor || 'User'), options.actor || 'System');
  notifyStateChanged();
  return { success: true, booking };
}

export function sendBookingMessage(bookingId, senderRole, senderName, text) {
  const booking = _bookings.find((b) => b.id === bookingId || b.bookingRef === bookingId);
  if (!booking) return false;

  const msg = {
    id: 'msg-' + Date.now(),
    senderRole,
    senderName,
    text,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  if (!booking.messages) booking.messages = [];
  booking.messages.push(msg);

  saveToStorage(STORAGE_KEYS.BOOKINGS, _bookings);
  notifyStateChanged();
  return msg;
}

export function submitOnSiteQuote(bookingId, quotePayload) {
  const booking = _bookings.find((b) => b.id === bookingId || b.bookingRef === bookingId);
  if (!booking) return false;

  const parts = Number(quotePayload.partsCost || 0);
  const labor = Number(quotePayload.laborCost || 0);
  const totalAmount = parts + labor;

  booking.quote = {
    id: 'quote-' + Date.now(),
    description: quotePayload.description,
    partsCost: parts,
    laborCost: labor,
    totalAmount,
    items: quotePayload.items || [
      { description: quotePayload.description, qty: 1, rate: totalAmount }
    ],
    status: 'pending',
    submittedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  booking.status = 'quote_submitted';
  booking.statusHistory.push({
    status: 'quote_submitted',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actor: booking.workerName,
    note: 'On-site estimate of ₹' + totalAmount + ' submitted for customer approval'
  });

  saveToStorage(STORAGE_KEYS.BOOKINGS, _bookings);
  recordAuditLog('Quote of ₹' + totalAmount + ' submitted for booking ' + booking.bookingRef, booking.workerName);
  notifyStateChanged();
  return booking.quote;
}

export function respondToQuote(bookingId, approved, reason = '') {
  const booking = _bookings.find((b) => b.id === bookingId || b.bookingRef === bookingId);
  if (!booking || !booking.quote) return false;

  booking.quote.status = approved ? 'approved' : 'rejected';
  booking.quote.decisionReason = reason;

  if (approved) {
    booking.status = 'quote_approved';
    booking.servicePrice = booking.quote.totalAmount;
    booking.pricingSummary.laborCost = booking.quote.laborCost;
    booking.pricingSummary.partsCost = booking.quote.partsCost;
    booking.pricingSummary.finalAmount = booking.quote.totalAmount + booking.platformFee + booking.safetyFee;

    booking.statusHistory.push({
      status: 'quote_approved',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actor: booking.customerName,
      note: 'Customer approved the quote of ₹' + booking.quote.totalAmount
    });
  } else {
    booking.status = 'inspection_in_progress';
    booking.statusHistory.push({
      status: 'inspection_in_progress',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      actor: booking.customerName,
      note: 'Customer declined quote: ' + reason
    });
  }

  saveToStorage(STORAGE_KEYS.BOOKINGS, _bookings);
  notifyStateChanged();
  return true;
}

export function processBookingPayment(bookingId, paymentPayload) {
  const booking = _bookings.find((b) => b.id === bookingId || b.bookingRef === bookingId);
  if (!booking) return false;

  booking.payment = {
    status: 'paid',
    method: paymentPayload.method || 'upi', // upi | card | cash
    transactionId: 'TXN-HOM-' + Date.now().toString().slice(-6),
    upiApp: paymentPayload.upiApp || null,
    amount: booking.pricingSummary.finalAmount || booking.servicePrice,
    paidAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };

  booking.status = 'completed';
  booking.statusHistory.push({
    status: 'completed',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actor: 'Customer',
    note: 'Payment of ₹' + booking.payment.amount + ' received via ' + booking.payment.method.toUpperCase()
  });

  saveToStorage(STORAGE_KEYS.BOOKINGS, _bookings);
  recordAuditLog('Payment of ₹' + booking.payment.amount + ' captured for ' + booking.bookingRef, 'Customer');
  notifyStateChanged();
  return booking.payment;
}

export function submitBookingRating(bookingId, ratingPayload) {
  const booking = _bookings.find((b) => b.id === bookingId || b.bookingRef === bookingId);
  if (!booking) return false;

  const reviewObj = {
    rating: ratingPayload.rating,
    criteria: ratingPayload.criteria || {
      punctuality: 5,
      quality: 5,
      behavior: 5,
      pricing: 5
    },
    comment: ratingPayload.comment,
    date: 'Today',
    customerName: booking.customerName,
    serviceRendered: booking.serviceTitle
  };

  booking.customerRating = reviewObj;

  // Update pro stats
  const pro = _pros.find((p) => p.id === booking.workerId);
  if (pro) {
    if (!pro.reviews) pro.reviews = [];
    pro.reviews.unshift({
      id: 'rev-' + Date.now(),
      ...reviewObj,
      locality: booking.address?.locality || 'Indiranagar'
    });
    pro.ratingCount = (pro.ratingCount || 0) + 1;
    const totalScore = pro.reviews.reduce((acc, r) => acc + r.rating, 0);
    pro.ratingAvg = Number((totalScore / pro.reviews.length).toFixed(1));
    saveToStorage(STORAGE_KEYS.PROFESSIONALS, _pros);
  }

  saveToStorage(STORAGE_KEYS.BOOKINGS, _bookings);
  recordAuditLog('Rating of ' + ratingPayload.rating + '★ submitted for ' + booking.workerName, booking.customerName);
  notifyStateChanged();
  return true;
}

export function cancelBooking(bookingId, reason = '') {
  const booking = _bookings.find((b) => b.id === bookingId || b.bookingRef === bookingId);
  if (!booking) return false;

  booking.status = 'cancelled_by_customer';
  booking.statusHistory.push({
    status: 'cancelled_by_customer',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actor: 'Customer',
    note: 'Cancelled by customer: ' + reason
  });

  saveToStorage(STORAGE_KEYS.BOOKINGS, _bookings);
  recordAuditLog('Booking ' + booking.bookingRef + ' cancelled: ' + reason, 'Customer');
  notifyStateChanged();
  return true;
}

// --- 5. CUSTOMER & MY HOME HUB ---

export function getCustomer() {
  return _customer;
}

export function updateCustomer(updates) {
  _customer = { ..._customer, ...updates };
  saveToStorage(STORAGE_KEYS.CUSTOMER, _customer);
  notifyStateChanged();
}

export function getCustomerHomeAssets() {
  return _homeAssets;
}

export function addHomeAsset(asset) {
  const newAsset = {
    id: 'asset-' + Date.now(),
    name: asset.name,
    category: asset.category,
    brand: asset.brand,
    modelNumber: asset.modelNumber || '',
    purchaseDate: asset.purchaseDate || '2024',
    warrantyTill: asset.warrantyTill || '2026',
    location: asset.location || 'Living Room',
    notes: asset.notes || '',
    serviceHistory: []
  };
  _homeAssets.unshift(newAsset);
  saveToStorage(STORAGE_KEYS.HOME_ASSETS, _homeAssets);
  notifyStateChanged();
  return newAsset;
}

export function updateHomeAsset(id, updates) {
  const idx = _homeAssets.findIndex((a) => a.id === id);
  if (idx !== -1) {
    _homeAssets[idx] = { ..._homeAssets[idx], ...updates };
    saveToStorage(STORAGE_KEYS.HOME_ASSETS, _homeAssets);
    notifyStateChanged();
  }
}

export function deleteHomeAsset(id) {
  _homeAssets = _homeAssets.filter((a) => a.id !== id);
  saveToStorage(STORAGE_KEYS.HOME_ASSETS, _homeAssets);
  notifyStateChanged();
}

// --- 6. ADMIN & AUDIT TRAIL ---

export function getAuditLogs() {
  return _auditLogs;
}

export function recordAuditLog(details, actor = 'System') {
  const log = {
    id: 'log-' + Date.now(),
    timestamp: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    actor,
    action: details.slice(0, 30).toUpperCase(),
    details
  };
  _auditLogs.unshift(log);
  if (_auditLogs.length > 100) _auditLogs.pop();
  saveToStorage(STORAGE_KEYS.AUDIT_LOGS, _auditLogs);
}

export function fileSafetyReport(reportPayload) {
  const report = {
    id: 'safe-' + Date.now(),
    bookingId: reportPayload.bookingId || null,
    proId: reportPayload.proId || null,
    reporterName: reportPayload.reporterName || _customer?.name || 'Anonymous',
    reporterPhone: reportPayload.reporterPhone || _customer?.phone || '',
    category: reportPayload.category || 'conduct',
    description: reportPayload.description,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'investigating'
  };
  _safetyReports.unshift(report);
  saveToStorage(STORAGE_KEYS.SAFETY_REPORTS, _safetyReports);
  recordAuditLog('SAFETY REPORT FIRED: ' + report.category + ' for Incident #' + report.id, 'Safety Engine');
  notifyStateChanged();
  return report;
}

export function getSafetyReports() {
  return _safetyReports;
}

export function updateKycStatus(proId, newStatus, adminActor = 'Admin') {
  const pro = _pros.find((p) => p.id === proId || p.userId === proId);
  if (pro) {
    pro.kycStatus = newStatus;
    if (newStatus === 'verified') {
      pro.verifications.hommieVerified = true;
      pro.verifications.identityDocumentSubmitted = true;
      pro.verifications.backgroundCheckCompleted = true;
    }
    saveToStorage(STORAGE_KEYS.PROFESSIONALS, _pros);
    recordAuditLog('Pro ' + pro.name + ' KYC status updated to ' + newStatus + ' by ' + adminActor, adminActor);
    notifyStateChanged();
    return true;
  }
  return false;
}

export function toggleLocalityStatus(cityId, localityId, isActive) {
  const city = _cities.find((c) => c.id === cityId);
  if (city) {
    const loc = city.localities.find((l) => l.id === localityId);
    if (loc) {
      loc.active = isActive;
      saveToStorage(STORAGE_KEYS.CITIES, _cities);
      recordAuditLog('Locality ' + loc.name + ' (' + city.name + ') status set to ' + (isActive ? 'Active' : 'Paused'), 'Admin');
      notifyStateChanged();
      return true;
    }
  }
  return false;
}

export function registerNewProfessional(payload) {
  const newPro = {
    id: 'pro-' + Date.now().toString().slice(-5),
    userId: 'u-pro-' + Date.now().toString().slice(-4),
    name: payload.name,
    trade: payload.trade || 'Independent Service Specialist',
    categoryIds: payload.categoryIds || ['ac-service'],
    avatar: payload.avatar || 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80',
    headline: (payload.experienceYears || 5) + '+ Years Experience • ' + (payload.trade || 'Technician') + ' Specialist',
    about: payload.about || 'Skilled independent professional dedicated to transparent diagnostics and high-quality workmanship.',
    phone: payload.phone,
    email: payload.email || 'pro@hommie.in',
    city: payload.city || 'Bengaluru',
    primaryLocality: payload.primaryLocality || 'Indiranagar',
    serviceLocalities: payload.serviceLocalities || [payload.primaryLocality || 'Indiranagar'],
    serviceRadiusKm: 10,
    languages: ['Hindi', 'English'],
    experienceYears: Number(payload.experienceYears || 5),
    baseRate: Number(payload.baseRate || 499),
    inspectionFee: 149,
    pricingModel: 'starting',
    isAvailable: true,
    availableNow: true,
    earliestArrivalMins: 25,
    ratingAvg: 5.0,
    ratingCount: 0,
    jobsCompleted: 0,
    responseRatePercent: 100,
    avgResponseMinutes: 5,
    repeatCustomerCount: 0,
    verifications: {
      phoneVerified: true,
      identityDocumentSubmitted: true,
      backgroundCheckCompleted: false,
      addressVerified: true,
      hommieVerified: false
    },
    kycStatus: 'pending_verification',
    payoutBank: {
      accountHolder: payload.name,
      accountMasked: '•••• ' + (payload.aadhaarNumber?.slice(-4) || '1234'),
      ifsc: 'HDFC0001245',
      upiId: payload.upiId || (payload.phone + '@upi')
    },
    portfolio: [
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=400&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80'
    ],
    rateCard: [
      { service: (payload.trade || 'Standard Service') + ' Diagnostic Inspection', price: 149, pricingType: 'inspection', estimatedTime: '30 mins', warranty: '30-day rework cover' },
      { service: (payload.trade || 'Standard Service') + ' Complete Repair & Tune-up', price: payload.baseRate || 499, pricingType: 'starting', estimatedTime: '60 mins', warranty: '30-day rework cover' }
    ],
    reviews: []
  };

  _pros.unshift(newPro);
  saveToStorage(STORAGE_KEYS.PROFESSIONALS, _pros);
  recordAuditLog('New technician ' + newPro.name + ' registered (KYC Pending Review)', newPro.name);
  notifyStateChanged();
  return newPro;
}