-- ==============================================================================
-- Smart Crime Analytics Portal (SCAP) - Complete Supabase PostgreSQL Schema
-- Project: smart-crime-analytics
-- Database: PostgreSQL 15+ / Supabase
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(255) PRIMARY KEY,
    badge_number VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'POLICE_OFFICER', 'INVESTIGATOR', 'FORENSIC_OFFICER')),
    department VARCHAR(255) DEFAULT 'Metropolitan Law Enforcement',
    avatar_url TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED')),
    last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. FIRST INFORMATION REPORTS (FIRs) TABLE
CREATE TABLE IF NOT EXISTS public.firs (
    id VARCHAR(255) PRIMARY KEY,
    fir_number VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    incident_type VARCHAR(100) NOT NULL,
    complainant_name VARCHAR(255) NOT NULL,
    complainant_contact VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    location_details TEXT,
    incident_date_time VARCHAR(100) NOT NULL,
    filed_date_time VARCHAR(100) NOT NULL,
    priority VARCHAR(50) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    status VARCHAR(50) DEFAULT 'FILED' CHECK (status IN ('DRAFT', 'FILED', 'UNDER_REVIEW', 'TRANSFERRED_TO_INVESTIGATION', 'CLOSED')),
    description TEXT,
    reporting_officer_id VARCHAR(255) REFERENCES public.users(id) ON DELETE SET NULL,
    reporting_officer_name VARCHAR(255),
    assigned_investigator_id VARCHAR(255) REFERENCES public.users(id) ON DELETE SET NULL,
    assigned_investigator_name VARCHAR(255),
    history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CRIME RECORDS (MASTER CASE DOSSIERS) TABLE
CREATE TABLE IF NOT EXISTS public.crime_records (
    id VARCHAR(255) PRIMARY KEY,
    case_number VARCHAR(100) UNIQUE NOT NULL,
    fir_id VARCHAR(255) REFERENCES public.firs(id) ON DELETE SET NULL,
    fir_number VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    crime_type VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    location_address TEXT,
    coordinates JSONB DEFAULT '{"x": 50, "y": 50}'::jsonb,
    date_time_occurred VARCHAR(100) NOT NULL,
    description TEXT,
    assigned_investigator_id VARCHAR(255) REFERENCES public.users(id) ON DELETE SET NULL,
    assigned_investigator_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'UNDER_INVESTIGATION', 'SOLVED', 'CLOSED')),
    severity VARCHAR(50) DEFAULT 'MODERATE' CHECK (severity IN ('MINOR', 'MODERATE', 'SEVERE', 'CRITICAL')),
    modus_operandi TEXT[] DEFAULT '{}',
    vehicle_details TEXT,
    suspect_phone_numbers TEXT[] DEFAULT '{}',
    ip_address VARCHAR(100),
    linked_criminal_ids TEXT[] DEFAULT '{}',
    evidence_ids TEXT[] DEFAULT '{}',
    victim_ids TEXT[] DEFAULT '{}',
    witness_ids TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CRIMINAL PROFILES (SUSPECT REGISTRY) TABLE
CREATE TABLE IF NOT EXISTS public.criminal_profiles (
    id VARCHAR(255) PRIMARY KEY,
    code_name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255) NOT NULL,
    aliases TEXT[] DEFAULT '{}',
    photo_url TEXT,
    date_of_birth VARCHAR(50) DEFAULT '1990-01-01',
    gender VARCHAR(50) DEFAULT 'Male',
    height VARCHAR(50) DEFAULT '6 ft 0 in',
    build VARCHAR(50) DEFAULT 'Medium',
    scars_or_tattoos TEXT[] DEFAULT '{}',
    threat_level VARCHAR(50) DEFAULT 'HIGH' CHECK (threat_level IN ('LOW', 'MEDIUM', 'HIGH', 'EXTREME')),
    modus_operandi TEXT[] DEFAULT '{}',
    past_convictions TEXT[] DEFAULT '{}',
    known_associates TEXT[] DEFAULT '{}',
    status VARCHAR(50) DEFAULT 'WANTED' CHECK (status IN ('WANTED', 'IN_CUSTODY', 'UNDER_SURVEILLANCE', 'CLEARED')),
    linked_case_ids TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. EVIDENCE ITEMS (SHA-256 VAULT) TABLE
