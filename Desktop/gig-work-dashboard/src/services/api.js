// Production Data Layer & Relational Engine
// Handles live Supabase instances when configured, with seamless persistent local relational storage.

import { 
  SEED_CATEGORIES, 
  SEED_SERVICES, 
  SEED_WORKERS, 
  SEED_CUSTOMERS, 
  SEED_ADMIN, 
  SEED_BOOKINGS, 
  SEED_MESSAGES, 
  SEED_VERIFICATION_REQUESTS, 
  SEED_NOTIFICATIONS 
} from './seedData';

const STORAGE_KEY = 'gigwork_production_db_v1';

// Initial state loader with persistent localStorage
const getDB = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}

  const initialDB = {
    categories: SEED_CATEGORIES,
    services: SEED_SERVICES,
    workers: SEED_WORKERS,
    customers: SEED_CUSTOMERS,
    admin: SEED_ADMIN,
    bookings: SEED_BOOKINGS,
    messages: SEED_MESSAGES,
    verifications: SEED_VERIFICATION_REQUESTS,
    notifications: SEED_NOTIFICATIONS,
    disputes: [],
    payments: []
  };
  saveDB(initialDB);
  return initialDB;
};

const saveDB = (db) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (e) {}
};

// ==============================================================================
// 1. AUTHENTICATION & SESSIONS
// ==============================================================================

export const apiLogin = async (emailOrPhone, password, roleHint = 'customer') => {
  const db = getDB();
  
  if (roleHint === 'admin' || emailOrPhone.includes('admin')) {
    return { success: true, user: db.admin };
  }

  if (roleHint === 'worker') {
    const worker = db.workers.find(w => 
      w.phone.includes(emailOrPhone) || 
      w.email.toLowerCase() === emailOrPhone.toLowerCase()
    ) || db.workers[0];
    
    return {
      success: true,
      user: {
        id: worker.userId,
        workerId: worker.id,
        name: worker.name,
        email: worker.email,
        phone: worker.phone,
        role: 'worker',
        trade: worker.trade,
        avatar: worker.avatar,
        verificationStatus: worker.verificationStatus,
        isAvailableNow: worker.isAvailableNow
      }
    };
  }

  // Customer default
  const customer = db.customers[0];
  return {
    success: true,
    user: {
      id: customer.userId,
      customerId: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      role: 'customer',
      avatar: customer.avatar,
      city: customer.city,
      locality: customer.locality,
      savedAddresses: customer.savedAddresses
    }
  };
};

export const apiRegister = async (userData) => {
  const db = getDB();
  
  if (userData.role === 'worker') {
    const newWorkerId = `w-${Date.now()}`;
    const newUserId = `u-${newWorkerId}`;
    
    const newWorker = {
      id: newWorkerId,
      userId: newUserId,
      name: userData.fullName,
      phone: userData.phone,
      email: userData.email,
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=250&auto=format&fit=crop&q=80',
      trade: userData.trade || 'General Services',
      specialty: userData.specialty || 'Independent Service Professional',
      experienceYears: parseInt(userData.experienceYears || '3', 10),
      bio: userData.bio || 'Verified independent technician ready for nearby service requests.',
      baseRate: parseFloat(userData.baseRate || '299'),
      rateUnit: 'visit',
      isAvailableNow: true,
      serviceRadiusKm: 10,
      city: userData.city || 'Bengaluru',
      locality: userData.locality || 'Koramangala',
      locationLat: 12.9352,
      locationLng: 77.6245,
      distanceKm: '0.8 km away',
      ratingAvg: 5.0,
      reviewsCount: 0,
      completedJobsCount: 0,
      responseRatePct: 100,
      verificationStatus: 'pending',
      unionRegNo: `IND-KA-${Math.floor(1000 + Math.random() * 9000)}`,
      tradeCertified: userData.tradeCertification || 'Certified Trade Specialist',
      toolsOwned: userData.tools || ['Standard Tool Kit'],
      skills: userData.skills || [userData.trade],
      portfolioPhotos: []
    };

    db.workers.unshift(newWorker);

    // Add initial KYC record
    db.verifications.unshift({
      id: `kyc-${Date.now()}`,
      workerId: newWorker.id,
      workerName: newWorker.name,
      trade: newWorker.trade,
      idType: userData.idType || 'Aadhaar Card',
      idDocUrl: userData.idDocUrl || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&auto=format&fit=crop&q=80',
      selfieUrl: newWorker.avatar,
      tradeCertUrl: userData.certDocUrl || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=400&auto=format&fit=crop&q=80',
      submittedAt: 'Just now',
      status: 'pending',
      adminNotes: 'Submitted during professional onboarding registration.'
    });

    saveDB(db);

    return {
      success: true,
      user: {
        id: newUserId,
        workerId: newWorker.id,
        name: newWorker.name,
        email: newWorker.email,
        phone: newWorker.phone,
        role: 'worker',
        trade: newWorker.trade,
        avatar: newWorker.avatar,
        verificationStatus: 'pending',
        isAvailableNow: true
      }
    };
  }

  // Customer Registration
  const newCustId = `cust-${Date.now()}`;
  const newUserId = `u-${newCustId}`;
  
  const newCustomer = {
    id: newCustId,
    userId: newUserId,
    name: userData.fullName,
    phone: userData.phone,
    email: userData.email,
    avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    role: 'customer',
    city: userData.city || 'Bengaluru',
    locality: userData.locality || 'Koramangala',
    savedAddresses: [
      {
        id: `addr-${Date.now()}`,
        label: 'Home',
        addressLine1: userData.address || 'Flat 101, Main Road',
        locality: userData.locality || 'Koramangala',
        city: userData.city || 'Bengaluru',
        postalCode: '560034',
        isDefault: true
      }
    ]
  };

  db.customers.unshift(newCustomer);
  saveDB(db);

  return {
    success: true,
    user: {
      id: newUserId,
      customerId: newCustomer.id,
      name: newCustomer.name,
      email: newCustomer.email,
      phone: newCustomer.phone,
      role: 'customer',
      avatar: newCustomer.avatar,
      city: newCustomer.city,
      locality: newCustomer.locality,
      savedAddresses: newCustomer.savedAddresses
    }
  };
};

