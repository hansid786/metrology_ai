-- ==============================================================================
-- METROLOGYLENS AI — CENTRAL STATUTORY DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- Enforcing Legal Metrology (Packaged Commodities) Rules, 2011 & FSSAI Standards
-- ==============================================================================

-- 1. INSPECTIONS TABLE
CREATE TABLE IF NOT EXISTS inspections (
  id VARCHAR(64) PRIMARY KEY,
  inspection_id VARCHAR(64) UNIQUE NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  establishment_name TEXT,
  establishment_address TEXT,
  product_name TEXT NOT NULL,
  brand_name TEXT,
  product_category VARCHAR(32) DEFAULT 'FOOD',
  mrp_amount NUMERIC(10, 2),
  net_quantity_value NUMERIC(10, 3),
  net_quantity_unit VARCHAR(16),
  printed_usp_amount NUMERIC(10, 3),
  calculated_usp_amount NUMERIC(10, 3),
  usp_discrepancy BOOLEAN DEFAULT FALSE,
  usp_discrepancy_type VARCHAR(32) DEFAULT 'NONE',
  overall_status VARCHAR(32) NOT NULL,
  compliance_percentage INT DEFAULT 0,
  verified_count INT DEFAULT 0,
  total_count INT DEFAULT 0,
  manufacturer_name TEXT,
  manufacturer_pin VARCHAR(10),
  fssai_license VARCHAR(32),
  country_of_origin VARCHAR(32) DEFAULT 'INDIA',
  ingredients_declared BOOLEAN DEFAULT FALSE,
  raw_ocr_text TEXT,
  health_safety_score INT DEFAULT 100,
  inspector_id VARCHAR(64),
  inspector_name VARCHAR(128),
  inspector_jurisdiction TEXT,
  full_result_json JSONB,
  audit_trail JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CONSUMER COMPLAINTS / CITIZEN GRIEVANCES TABLE
CREATE TABLE IF NOT EXISTS consumer_complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number VARCHAR(64) UNIQUE NOT NULL,
  consumer_name VARCHAR(128),
  consumer_phone VARCHAR(20),
  consumer_email VARCHAR(128),
  product_name TEXT NOT NULL,
  retailer_name TEXT NOT NULL,
  retailer_location TEXT NOT NULL,
  violation_type VARCHAR(64) NOT NULL,
  printed_mrp NUMERIC(10, 2),
  charged_mrp NUMERIC(10, 2),
  evidence_image_url TEXT,
  status VARCHAR(32) DEFAULT 'SUBMITTED',
  assigned_officer_id VARCHAR(64),
  investigation_notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- 3. REPEAT OFFENDERS & STATUTORY VIOLATION TRACKER
CREATE TABLE IF NOT EXISTS repeat_offenders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manufacturer_name TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  fssai_license VARCHAR(32),
  total_violations_count INT DEFAULT 1,
  last_violation_date TIMESTAMPTZ DEFAULT NOW(),
  violation_types TEXT[],
  penalty_notices_issued INT DEFAULT 0,
  status VARCHAR(32) DEFAULT 'FLAGGED'
);

-- 4. GS1 PRODUCT MASTER REGISTRY
CREATE TABLE IF NOT EXISTS product_master_registry (
  barcode VARCHAR(32) PRIMARY KEY,
  commodity_name TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  category VARCHAR(32) NOT NULL,
  official_mrp NUMERIC(10, 2) NOT NULL,
  net_quantity TEXT NOT NULL,
  standard_unit VARCHAR(16) NOT NULL,
  fssai_license VARCHAR(32),
  manufacturer_entity TEXT NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_inspections_status ON inspections(overall_status);
CREATE INDEX IF NOT EXISTS idx_inspections_category ON inspections(product_category);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON consumer_complaints(status);
CREATE INDEX IF NOT EXISTS idx_offenders_mfg ON repeat_offenders(manufacturer_name);
