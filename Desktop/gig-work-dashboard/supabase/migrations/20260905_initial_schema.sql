-- ==============================================================================
-- HYPERLOCAL SERVICES MARKETPLACE PRODUCTION DATABASE SCHEMA
-- Compatible with PostgreSQL 15+ & Supabase
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & CORE AUTHENTICATION
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(30) UNIQUE,
    password_hash VARCHAR(255),
    role VARCHAR(20) NOT NULL CHECK (role IN ('customer', 'worker', 'admin')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending_verification')),
    full_name VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CUSTOMER PROFILES
CREATE TABLE IF NOT EXISTS public.customer_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    emergency_contact VARCHAR(30),
    preferred_language VARCHAR(50) DEFAULT 'English',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. WORKER PROFILES
CREATE TABLE IF NOT EXISTS public.worker_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    trade VARCHAR(100) NOT NULL,
    specialty TEXT,
    experience_years INT NOT NULL DEFAULT 1,
    bio TEXT,
    base_rate DECIMAL(10, 2) NOT NULL DEFAULT 249.00,
    rate_unit VARCHAR(50) NOT NULL DEFAULT 'visit',
    is_available_now BOOLEAN NOT NULL DEFAULT true,
    service_radius_km INT NOT NULL DEFAULT 10,
    city VARCHAR(100) NOT NULL DEFAULT 'Bengaluru',
    locality VARCHAR(150) NOT NULL DEFAULT 'Koramangala',
    location_lat DECIMAL(10, 7),
    location_lng DECIMAL(10, 7),
    address TEXT,
    rating_avg DECIMAL(3, 2) NOT NULL DEFAULT 5.00,
    reviews_count INT NOT NULL DEFAULT 0,
    completed_jobs_count INT NOT NULL DEFAULT 0,
    response_rate_pct INT NOT NULL DEFAULT 98,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'not_started' 
        CHECK (verification_status IN ('not_started', 'pending', 'verified', 'rejected', 'requires_action')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SERVICE CATEGORIES & SERVICES CATALOG
CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    icon_name VARCHAR(50) NOT NULL DEFAULT 'Wrench',
    badge VARCHAR(50),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    description TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    estimated_duration VARCHAR(50) NOT NULL DEFAULT '45 mins',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. WORKER OFFERED SERVICES
CREATE TABLE IF NOT EXISTS public.worker_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    custom_price DECIMAL(10, 2),
    is_offered BOOLEAN DEFAULT true,
    UNIQUE(worker_id, service_id)
);

-- 6. WORKER VERIFICATIONS & KYC
CREATE TABLE IF NOT EXISTS public.worker_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id UUID NOT NULL REFERENCES public.worker_profiles(id) ON DELETE CASCADE,
    id_type VARCHAR(50) NOT NULL, -- 'Aadhaar', 'Voter ID', 'Driving License', 'Passport'
    id_document_url TEXT NOT NULL,
    selfie_url TEXT NOT NULL,
    trade_certificate_url TEXT,
    police_verification_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    reviewer_id UUID REFERENCES public.users(id),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected', 'requires_action')),
    rejection_reason TEXT,
    admin_notes TEXT
);

-- 7. ADDRESSES
CREATE TABLE IF NOT EXISTS public.addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    label VARCHAR(50) NOT NULL DEFAULT 'Home', -- 'Home', 'Office', 'Other'
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    landmark TEXT,
    locality VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL DEFAULT 'Karnataka',
    postal_code VARCHAR(20) NOT NULL,
    lat DECIMAL(10, 7),
    lng DECIMAL(10, 7),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. BOOKINGS & DISPATCH LIFECYCLE
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_ref VARCHAR(30) NOT NULL UNIQUE,
    customer_id UUID NOT NULL REFERENCES public.users(id),
    worker_id UUID NOT NULL REFERENCES public.worker_profiles(id),
    service_id UUID REFERENCES public.services(id),
    service_title VARCHAR(200) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'requested'
        CHECK (status IN ('requested', 'accepted', 'rejected', 'scheduled', 'on_the_way', 'started', 'completed', 'cancelled', 'disputed')),
    scheduled_date VARCHAR(50) NOT NULL,
    scheduled_slot VARCHAR(50) NOT NULL,
    address_text TEXT NOT NULL,
    problem_description TEXT,
    attachment_urls TEXT[],
    estimated_amount DECIMAL(10, 2) NOT NULL,
    final_amount DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL DEFAULT 10.00,
    welfare_fee DECIMAL(10, 2) NOT NULL DEFAULT 10.00,
    worker_payout DECIMAL(10, 2) NOT NULL,
    payment_mode VARCHAR(50) NOT NULL DEFAULT 'Direct UPI upon Completion',
    payment_status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (payment_status IN ('pending', 'escrowed', 'released', 'refunded', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. BOOKING STATUS AUDIT HISTORY
CREATE TABLE IF NOT EXISTS public.booking_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL,
    note TEXT,
    changed_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. PAYMENTS & SETTLEMENTS
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.users(id),
    worker_id UUID NOT NULL REFERENCES public.worker_profiles(id),
    amount DECIMAL(10, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL,
    worker_amount DECIMAL(10, 2) NOT NULL,
    gateway VARCHAR(50) NOT NULL DEFAULT 'razorpay',
    gateway_order_id VARCHAR(100),
    gateway_payment_id VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'successful' CHECK (status IN ('initiated', 'successful', 'failed', 'refunded')),
    payment_method VARCHAR(50) NOT NULL DEFAULT 'UPI',
    utr_number VARCHAR(100),
    paid_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. TWO-WAY RATINGS & REVIEWS
CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES public.users(id),
    reviewee_id UUID NOT NULL REFERENCES public.users(id),
    reviewer_type VARCHAR(20) NOT NULL CHECK (reviewer_type IN ('customer', 'worker')),
    rating_overall DECIMAL(2, 1) NOT NULL CHECK (rating_overall >= 1 AND rating_overall <= 5),
    rating_sub1 DECIMAL(2, 1), -- Quality / Behavior
    rating_sub2 DECIMAL(2, 1), -- Punctuality / Communication
    rating_sub3 DECIMAL(2, 1), -- Professionalism / Payment Experience
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(booking_id, reviewer_type)
);

-- 12. IN-APP MESSAGES (BOOKING-LINKED CHAT)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.users(id),
    recipient_id UUID NOT NULL REFERENCES public.users(id),
    message_text TEXT NOT NULL,
    attachment_url TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'general',
    entity_type VARCHAR(50),
    entity_id VARCHAR(100),
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. DISPUTES
CREATE TABLE IF NOT EXISTS public.disputes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    raised_by UUID NOT NULL REFERENCES public.users(id),
    reason VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'under_review', 'resolved', 'dismissed')),
    resolution_notes TEXT,
    resolved_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- 15. ADMIN ACTIONS AUDIT LOG
CREATE TABLE IF NOT EXISTS public.admin_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES public.users(id),
    action_type VARCHAR(100) NOT NULL,
    target_entity VARCHAR(50) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CREATE INDEXES FOR OPTIMAL QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_worker_trade ON public.worker_profiles(trade);
CREATE INDEX IF NOT EXISTS idx_worker_avail ON public.worker_profiles(is_available_now);
CREATE INDEX IF NOT EXISTS idx_worker_city_loc ON public.worker_profiles(city, locality);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_worker ON public.bookings(worker_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_messages_booking ON public.messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, is_read);