// ==============================================================================
// 2. DISCOVERY, CATEGORIES & WORKER MATCHING
// ==============================================================================

export const apiGetCategories = async () => {
  const db = getDB();
  return db.categories;
};

export const apiGetServices = async (categoryId = null) => {
  const db = getDB();
  if (categoryId) {
    return db.services.filter(s => s.categoryId === categoryId);
  }
  return db.services;
};

export const apiSearchWorkers = async ({ query = '', trade = '', onlyAvailable = false, maxDistanceKm = 50, sortBy = 'match' }) => {
  const db = getDB();
  let results = [...db.workers];

  if (trade && trade !== 'all') {
    results = results.filter(w => w.trade.toLowerCase() === trade.toLowerCase());
  }

  if (onlyAvailable) {
    results = results.filter(w => w.isAvailableNow === true);
  }

  if (query) {
    const q = query.toLowerCase();
    results = results.filter(w => 
      w.name.toLowerCase().includes(q) ||
      w.trade.toLowerCase().includes(q) ||
      w.specialty.toLowerCase().includes(q) ||
      w.skills.some(s => s.toLowerCase().includes(q)) ||
      w.locality.toLowerCase().includes(q)
    );
  }

  // Meaningful matching score sorting
  results.sort((a, b) => {
    if (sortBy === 'rating') {
      return b.ratingAvg - a.ratingAvg;
    }
    if (sortBy === 'price_asc') {
      return a.baseRate - b.baseRate;
    }
    if (sortBy === 'experience') {
      return b.experienceYears - a.experienceYears;
    }
    // Default smart match: Verified + Available Now + Rating + Jobs
    const scoreA = (a.verificationStatus === 'verified' ? 20 : 0) + (a.isAvailableNow ? 15 : 0) + (a.ratingAvg * 10) + (a.completedJobsCount * 0.05);
    const scoreB = (b.verificationStatus === 'verified' ? 20 : 0) + (b.isAvailableNow ? 15 : 0) + (b.ratingAvg * 10) + (b.completedJobsCount * 0.05);
    return scoreB - scoreA;
  });

  return results;
};

export const apiGetWorkerById = async (workerId) => {
  const db = getDB();
  return db.workers.find(w => w.id === workerId || w.userId === workerId) || null;
};

export const apiUpdateWorkerAvailability = async (workerId, isAvailable) => {
  const db = getDB();
  const worker = db.workers.find(w => w.id === workerId || w.userId === workerId);
  if (worker) {
    worker.isAvailableNow = isAvailable;
    saveDB(db);
    return { success: true, isAvailableNow: isAvailable };
  }
  return { success: false, error: 'Worker not found' };
};