CREATE TABLE IF NOT EXISTS public.evidence_items (
    id VARCHAR(255) PRIMARY KEY,
    case_id VARCHAR(255) REFERENCES public.crime_records(id) ON DELETE CASCADE,
    case_number VARCHAR(100),
    evidence_code VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('CCTV_VIDEO', 'FINGERPRINT', 'DIGITAL_FORENSIC', 'AUDIO_RECORDING', 'WEAPON_LOG', 'DOCUMENT')),
    file_size VARCHAR(50) DEFAULT '1 MB',
    file_format VARCHAR(50) DEFAULT 'PDF',
    sha256_hash VARCHAR(64) NOT NULL,
    collected_by VARCHAR(255) NOT NULL,
    collection_date VARCHAR(100) NOT NULL,
    storage_location TEXT,
    is_verified_integrity BOOLEAN DEFAULT TRUE,
    custody_chain JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. VICTIMS TABLE
CREATE TABLE IF NOT EXISTS public.victims (
    id VARCHAR(255) PRIMARY KEY,
    case_id VARCHAR(255) REFERENCES public.crime_records(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    age INTEGER DEFAULT 30,
    contact_number VARCHAR(100),
    address TEXT,
    statement TEXT,
    protection_status VARCHAR(50) DEFAULT 'NONE' CHECK (protection_status IN ('NONE', 'REQUESTED', 'ACTIVE_PROTECTION')),
    is_confidential BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. WITNESSES TABLE
CREATE TABLE IF NOT EXISTS public.witnesses (
    id VARCHAR(255) PRIMARY KEY,
    case_id VARCHAR(255) REFERENCES public.crime_records(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact_number VARCHAR(100),
    statement TEXT,
    credibility_rating VARCHAR(50) DEFAULT 'HIGH' CHECK (credibility_rating IN ('HIGH', 'MODERATE', 'LOW')),
    is_protected BOOLEAN DEFAULT FALSE,
    deposition_date VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. INVESTIGATION NOTES (CASE DIARY) TABLE
CREATE TABLE IF NOT EXISTS public.investigation_notes (
    id VARCHAR(255) PRIMARY KEY,
    case_id VARCHAR(255) REFERENCES public.crime_records(id) ON DELETE CASCADE,
    timestamp VARCHAR(100) NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    author_role VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('LEAD', 'INTERROGATION', 'FORENSIC_UPDATE', 'SURVEILLANCE', 'CASE_DECISION')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. PATTERN ALERTS (AI DETECTIONS) TABLE
CREATE TABLE IF NOT EXISTS public.pattern_alerts (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    similarity_score INTEGER DEFAULT 80 CHECK (similarity_score BETWEEN 0 AND 100),
    matched_factors TEXT[] DEFAULT '{}',
    primary_case_id VARCHAR(255),
    primary_fir_number VARCHAR(100),
    related_case_id VARCHAR(255),
    related_fir_number VARCHAR(100),
    detection_date VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'UNREVIEWED' CHECK (status IN ('UNREVIEWED', 'CONFIRMED', 'DISMISSED')),
    suspect_id VARCHAR(255),
    suspect_alias VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. AUDIT LOGS (SECURITY TRAIL) TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id VARCHAR(255) PRIMARY KEY,
    timestamp VARCHAR(100) NOT NULL,
    badge_number VARCHAR(100) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    details TEXT,
    ip_address VARCHAR(100) DEFAULT '127.0.0.1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. HOTSPOT SECTORS (GIS MUNICIPAL GRID) TABLE
CREATE TABLE IF NOT EXISTS public.hotspot_sectors (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    risk_level VARCHAR(50) DEFAULT 'MODERATE' CHECK (risk_level IN ('LOW', 'MODERATE', 'HIGH', 'CRITICAL')),
    total_incidents INTEGER DEFAULT 0,
    primary_crime_type VARCHAR(255),
    coord_x FLOAT DEFAULT 50.0,
    coord_y FLOAT DEFAULT 50.0,
    active_patrol_units INTEGER DEFAULT 4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR OPTIMAL QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_firs_fir_number ON public.firs(fir_number);
CREATE INDEX IF NOT EXISTS idx_firs_status ON public.firs(status);
CREATE INDEX IF NOT EXISTS idx_crime_records_case_number ON public.crime_records(case_number);
CREATE INDEX IF NOT EXISTS idx_crime_records_status ON public.crime_records(status);
CREATE INDEX IF NOT EXISTS idx_crime_records_district ON public.crime_records(district);
CREATE INDEX IF NOT EXISTS idx_criminal_profiles_threat ON public.criminal_profiles(threat_level);
CREATE INDEX IF NOT EXISTS idx_evidence_case_id ON public.evidence_items(case_id);
CREATE INDEX IF NOT EXISTS idx_evidence_sha256 ON public.evidence_items(sha256_hash);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.firs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crime_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.criminal_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.victims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.witnesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investigation_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pattern_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotspot_sectors ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 12. ROLE-BASED ACCESS CONTROL (RBAC) & ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Helper function to retrieve the active user's role from public.users table or JWT claims
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text AS $$
DECLARE
  v_role text;
BEGIN
  -- 1. Check custom claim from JWT if available
  v_role := current_setting('request.jwt.claim.role', true);
  IF v_role IS NOT NULL AND v_role <> '' THEN
    RETURN v_role;
  END IF;

  -- 2. Check user record by auth uid or app context
  SELECT role INTO v_role
  FROM public.users
  WHERE id = auth.uid()::text OR email = current_setting('request.jwt.claim.email', true)
  LIMIT 1;

  RETURN COALESCE(v_role, 'POLICE');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- Table-by-Table RBAC RLS Policies
-- ------------------------------------------------------------------------------

-- 1. USERS & ROSTER
-- Admins can manage all users. Non-admin officers can only read the user roster.
CREATE POLICY "Users: Admin full management" ON public.users
  FOR ALL TO authenticated
  USING (public.get_current_user_role() = 'ADMIN');

CREATE POLICY "Users: Read-only for authenticated officers" ON public.users
  FOR SELECT TO authenticated
  USING (true);

-- 2. FIRS (First Information Reports)
-- Admins, Investigators, Police, Analysts can view FIRs. Police/Investigators can file FIRs.
CREATE POLICY "FIRs: Read access for permitted roles" ON public.firs
  FOR SELECT TO authenticated
  USING (public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR', 'POLICE', 'POLICE_OFFICER', 'ANALYST'));

CREATE POLICY "FIRs: Filing by Police and Investigators" ON public.firs
  FOR INSERT TO authenticated
  WITH CHECK (public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR', 'POLICE', 'POLICE_OFFICER'));

CREATE POLICY "FIRs: Status updates by Investigators and Admins" ON public.firs
  FOR UPDATE TO authenticated
  USING (public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR'));

-- 3. CRIME RECORDS
-- All operational roles can view crime records. Investigators & Police can register records.
CREATE POLICY "CrimeRecords: Read access" ON public.crime_records
  FOR SELECT TO authenticated
  USING (public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR', 'POLICE', 'POLICE_OFFICER', 'FORENSICS', 'FORENSIC_OFFICER', 'ANALYST'));

CREATE POLICY "CrimeRecords: Creation by authorized officers" ON public.crime_records
  FOR INSERT TO authenticated
  WITH CHECK (public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR', 'POLICE', 'POLICE_OFFICER'));

CREATE POLICY "CrimeRecords: Modification by Investigators and Admins" ON public.crime_records
  FOR UPDATE TO authenticated
  USING (public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR'));

-- 4. CRIMINAL / SUSPECT PROFILES
-- Restricted: Only Admins and Investigators can access suspect dossiers. Police/Forensics/Analysts blocked.
CREATE POLICY "Criminals: Read access for Investigators and Admins" ON public.criminal_profiles
  FOR SELECT TO authenticated
  USING (public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR'));

CREATE POLICY "Criminals: Management for Investigators and Admins" ON public.criminal_profiles
  FOR INSERT TO authenticated
  WITH CHECK (public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR'));

CREATE POLICY "Criminals: Update for Investigators and Admins" ON public.criminal_profiles
  FOR UPDATE TO authenticated
  USING (public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR'));

CREATE POLICY "Criminals: Delete only by System Admins" ON public.criminal_profiles
  FOR DELETE TO authenticated
  USING (public.get_current_user_role() = 'ADMIN');

-- 5. EVIDENCE ITEMS & FORENSIC LAB
-- Forensics, Investigators, and Admins can view. Forensics and Admins can create and log custody.
CREATE POLICY "Evidence: Read access" ON public.evidence_items
  FOR SELECT TO authenticated
  USING (public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR', 'FORENSICS', 'FORENSIC_OFFICER'));

CREATE POLICY "Evidence: Upload by Forensics Lab" ON public.evidence_items
  FOR INSERT TO authenticated
  WITH CHECK (public.get_current_user_role() IN ('ADMIN', 'FORENSICS', 'FORENSIC_OFFICER'));

CREATE POLICY "Evidence: Custody chain updates by Forensics" ON public.evidence_items
  FOR UPDATE TO authenticated
  USING (public.get_current_user_role() IN ('ADMIN', 'FORENSICS', 'FORENSIC_OFFICER'));

-- 6. VICTIMS & WITNESSES
CREATE POLICY "Victims: Read access" ON public.victims
  FOR SELECT TO authenticated
  USING (public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR', 'POLICE', 'POLICE_OFFICER'));

CREATE POLICY "Victims: Log new victim statement" ON public.victims
  FOR INSERT TO authenticated
  WITH CHECK (public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR', 'POLICE', 'POLICE_OFFICER'));

CREATE POLICY "Witnesses: Read access" ON public.witnesses
  FOR SELECT TO authenticated
  USING (public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR', 'POLICE', 'POLICE_OFFICER'));

CREATE POLICY "Witnesses: Log new deposition" ON public.witnesses
  FOR INSERT TO authenticated
  WITH CHECK (public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR', 'POLICE', 'POLICE_OFFICER'));

-- 7. INVESTIGATION NOTES & CASE DIARY
CREATE POLICY "Notes: Read access" ON public.investigation_notes
  FOR SELECT TO authenticated
  USING (public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR'));

CREATE POLICY "Notes: Create entry" ON public.investigation_notes
  FOR INSERT TO authenticated
  WITH CHECK (public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR'));

-- 8. PATTERN DETECTION ALERTS
CREATE POLICY "PatternAlerts: Read access" ON public.pattern_alerts
  FOR SELECT TO authenticated
  USING (public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR', 'ANALYST'));

CREATE POLICY "PatternAlerts: Confirm/Dismiss by Investigators" ON public.pattern_alerts
  FOR UPDATE TO authenticated
  USING (public.get_current_user_role() IN ('ADMIN', 'INVESTIGATOR'));

-- 9. AUDIT LOGS
-- Strict: Only Admins can view security audit logs.
CREATE POLICY "AuditLogs: Admin only read" ON public.audit_logs
  FOR SELECT TO authenticated
  USING (public.get_current_user_role() = 'ADMIN');

CREATE POLICY "AuditLogs: System append only" ON public.audit_logs
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- 10. HOTSPOT SECTORS & GIS RADAR
CREATE POLICY "Hotspots: Read access for all operational roles" ON public.hotspot_sectors
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Hotspots: Modify by Admins only" ON public.hotspot_sectors
  FOR ALL TO authenticated
  USING (public.get_current_user_role() = 'ADMIN');

