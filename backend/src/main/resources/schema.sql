-- Smart Crime Analytics Portal (SCAP)
-- Database Schema Script for MySQL 8.0+

CREATE DATABASE IF NOT EXISTS scap_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE scap_db;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS activity_history;
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS threat_detections;
DROP TABLE IF EXISTS server_logs;
DROP TABLE IF EXISTS device_locations;
DROP TABLE IF EXISTS ip_addresses;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS hotspots;
DROP TABLE IF EXISTS pattern_matches;
DROP TABLE IF EXISTS pattern_alerts;
DROP TABLE IF EXISTS forensic_reports;
DROP TABLE IF EXISTS chain_of_custody;
DROP TABLE IF EXISTS evidence_hashes;
DROP TABLE IF EXISTS evidence;
DROP TABLE IF EXISTS investigation_timelines;
DROP TABLE IF EXISTS investigations;
DROP TABLE IF EXISTS witnesses;
DROP TABLE IF EXISTS victims;
DROP TABLE IF EXISTS crime_record_criminals;
DROP TABLE IF EXISTS criminal_profiles;
DROP TABLE IF EXISTS crime_categories;
DROP TABLE IF EXISTS crime_records;
DROP TABLE IF EXISTS fir_history;
DROP TABLE IF EXISTS firs;
DROP TABLE IF EXISTS officers;
DROP TABLE IF EXISTS police_stations;
DROP TABLE IF EXISTS districts;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- 1. Departments Table
CREATE TABLE departments (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Districts Table
CREATE TABLE districts (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    state VARCHAR(100) NOT NULL,
    total_police_stations INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Police Stations Table
CREATE TABLE police_stations (
    id VARCHAR(36) PRIMARY KEY,
    station_name VARCHAR(150) NOT NULL,
    station_code VARCHAR(50) NOT NULL UNIQUE,
    district_id VARCHAR(36) NOT NULL,
    address TEXT NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_station_district FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Roles Table
CREATE TABLE roles (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Users Table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    badge_number VARCHAR(50) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    department_id VARCHAR(36),
    police_station_id VARCHAR(36),
    avatar_url VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    CONSTRAINT fk_user_station FOREIGN KEY (police_station_id) REFERENCES police_stations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. User Roles Mapping
CREATE TABLE user_roles (
    user_id VARCHAR(36) NOT NULL,
    role_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (user_id, role_id),
    CONSTRAINT fk_ur_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_ur_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Officers Table
CREATE TABLE officers (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE,
    badge_number VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    rank_designation VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(50) NOT NULL,
    department_id VARCHAR(36),
    police_station_id VARCHAR(36),
    active_status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_officer_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_officer_dept FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    CONSTRAINT fk_officer_station FOREIGN KEY (police_station_id) REFERENCES police_stations(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. FIRs Table
CREATE TABLE firs (
    id VARCHAR(36) PRIMARY KEY,
    fir_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    incident_type VARCHAR(100) NOT NULL,
    complainant_name VARCHAR(150) NOT NULL,
    complainant_contact VARCHAR(50) NOT NULL,
    district_id VARCHAR(36) NOT NULL,
    district_name VARCHAR(100) NOT NULL,
    location_details TEXT NOT NULL,
    incident_date_time DATETIME NOT NULL,
    filed_date_time DATETIME NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    status VARCHAR(50) NOT NULL DEFAULT 'FILED',
    description TEXT NOT NULL,
    reporting_officer_id VARCHAR(36) NOT NULL,
    reporting_officer_name VARCHAR(150) NOT NULL,
    assigned_investigator_id VARCHAR(36),
    assigned_investigator_name VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_fir_district FOREIGN KEY (district_id) REFERENCES districts(id),
    CONSTRAINT fk_fir_reporting_officer FOREIGN KEY (reporting_officer_id) REFERENCES users(id),
    CONSTRAINT fk_fir_assigned_investigator FOREIGN KEY (assigned_investigator_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. FIR History Table
CREATE TABLE fir_history (
    id VARCHAR(36) PRIMARY KEY,
    fir_id VARCHAR(36) NOT NULL,
    timestamp DATETIME NOT NULL,
    updated_by VARCHAR(150) NOT NULL,
    changes_summary TEXT NOT NULL,
    status VARCHAR(50) NOT NULL,
    CONSTRAINT fk_fir_hist_fir FOREIGN KEY (fir_id) REFERENCES firs(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Crime Categories Table
CREATE TABLE crime_categories (
    id VARCHAR(36) PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    severity_level VARCHAR(20) NOT NULL DEFAULT 'MODERATE'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Crime Records Table
CREATE TABLE crime_records (
    id VARCHAR(36) PRIMARY KEY,
    case_number VARCHAR(50) NOT NULL UNIQUE,
    fir_id VARCHAR(36) NOT NULL,
    fir_number VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    crime_type VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    location_address TEXT NOT NULL,
    map_coord_x DOUBLE DEFAULT 50.0,
    map_coord_y DOUBLE DEFAULT 50.0,
    date_time_occurred DATETIME NOT NULL,
    description TEXT NOT NULL,
    assigned_investigator_id VARCHAR(36),
    assigned_investigator_name VARCHAR(150),
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    severity VARCHAR(20) NOT NULL DEFAULT 'MODERATE',
    modus_operandi JSON,
    vehicle_details VARCHAR(255),
    suspect_phone_numbers JSON,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_crime_fir FOREIGN KEY (fir_id) REFERENCES firs(id) ON DELETE CASCADE,
    CONSTRAINT fk_crime_investigator FOREIGN KEY (assigned_investigator_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Criminal Profiles Table
CREATE TABLE criminal_profiles (
    id VARCHAR(36) PRIMARY KEY,
    code_name VARCHAR(100) NOT NULL,
    legal_name VARCHAR(150) NOT NULL,
    aliases JSON,
    photo_url VARCHAR(500),
    date_of_birth DATE,
    gender VARCHAR(20),
    height VARCHAR(20),
    build VARCHAR(50),
    scars_or_tattoos JSON,
    threat_level VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    modus_operandi JSON,
    past_convictions JSON,
    known_associates JSON,
    status VARCHAR(30) NOT NULL DEFAULT 'WANTED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Crime Record - Criminal Many-To-Many Join Table
CREATE TABLE crime_record_criminals (
    crime_record_id VARCHAR(36) NOT NULL,
    criminal_profile_id VARCHAR(36) NOT NULL,
    PRIMARY KEY (crime_record_id, criminal_profile_id),
    CONSTRAINT fk_crc_crime FOREIGN KEY (crime_record_id) REFERENCES crime_records(id) ON DELETE CASCADE,
    CONSTRAINT fk_crc_criminal FOREIGN KEY (criminal_profile_id) REFERENCES criminal_profiles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Victims Table
CREATE TABLE victims (
    id VARCHAR(36) PRIMARY KEY,
    case_id VARCHAR(36) NOT NULL,
    name VARCHAR(150) NOT NULL,
    age INT NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    statement TEXT NOT NULL,
    protection_status VARCHAR(30) NOT NULL DEFAULT 'NONE',
    is_confidential BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_victim_case FOREIGN KEY (case_id) REFERENCES crime_records(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. Witnesses Table
CREATE TABLE witnesses (
    id VARCHAR(36) PRIMARY KEY,
    case_id VARCHAR(36) NOT NULL,
    name VARCHAR(150) NOT NULL,
    contact_number VARCHAR(50) NOT NULL,
    statement TEXT NOT NULL,
    credibility_rating VARCHAR(20) NOT NULL DEFAULT 'MODERATE',
    is_protected BOOLEAN NOT NULL DEFAULT FALSE,
    deposition_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_witness_case FOREIGN KEY (case_id) REFERENCES crime_records(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. Evidence Table
CREATE TABLE evidence (
    id VARCHAR(36) PRIMARY KEY,
    case_id VARCHAR(36) NOT NULL,
    case_number VARCHAR(50) NOT NULL,
    evidence_code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    file_size VARCHAR(50) NOT NULL,
    file_format VARCHAR(30) NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    collected_by VARCHAR(150) NOT NULL,
    collection_date DATETIME NOT NULL,
    storage_location VARCHAR(255) NOT NULL,
    is_verified_integrity BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evidence_case FOREIGN KEY (case_id) REFERENCES crime_records(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. Evidence Hash Verification Table
CREATE TABLE evidence_hashes (
    id VARCHAR(36) PRIMARY KEY,
    evidence_id VARCHAR(36) NOT NULL,
    computed_hash VARCHAR(64) NOT NULL,
    expected_hash VARCHAR(64) NOT NULL,
    verification_timestamp DATETIME NOT NULL,
    verified_by VARCHAR(150) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'VALID',
    CONSTRAINT fk_eh_evidence FOREIGN KEY (evidence_id) REFERENCES evidence(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 18. Chain of Custody Table
CREATE TABLE chain_of_custody (
    id VARCHAR(36) PRIMARY KEY,
    evidence_id VARCHAR(36) NOT NULL,
    timestamp DATETIME NOT NULL,
    handled_by VARCHAR(150) NOT NULL,
    badge_number VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    notes TEXT NOT NULL,
    CONSTRAINT fk_coc_evidence FOREIGN KEY (evidence_id) REFERENCES evidence(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 19. Forensic Reports Table
CREATE TABLE forensic_reports (
    id VARCHAR(36) PRIMARY KEY,
    evidence_id VARCHAR(36) NOT NULL,
    case_id VARCHAR(36) NOT NULL,
    report_number VARCHAR(50) NOT NULL UNIQUE,
    examiner_name VARCHAR(150) NOT NULL,
    findings TEXT NOT NULL,
    methodology TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',
    report_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_fr_evidence FOREIGN KEY (evidence_id) REFERENCES evidence(id) ON DELETE CASCADE,
    CONSTRAINT fk_fr_case FOREIGN KEY (case_id) REFERENCES crime_records(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 20. Investigations Table
CREATE TABLE investigations (
    id VARCHAR(36) PRIMARY KEY,
    case_number VARCHAR(50) NOT NULL UNIQUE,
    case_id VARCHAR(36) NOT NULL UNIQUE,
    lead_investigator_id VARCHAR(36) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'UNDER_INVESTIGATION',
    summary TEXT NOT NULL,
    start_date DATETIME NOT NULL,
    target_completion_date DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_inv_case FOREIGN KEY (case_id) REFERENCES crime_records(id) ON DELETE CASCADE,
    CONSTRAINT fk_inv_lead FOREIGN KEY (lead_investigator_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 21. Investigation Timelines Table
CREATE TABLE investigation_timelines (
    id VARCHAR(36) PRIMARY KEY,
    investigation_id VARCHAR(36),
    case_id VARCHAR(36) NOT NULL,
    timestamp DATETIME NOT NULL,
    author_name VARCHAR(150) NOT NULL,
    author_role VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    CONSTRAINT fk_it_case FOREIGN KEY (case_id) REFERENCES crime_records(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 22. Pattern Alerts Table
CREATE TABLE pattern_alerts (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    similarity_score INT NOT NULL,
    matched_factors JSON NOT NULL,
    primary_case_id VARCHAR(36) NOT NULL,
    primary_fir_number VARCHAR(50) NOT NULL,
    related_case_id VARCHAR(36) NOT NULL,
    related_fir_number VARCHAR(50) NOT NULL,
    detection_date DATETIME NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'UNREVIEWED',
    suspect_id VARCHAR(36),
    suspect_alias VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_pa_primary_case FOREIGN KEY (primary_case_id) REFERENCES crime_records(id) ON DELETE CASCADE,
    CONSTRAINT fk_pa_related_case FOREIGN KEY (related_case_id) REFERENCES crime_records(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 23. Pattern Matches Table
CREATE TABLE pattern_matches (
    id VARCHAR(36) PRIMARY KEY,
    pattern_alert_id VARCHAR(36) NOT NULL,
    factor_type VARCHAR(50) NOT NULL,
    factor_value TEXT NOT NULL,
    match_score INT NOT NULL,
    CONSTRAINT fk_pm_alert FOREIGN KEY (pattern_alert_id) REFERENCES pattern_alerts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 24. Hotspots Table
CREATE TABLE hotspots (
    id VARCHAR(36) PRIMARY KEY,
    sector_name VARCHAR(150) NOT NULL,
    sector_code VARCHAR(50) NOT NULL UNIQUE,
    risk_level VARCHAR(20) NOT NULL DEFAULT 'MODERATE',
    total_incidents INT NOT NULL DEFAULT 0,
    primary_crime_type VARCHAR(100) NOT NULL,
    map_coord_x DOUBLE NOT NULL,
    map_coord_y DOUBLE NOT NULL,
    active_patrol_units INT NOT NULL DEFAULT 1,
    district_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hotspot_district FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 25. Locations Table
CREATE TABLE locations (
    id VARCHAR(36) PRIMARY KEY,
    address TEXT NOT NULL,
    district VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20),
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 26. IP Addresses Table
CREATE TABLE ip_addresses (
    id VARCHAR(36) PRIMARY KEY,
    ip_string VARCHAR(50) NOT NULL UNIQUE,
    isp VARCHAR(150),
    organization VARCHAR(150),
    country VARCHAR(100),
    city VARCHAR(100),
    risk_score INT DEFAULT 0,
    is_tor BOOLEAN DEFAULT FALSE,
    is_vpn BOOLEAN DEFAULT FALSE,
    threat_level VARCHAR(20) DEFAULT 'LOW',
    last_activity DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 27. Device Locations Table
CREATE TABLE device_locations (
    id VARCHAR(36) PRIMARY KEY,
    ip_address_id VARCHAR(36),
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    device_type VARCHAR(100),
    mac_address VARCHAR(50),
    serial_number VARCHAR(100),
    CONSTRAINT fk_dl_ip FOREIGN KEY (ip_address_id) REFERENCES ip_addresses(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 28. Server Logs Table
CREATE TABLE server_logs (
    id VARCHAR(36) PRIMARY KEY,
    timestamp DATETIME NOT NULL,
    source_ip VARCHAR(50) NOT NULL,
    request_method VARCHAR(10) NOT NULL,
    request_url TEXT NOT NULL,
    http_status INT NOT NULL,
    user_agent TEXT,
    payload_data TEXT,
    threat_flag VARCHAR(50) DEFAULT 'NORMAL'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 29. Threat Detections Table
CREATE TABLE threat_detections (
    id VARCHAR(36) PRIMARY KEY,
    server_log_id VARCHAR(36),
    source_ip VARCHAR(50) NOT NULL,
    threat_type VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    payload_pattern TEXT,
    detected_timestamp DATETIME NOT NULL,
    status VARCHAR(30) DEFAULT 'NEW',
    CONSTRAINT fk_td_log FOREIGN KEY (server_log_id) REFERENCES server_logs(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 30. Notifications Table
CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    recipient_user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(30) NOT NULL DEFAULT 'INFO',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    timestamp DATETIME NOT NULL,
    reference_url VARCHAR(255),
    CONSTRAINT fk_notif_user FOREIGN KEY (recipient_user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 31. Reports Table
CREATE TABLE reports (
    id VARCHAR(36) PRIMARY KEY,
    report_number VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    report_type VARCHAR(50) NOT NULL,
    generated_by VARCHAR(150) NOT NULL,
    generated_date DATETIME NOT NULL,
    date_range_start DATETIME,
    date_range_end DATETIME,
    file_format VARCHAR(20) NOT NULL DEFAULT 'PDF',
    file_url VARCHAR(500),
    summary_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 32. Audit Logs Table
CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    timestamp VARCHAR(30) NOT NULL,
    badge_number VARCHAR(50) NOT NULL,
    user_name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    details TEXT NOT NULL,
    ip_address VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 33. Activity History Table
CREATE TABLE activity_history (
    id VARCHAR(36) PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(36) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    timestamp DATETIME NOT NULL,
    performed_by VARCHAR(150) NOT NULL,
    notes TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Indexes for performance & quick queries
CREATE INDEX idx_fir_status ON firs(status);
CREATE INDEX idx_fir_district ON firs(district_id);
CREATE INDEX idx_crime_status ON crime_records(status);
CREATE INDEX idx_crime_type ON crime_records(crime_type);
CREATE INDEX idx_evidence_case ON evidence(case_id);
CREATE INDEX idx_evidence_hash ON evidence(sha256_hash);
CREATE INDEX idx_audit_badge ON audit_logs(badge_number);
CREATE INDEX idx_audit_module ON audit_logs(module);