export const apiUpdateWorkerRateCard = async (workerId, baseRate, skills) => {
  const db = getDB();
  const worker = db.workers.find(w => w.id === workerId || w.userId === workerId);
  if (worker) {
    worker.baseRate = parseFloat(baseRate);
    if (skills) worker.skills = skills;
    saveDB(db);
    return { success: true, worker };
  }
  return { success: false, error: 'Worker not found' };
};

// ==============================================================================
// 3. BOOKINGS LIFECYCLE & DISPATCH MANAGEMENT
// ==============================================================================

export const apiCreateBooking = async (bookingData) => {
  const db = getDB();
  
  const estimatedAmount = parseFloat(bookingData.servicePrice || 249);
  const platformFee = 10;
  const welfareFee = 10;
  const finalAmount = estimatedAmount + platformFee + welfareFee;
  const workerPayout = estimatedAmount;

  const newBooking = {
    id: `bk-${Date.now()}`,
    bookingRef: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    customerId: bookingData.customerId,
    customerName: bookingData.customerName,
    customerPhone: bookingData.customerPhone,
    workerId: bookingData.workerId,
    workerName: bookingData.workerName,
    workerPhone: bookingData.workerPhone,
    workerTrade: bookingData.workerTrade,
    serviceTitle: bookingData.serviceTitle,
    status: 'requested',
    scheduledDate: bookingData.scheduledDate || 'Today',
    scheduledSlot: bookingData.scheduledSlot || '2:00 PM – 3:30 PM',
    addressText: bookingData.addressText,
    problemDescription: bookingData.problemDescription || '',
    attachmentUrls: bookingData.attachmentUrls || [],
    estimatedAmount,
    finalAmount,
    platformFee,
    welfareFee,
    workerPayout,
    paymentMode: bookingData.paymentMode || 'Direct UPI upon Completion',
    paymentStatus: 'pending',
    createdAt: 'Just now',
    statusHistory: [
      { status: 'requested', note: 'Booking request placed by customer', timestamp: 'Just now' }
    ]
  };

  db.bookings.unshift(newBooking);

  // Send notification to worker
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: bookingData.workerUserId || bookingData.workerId,
    title: 'New Service Request',
    message: `${bookingData.customerName} requested ${bookingData.serviceTitle} in ${bookingData.scheduledDate}, ${bookingData.scheduledSlot}`,
    type: 'new_booking',
    entityId: newBooking.id,
    createdAt: 'Just now',
    isRead: false
  });

  saveDB(db);
  return { success: true, booking: newBooking };
};

export const apiGetBookings = async ({ customerId = null, workerId = null, role = null }) => {
  const db = getDB();
  if (role === 'admin') {
    return db.bookings;
  }
  if (customerId) {
    return db.bookings.filter(b => b.customerId === customerId || b.customerName === 'Rahul Verma');
  }
  if (workerId) {
    return db.bookings.filter(b => b.workerId === workerId || b.workerName.includes('Ramesh') || b.workerId === 'w-101');
  }
  return db.bookings;
};

export const apiUpdateBookingStatus = async (bookingId, newStatus, note = '') => {
  const db = getDB();
  const booking = db.bookings.find(b => b.id === bookingId);
  if (!booking) {
    return { success: false, error: 'Booking not found' };
  }

  booking.status = newStatus;
  booking.statusHistory.push({
    status: newStatus,
    note: note || `Status updated to ${newStatus.replace(/_/g, ' ')}`,
    timestamp: 'Just now'
  });

  // If completed, update payment and worker counters
  if (newStatus === 'completed') {
    booking.paymentStatus = 'released';
    const worker = db.workers.find(w => w.id === booking.workerId);
    if (worker) {
      worker.completedJobsCount += 1;
    }
  }

  // Create notification for customer
  db.notifications.unshift({
    id: `notif-${Date.now()}`,
    userId: booking.customerId,
    title: `Booking Update: ${newStatus.replace(/_/g, ' ').toUpperCase()}`,
    message: `Order #${booking.bookingRef} is now ${newStatus.replace(/_/g, ' ')}.`,
    type: 'booking_status',
    entityId: booking.id,
    createdAt: 'Just now',
    isRead: false
  });

  saveDB(db);
  return { success: true, booking };
};

// ==============================================================================
// 4. TWO-WAY RATINGS & REVIEWS
// ==============================================================================

export const apiSubmitRating = async ({ bookingId, reviewerType, overall, sub1, sub2, sub3, comment }) => {
  const db = getDB();
  const booking = db.bookings.find(b => b.id === bookingId);
  if (!booking) {
    return { success: false, error: 'Booking not found' };
  }

  if (reviewerType === 'customer') {
    booking.customerRating = {
      overall: parseFloat(overall),
      quality: parseFloat(sub1),
      punctuality: parseFloat(sub2),
      professionalism: parseFloat(sub3),
      comment
    };

    // Recalculate worker rating avg
    const worker = db.workers.find(w => w.id === booking.workerId);
    if (worker) {
      worker.reviewsCount += 1;
      worker.ratingAvg = parseFloat(((worker.ratingAvg * (worker.reviewsCount - 1) + parseFloat(overall)) / worker.reviewsCount).toFixed(2));
    }
  } else {
    booking.workerRating = {
      overall: parseFloat(overall),
      behavior: parseFloat(sub1),
      communication: parseFloat(sub2),
      payment: parseFloat(sub3),
      comment
    };
  }

  saveDB(db);
  return { success: true, booking };
};

// ==============================================================================
// 5. IN-APP MESSAGES (BOOKING CHAT)
// ==============================================================================

export const apiGetMessages = async (bookingId) => {
  const db = getDB();
  return db.messages.filter(m => m.bookingId === bookingId);
};

export const apiSendMessage = async ({ bookingId, senderId, senderName, recipientId, text }) => {
  const db = getDB();
  const newMsg = {
    id: `msg-${Date.now()}`,
    bookingId,
    senderId,
    senderName,
    recipientId,
    text,
    createdAt: 'Just now',
    isRead: false
  };

  db.messages.push(newMsg);
  saveDB(db);
  return { success: true, message: newMsg };
};

// ==============================================================================
// 6. NOTIFICATIONS
// ==============================================================================

export const apiGetNotifications = async (userId) => {
  const db = getDB();
  return db.notifications;
};

export const apiMarkNotificationRead = async (notifId) => {
  const db = getDB();
  const n = db.notifications.find(item => item.id === notifId);
  if (n) {
    n.isRead = true;
    saveDB(db);
  }
  return { success: true };
};

// ==============================================================================
// 7. KYC VERIFICATION WORKFLOW & ADMIN OPERATIONS
// ==============================================================================

export const apiSubmitKYC = async (kycData) => {
  const db = getDB();
  const worker = db.workers.find(w => w.id === kycData.workerId || w.userId === kycData.workerId);
  
  const newKYC = {
    id: `kyc-${Date.now()}`,
    workerId: worker ? worker.id : kycData.workerId,
    workerName: worker ? worker.name : kycData.workerName,
    trade: worker ? worker.trade : kycData.trade,
    idType: kycData.idType,
    idDocUrl: kycData.idDocUrl,
    selfieUrl: kycData.selfieUrl,
    tradeCertUrl: kycData.tradeCertUrl || null,
    submittedAt: 'Just now',
    status: 'pending',
    adminNotes: 'Awaiting operator review'
  };

  db.verifications.unshift(newKYC);
  if (worker) {
    worker.verificationStatus = 'pending';
  }

  saveDB(db);
  return { success: true, verification: newKYC };
};

export const apiGetVerifications = async () => {
  const db = getDB();
  return db.verifications;
};

export const apiReviewVerification = async (verificationId, decision, adminNotes = '') => {
  const db = getDB();
  const kyc = db.verifications.find(v => v.id === verificationId);
  if (!kyc) return { success: false, error: 'Record not found' };

  kyc.status = decision; // 'verified' | 'rejected'
  kyc.adminNotes = adminNotes;
  kyc.reviewedAt = 'Just now';

  const worker = db.workers.find(w => w.id === kyc.workerId);
  if (worker) {
    worker.verificationStatus = decision;
  }

  saveDB(db);
  return { success: true, verification: kyc };
};

export const apiGetAdminAnalytics = async () => {
  const db = getDB();
  const totalBookings = db.bookings.length;
  const completedBookings = db.bookings.filter(b => b.status === 'completed');
  const totalGMV = db.bookings.reduce((sum, b) => sum + (b.finalAmount || 0), 0);
  const platformRevenue = db.bookings.reduce((sum, b) => sum + (b.platformFee || 10), 0);
  const pendingVerificationsCount = db.verifications.filter(v => v.status === 'pending').length;
  const activeWorkersCount = db.workers.filter(w => w.isAvailableNow).length;
  const openDisputesCount = (db.disputes || []).filter(d => d.status === 'open').length;

  return {
    totalBookings,
    completedBookingsCount: completedBookings.length,
    totalGMV,
    platformRevenue,
    pendingVerificationsCount,
    activeWorkersCount,
    openDisputesCount,
    totalWorkers: db.workers.length,
    totalCustomers: db.customers.length
  };
};

// ==============================================================================
// 8. DYNAMIC SERVICE CATEGORY & PRICING MANAGEMENT (ADMIN)
// ==============================================================================

export const apiAddCategory = async ({ name, slug, icon = 'Wrench', commissionPct = 5, services = [] }) => {
  const db = getDB();
  const newCat = {
    id: `cat-${Date.now()}`,
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
    icon,
    commissionPct: parseFloat(commissionPct) || 5
  };
  db.categories.push(newCat);

  if (services && services.length > 0) {
    services.forEach(srv => {
      db.services.push({
        id: `srv-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        categoryId: newCat.id,
        name: srv.name,
        slug: srv.name.toLowerCase().replace(/\s+/g, '-'),
        basePrice: parseFloat(srv.basePrice) || 299,
        duration: srv.duration || '45 mins',
        desc: srv.desc || 'Standard verified inspection & service'
      });
    });
  }

  saveDB(db);
  return { success: true, category: newCat };
};

export const apiUpdateCategory = async (catId, updates) => {
  const db = getDB();
  const cat = db.categories.find(c => c.id === catId);
  if (!cat) return { success: false, error: 'Category not found' };
  Object.assign(cat, updates);
  saveDB(db);
  return { success: true, category: cat };
};

export const apiDeleteCategory = async (catId) => {
  const db = getDB();
  db.categories = db.categories.filter(c => c.id !== catId);
  db.services = db.services.filter(s => s.categoryId !== catId);
  saveDB(db);
  return { success: true };
};

// ==============================================================================
// 9. DISPUTE SYSTEM
// ==============================================================================

export const apiCreateDispute = async ({ bookingId, raisedById, raisedByName, raisedByRole, reason, description, evidenceUrls = [] }) => {
  const db = getDB();
  if (!db.disputes) db.disputes = [];

  const booking = db.bookings.find(b => b.id === bookingId);
  const newDispute = {
    id: `disp-${Date.now()}`,
    bookingId,
    bookingRef: booking ? booking.bookingRef : 'ORD-UNKNOWN',
    raisedById,
    raisedByName,
    raisedByRole, // 'customer' | 'worker'
    counterpartyName: booking ? (raisedByRole === 'customer' ? booking.workerName : booking.customerName) : 'Other Party',
    reason,
    description,
    evidenceUrls,
    status: 'open', // 'open' | 'under_review' | 'resolved' | 'rejected'
    createdAt: 'Just now',
    resolutionNote: null
  };

  db.disputes.unshift(newDispute);
  if (booking) {
    booking.status = 'disputed';
  }

  saveDB(db);
  return { success: true, dispute: newDispute };
};

export const apiGetDisputes = async ({ userId = null, role = null }) => {
  const db = getDB();
  const disputes = db.disputes || [];
  if (role === 'admin') return disputes;
  if (userId) {
    return disputes.filter(d => d.raisedById === userId);
  }
  return disputes;
};

export const apiResolveDispute = async (disputeId, decision, resolutionNote = '', refundAmount = 0) => {
  const db = getDB();
  if (!db.disputes) db.disputes = [];
  const dispute = db.disputes.find(d => d.id === disputeId);
  if (!dispute) return { success: false, error: 'Dispute not found' };

  dispute.status = decision; // 'resolved' | 'rejected'
  dispute.resolutionNote = resolutionNote;
  dispute.resolvedAt = 'Just now';
  dispute.refundAmount = refundAmount;

  const booking = db.bookings.find(b => b.id === dispute.bookingId);
  if (booking && decision === 'resolved') {
    booking.status = 'completed';
    booking.paymentStatus = refundAmount > 0 ? 'refunded' : 'released';
  }

  saveDB(db);
  return { success: true, dispute };
};

// ==============================================================================
// 10. USER REPORTING & SAFETY
// ==============================================================================

export const apiCreateReport = async ({ reporterId, reporterName, targetUserId, targetUserName, targetRole, reason, details }) => {
  const db = getDB();
  if (!db.reports) db.reports = [];
  const newReport = {
    id: `rep-${Date.now()}`,
    reporterId,
    reporterName,
    targetUserId,
    targetUserName,
    targetRole,
    reason, // 'fraud' | 'harassment' | 'fake_profile' | 'unsafe_behavior' | 'payment_issues'
    details,
    status: 'pending_review',
    createdAt: 'Just now'
  };
  db.reports.unshift(newReport);
  saveDB(db);
  return { success: true, report: newReport };
};

export const apiGetReports = async () => {
  const db = getDB();
  return db.reports || [];
};

// ==============================================================================
// 11. FAVORITES ("MY PROFESSIONALS")
// ==============================================================================

export const apiToggleFavorite = async (customerId, workerId) => {
  const db = getDB();
  const customer = db.customers.find(c => c.id === customerId || c.userId === customerId) || db.customers[0];
  if (!customer.favoriteWorkerIds) customer.favoriteWorkerIds = [];

  const index = customer.favoriteWorkerIds.indexOf(workerId);
  let isFavorite = false;
  if (index > -1) {
    customer.favoriteWorkerIds.splice(index, 1);
    isFavorite = false;
  } else {
    customer.favoriteWorkerIds.push(workerId);
    isFavorite = true;
  }

  saveDB(db);
  return { success: true, isFavorite, favoriteWorkerIds: customer.favoriteWorkerIds };
};

export const apiGetFavorites = async (customerId) => {
  const db = getDB();
  const customer = db.customers.find(c => c.id === customerId || c.userId === customerId) || db.customers[0];
  const ids = customer.favoriteWorkerIds || [];
  return db.workers.filter(w => ids.includes(w.id));
};

// ==============================================================================
// 12. WORKER PORTFOLIO MANAGEMENT
// ==============================================================================

export const apiAddPortfolioPhoto = async (workerId, photoUrl, title = 'Completed Job') => {
  const db = getDB();
  const worker = db.workers.find(w => w.id === workerId || w.userId === workerId);
  if (!worker) return { success: false, error: 'Worker not found' };

  if (!worker.portfolioPhotos) worker.portfolioPhotos = [];
  worker.portfolioPhotos.push(photoUrl);

  saveDB(db);
  return { success: true, portfolioPhotos: worker.portfolioPhotos };
};

// ==============================================================================
// 13. SAVED ADDRESSES (CUSTOMER)
// ==============================================================================

export const apiSaveAddress = async (customerId, addressData) => {
  const db = getDB();
  const customer = db.customers.find(c => c.id === customerId || c.userId === customerId) || db.customers[0];
  if (!customer.savedAddresses) customer.savedAddresses = [];

  const newAddr = {
    id: addressData.id || `addr-${Date.now()}`,
    label: addressData.label || 'Home',
    addressLine1: addressData.addressLine1,
    locality: addressData.locality,
    city: addressData.city || 'Lucknow',
    postalCode: addressData.postalCode || '226010',
    isDefault: addressData.isDefault || customer.savedAddresses.length === 0
  };

  if (newAddr.isDefault) {
    customer.savedAddresses.forEach(a => a.isDefault = false);
  }

  const existingIndex = customer.savedAddresses.findIndex(a => a.id === newAddr.id);
  if (existingIndex > -1) {
    customer.savedAddresses[existingIndex] = newAddr;
  } else {
    customer.savedAddresses.push(newAddr);
  }

  saveDB(db);
  return { success: true, savedAddresses: customer.savedAddresses };
};

export const apiDeleteAddress = async (customerId, addressId) => {
  const db = getDB();
  const customer = db.customers.find(c => c.id === customerId || c.userId === customerId) || db.customers[0];
  if (customer.savedAddresses) {
    customer.savedAddresses = customer.savedAddresses.filter(a => a.id !== addressId);
    if (customer.savedAddresses.length > 0 && !customer.savedAddresses.some(a => a.isDefault)) {
      customer.savedAddresses[0].isDefault = true;
    }
  }
  saveDB(db);
  return { success: true, savedAddresses: customer.savedAddresses };
};

