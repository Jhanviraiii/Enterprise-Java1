-- Smart Crime Analytics Portal (SCAP)
-- Master Seed Data Script for MySQL 8.0+

USE scap_db;

-- 1. Departments
INSERT INTO departments (id, code, name, description) VALUES
('dept-1', 'DEP-CMD', 'Command & Operations Division', 'High-level strategic administration and tactical command.'),
('dept-2', 'DEP-PATROL', 'Central District Patrol Unit', 'Active street patrol, immediate response, and public safety.'),
('dept-3', 'DEP-CRIME', 'Major Crimes & Homicide Bureau', 'Complex felony investigation, homicide, and organized syndicate tracking.'),
('dept-4', 'DEP-LAB', 'Digital Forensics & Ballistics Lab', 'Cyber analysis, DNA sequencing, ballistic testing, and cryptographic verification.');

-- 2. Districts
INSERT INTO districts (id, name, state, total_police_stations) VALUES
('dist-1', 'Downtown Core', 'Metro State', 6),
('dist-2', 'Tech District', 'Metro State', 4),
('dist-3', 'Harbor Bay', 'Metro State', 5),
('dist-4', 'Industrial Park', 'Metro State', 3),
('dist-5', 'Westside Heights', 'Metro State', 4);

-- 3. Police Stations
INSERT INTO police_stations (id, station_name, station_code, district_id, address, contact_phone) VALUES
('ps-1', 'Central Command HQ Station', 'PS-CENTRAL-01', 'dist-1', '100 Justice Boulevard, Downtown Core', '+1 (555) 019-2000'),
('ps-2', 'Cyber Cybernetics Substation', 'PS-TECH-04', 'dist-2', '88 Innovation Way, Tech District', '+1 (555) 019-3000'),
('ps-3', 'Harbor Docks Precinct', 'PS-HARBOR-02', 'dist-3', '40 Pier Road, Harbor Bay', '+1 (555) 019-4000');

-- 4. Roles
INSERT INTO roles (id, name, description) VALUES
('role-admin', 'ADMIN', 'Full system access and security administration'),
('role-officer', 'POLICE_OFFICER', 'First responder and FIR filing access'),
('role-investigator', 'INVESTIGATOR', 'Case lead, dossier management, and suspect linking'),
('role-forensic', 'FORENSIC_OFFICER', 'Evidence custodian and lab report generation');

-- 5. Users
INSERT INTO users (id, badge_number, username, name, email, password_hash, department_id, police_station_id, avatar_url, status) VALUES
('user-admin', 'BADGE-1001', 'admin.vance', 'Director Marcus Vance', 'admin.vance@scap.gov', '$2a$10$7R3v8Gf9v8Qv8Qv8Qv8Qv.Xv8Qv8Qv8Qv8Qv8Qv8Qv8Qv8Qv8Qv8Q', 'dept-1', 'ps-1', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'ACTIVE'),
('user-officer', 'BADGE-4420', 's.jenkins', 'Officer Sarah Jenkins', 's.jenkins@metropolice.gov', '$2a$10$7R3v8Gf9v8Qv8Qv8Qv8Qv.Xv8Qv8Qv8Qv8Qv8Qv8Qv8Qv8Qv8Qv8Q', 'dept-2', 'ps-1', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'ACTIVE'),
('user-investigator', 'BADGE-7809', 'r.cooper', 'Det. Raymond Cooper', 'r.cooper@detective.gov', '$2a$10$7R3v8Gf9v8Qv8Qv8Qv8Qv.Xv8Qv8Qv8Qv8Qv8Qv8Qv8Qv8Qv8Qv8Q', 'dept-3', 'ps-1', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'ACTIVE'),
('user-forensic', 'BADGE-9912', 'a.thorne', 'Dr. Aris Thorne', 'a.thorne@forensics.gov', '$2a$10$7R3v8Gf9v8Qv8Qv8Qv8Qv.Xv8Qv8Qv8Qv8Qv8Qv8Qv8Qv8Qv8Qv8Q', 'dept-4', 'ps-2', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'ACTIVE');

-- 6. User Roles Mapping
INSERT INTO user_roles (user_id, role_id) VALUES
('user-admin', 'role-admin'),
('user-officer', 'role-officer'),
('user-investigator', 'role-investigator'),
('user-forensic', 'role-forensic');

-- 7. Officers (15 Officers)
INSERT INTO officers (id, user_id, badge_number, name, rank_designation, email, phone, role, department_id, police_station_id, active_status) VALUES
('off-1', 'user-admin', 'BADGE-1001', 'Director Marcus Vance', 'Director General', 'admin.vance@scap.gov', '+1 555-0100', 'ADMIN', 'dept-1', 'ps-1', 'ACTIVE'),
('off-2', 'user-officer', 'BADGE-4420', 'Officer Sarah Jenkins', 'Senior Patrol Officer', 's.jenkins@metropolice.gov', '+1 555-0101', 'POLICE_OFFICER', 'dept-2', 'ps-1', 'ACTIVE'),
('off-3', 'user-investigator', 'BADGE-7809', 'Det. Raymond Cooper', 'Lead Detective', 'r.cooper@detective.gov', '+1 555-0102', 'INVESTIGATOR', 'dept-3', 'ps-1', 'ACTIVE'),
('off-4', 'user-forensic', 'BADGE-9912', 'Dr. Aris Thorne', 'Chief Forensic Scientist', 'a.thorne@forensics.gov', '+1 555-0103', 'FORENSIC_OFFICER', 'dept-4', 'ps-2', 'ACTIVE'),
('off-5', NULL, 'BADGE-2021', 'Officer Rajesh Sharma', 'Patrol Officer', 'r.sharma@metropolice.gov', '+1 555-0104', 'POLICE_OFFICER', 'dept-2', 'ps-1', 'ACTIVE'),
('off-6', NULL, 'BADGE-2022', 'Officer Vikram Patel', 'Patrol Officer', 'v.patel@metropolice.gov', '+1 555-0105', 'POLICE_OFFICER', 'dept-2', 'ps-1', 'ACTIVE'),
('off-7', NULL, 'BADGE-2023', 'Officer Priya Sundaram', 'Patrol Specialist', 'p.sundaram@metropolice.gov', '+1 555-0106', 'POLICE_OFFICER', 'dept-2', 'ps-3', 'ACTIVE'),
('off-8', NULL, 'BADGE-2024', 'Officer Amit Deshmukh', 'Sub-Inspector', 'a.deshmukh@metropolice.gov', '+1 555-0107', 'POLICE_OFFICER', 'dept-2', 'ps-1', 'ACTIVE'),
('off-9', NULL, 'BADGE-2025', 'Officer Sneha Menon', 'Patrol Officer', 's.menon@metropolice.gov', '+1 555-0108', 'POLICE_OFFICER', 'dept-2', 'ps-2', 'ACTIVE'),
('off-10', NULL, 'BADGE-2026', 'Officer Arjun Kulkarni', 'Patrol Officer', 'a.kulkarni@metropolice.gov', '+1 555-0109', 'POLICE_OFFICER', 'dept-2', 'ps-1', 'ACTIVE'),
('off-11', NULL, 'BADGE-3011', 'Det. Neha Gupta', 'Cyber Crime Investigator', 'n.gupta@detective.gov', '+1 555-0110', 'INVESTIGATOR', 'dept-3', 'ps-2', 'ACTIVE'),
('off-12', NULL, 'BADGE-3012', 'Det. Kabir Singh', 'Homicide Investigator', 'k.singh@detective.gov', '+1 555-0111', 'INVESTIGATOR', 'dept-3', 'ps-1', 'ACTIVE'),
('off-13', NULL, 'BADGE-3013', 'Det. Ananya Roy', 'Financial Fraud Specialist', 'a.roy@detective.gov', '+1 555-0112', 'INVESTIGATOR', 'dept-3', 'ps-1', 'ACTIVE'),
('off-14', NULL, 'BADGE-4011', 'Dr. Meera Nambiar', 'Ballistics Analyst', 'm.nambiar@forensics.gov', '+1 555-0113', 'FORENSIC_OFFICER', 'dept-4', 'ps-2', 'ACTIVE'),
('off-15', NULL, 'BADGE-4012', 'Dr. Rohan Verma', 'DNA Analyst', 'r.verma@forensics.gov', '+1 555-0114', 'FORENSIC_OFFICER', 'dept-4', 'ps-2', 'ACTIVE');

-- 8. FIRs (15 FIR Records)
INSERT INTO firs (id, fir_number, title, incident_type, complainant_name, complainantContact, district_id, district_name, location_details, incident_date_time, filed_date_time, priority, status, description, reporting_officer_id, reporting_officer_name, assigned_investigator_id, assigned_investigator_name) VALUES
('fir-1', 'FIR-2026-08942', 'Armed Robbery at First National Vault', 'Armed Robbery', 'Victor Sterling', '+1 (555) 234-8901', 'dist-1', 'Downtown Core', '742 Financial Ave, Sector 4', '2026-07-28 14:15:00', '2026-07-28 15:30:00', 'CRITICAL', 'TRANSFERRED_TO_INVESTIGATION', 'Three masked individuals entered bank vault with silenced submachine guns. Stole $1.4M in cash.', 'user-officer', 'Officer Sarah Jenkins', 'user-investigator', 'Det. Raymond Cooper'),
('fir-2', 'FIR-2026-08103', 'Cyber Extortion at BioTech Labs', 'Cyber Crime', 'Dr. Elena Rostova', '+1 (555) 987-1122', 'dist-2', 'Tech District', '108 Cyber Park Way', '2026-07-25 03:22:00', '2026-07-25 08:00:00', 'HIGH', 'TRANSFERRED_TO_INVESTIGATION', 'Ransomware deployment targeting clinical trial databases. Demand of 50 BTC.', 'user-officer', 'Officer Sarah Jenkins', 'user-investigator', 'Det. Raymond Cooper'),
('fir-3', 'FIR-2026-07490', 'Luxury Vehicle Heist at Harbor Marina', 'Vehicle Theft', 'Harrison Forde', '+1 (555) 443-0988', 'dist-3', 'Harbor Bay', 'Pier 14 Slip 8, Harbor Marina', '2026-07-22 01:45:00', '2026-07-22 07:15:00', 'MEDIUM', 'UNDER_REVIEW', 'Custom sports coupe bypassed keyless ignition via signal repeater device.', 'user-officer', 'Officer Sarah Jenkins', NULL, NULL),
('fir-4', 'FIR-2026-06112', 'Narcotics Distribution Ring at Old Port', 'Narcotics', 'Anonymous Informant', 'PROTECTED', 'dist-3', 'Harbor Bay', 'Warehouse 49B, Dockside Rd', '2026-07-18 23:10:00', '2026-07-19 02:00:00', 'HIGH', 'TRANSFERRED_TO_INVESTIGATION', 'Illicit shipment of synthetic opioids seized during maritime raid.', 'user-officer', 'Officer Sarah Jenkins', 'user-investigator', 'Det. Raymond Cooper'),
('fir-5', 'FIR-2026-05118', 'Jewelry Store Armed Burglary', 'Armed Robbery', 'Karan Johar', '+1 (555) 321-7788', 'dist-1', 'Downtown Core', 'Diamond Market Mall', '2026-07-15 19:30:00', '2026-07-15 20:45:00', 'HIGH', 'FILED', 'Smash and grab robbery targeting high-value gold jewelry.', 'user-officer', 'Officer Sarah Jenkins', NULL, NULL),
('fir-6', 'FIR-2026-04221', 'Phishing & Wire Fraud Syndicate', 'Financial Fraud', 'Sunil Mehta', '+1 (555) 654-1122', 'dist-2', 'Tech District', 'Corporate Tower 9', '2026-07-12 11:00:00', '2026-07-12 14:00:00', 'HIGH', 'UNDER_REVIEW', 'Fake CEO email spoofing led to $500,000 wire transfer.', 'user-officer', 'Officer Sarah Jenkins', NULL, NULL),
('fir-7', 'FIR-2026-03912', 'Industrial Sabotage & Chemical Spill', 'Sabotage', 'Ramesh Iyer', '+1 (555) 888-3344', 'dist-4', 'Industrial Park', 'Factory Gate 4', '2026-07-10 02:00:00', '2026-07-10 04:30:00', 'CRITICAL', 'TRANSFERRED_TO_INVESTIGATION', 'Valves opened intentionally causing toxic chemical runoff into canal.', 'user-officer', 'Officer Sarah Jenkins', 'user-investigator', 'Det. Raymond Cooper'),
('fir-8', 'FIR-2026-03102', 'Kidnapping for Ransom', 'Kidnapping', 'Suresh Kapoor', '+1 (555) 777-2211', 'dist-5', 'Westside Heights', 'Oakridge Villa 12', '2026-07-08 18:00:00', '2026-07-08 21:00:00', 'CRITICAL', 'TRANSFERRED_TO_INVESTIGATION', 'Minor abducted outside school. Ransom note received demanding $2M.', 'user-officer', 'Officer Sarah Jenkins', 'user-investigator', 'Det. Raymond Cooper'),
('fir-9', 'FIR-2026-02901', 'Arson at Commercial Warehouses', 'Arson', 'Pooja Bhatt', '+1 (555) 444-9988', 'dist-4', 'Industrial Park', 'Storage Yard B', '2026-07-05 01:20:00', '2026-07-05 03:00:00', 'HIGH', 'UNDER_REVIEW', 'Accelerant discovered at fire origin point.', 'user-officer', 'Officer Sarah Jenkins', NULL, NULL),
('fir-10', 'FIR-2026-02190', 'Domestic Violence Incident', 'Domestic Violence', 'Anjali Rao', '+1 (555) 222-3344', 'dist-5', 'Westside Heights', 'Apt 4B Green Avenue', '2026-07-02 22:15:00', '2026-07-02 23:00:00', 'MEDIUM', 'CLOSED', 'Physical altercation resolved with restraining order issued.', 'user-officer', 'Officer Sarah Jenkins', NULL, NULL),
('fir-11', 'FIR-2026-01920', 'Counterfeit Currency Operation', 'White Collar Crime', 'Mohan Lal', '+1 (555) 999-0011', 'dist-1', 'Downtown Core', 'Central Market Arcade', '2026-06-28 16:00:00', '2026-06-28 17:30:00', 'MEDIUM', 'FILED', 'High quality counterfeit $100 notes detected in currency exchange.', 'user-officer', 'Officer Sarah Jenkins', NULL, NULL),
('fir-12', 'FIR-2026-01550', 'Illegal Firearms Trafficking', 'Organized Crime', 'Customs Officer Gill', '+1 (555) 333-8877', 'dist-3', 'Harbor Bay', 'Cargo Terminal 3', '2026-06-25 04:00:00', '2026-06-25 06:15:00', 'CRITICAL', 'TRANSFERRED_TO_INVESTIGATION', 'Seizure of 40 un-serialized ghost guns in shipping container.', 'user-officer', 'Officer Sarah Jenkins', 'user-investigator', 'Det. Raymond Cooper'),
('fir-13', 'FIR-2026-01120', 'Missing Senior Person', 'Missing Person', 'Gaurav Sharma', '+1 (555) 111-4455', 'dist-5', 'Westside Heights', 'Sunset Care Home', '2026-06-20 09:00:00', '2026-06-20 11:00:00', 'MEDIUM', 'CLOSED', 'Senior citizen located safely in nearby park.', 'user-officer', 'Officer Sarah Jenkins', NULL, NULL),
('fir-14', 'FIR-2026-00890', 'ATM Skimming & Identity Theft', 'Cyber Crime', 'HDFC Bank Security', '+1 (555) 666-5544', 'dist-1', 'Downtown Core', 'Station Road ATM Kiosk', '2026-06-15 12:00:00', '2026-06-15 13:30:00', 'MEDIUM', 'UNDER_REVIEW', 'Hidden camera and magnetic reader discovered on ATM machine.', 'user-officer', 'Officer Sarah Jenkins', NULL, NULL),
('fir-15', 'FIR-2026-00410', 'Extortion Call to Local Merchant', 'Extortion', 'Deepak Verma', '+1 (555) 888-2233', 'dist-1', 'Downtown Core', 'Grand Bazaar Market', '2026-06-10 18:30:00', '2026-06-10 19:45:00', 'HIGH', 'UNDER_REVIEW', 'Threatening VoIP call demanding protection money.', 'user-officer', 'Officer Sarah Jenkins', NULL, NULL);

-- 9. Crime Records (15 Records)
INSERT INTO crime_records (id, case_number, fir_id, fir_number, title, crime_type, district, location_address, map_coord_x, map_coord_y, date_time_occurred, description, assigned_investigator_id, assigned_investigator_name, status, severity, vehicle_details, ip_address) VALUES
('case-1', 'CR-2026-4410', 'fir-1', 'FIR-2026-08942', 'First National Bank Vault Armed Robbery', 'Armed Robbery', 'Downtown Core', '742 Financial Ave, Sector 4', 28.5, 42.1, '2026-07-28 14:15:00', 'Armed robbery executed with military precision. Signal jammers deployed.', 'user-investigator', 'Det. Raymond Cooper', 'UNDER_INVESTIGATION', 'CRITICAL', 'Dark Blue Sedan, Plate #7XYZ99', '198.51.100.44'),
('case-2', 'CR-2026-3891', 'fir-2', 'FIR-2026-08103', 'BioTech Ransomware & Data Theft', 'Cyber Crime', 'Tech District', '108 Cyber Park Way, Building B', 72.4, 21.8, '2026-07-25 03:22:00', 'Cryptographic lock applied to clinical trial databases. $50 BTC ransom demanded.', 'user-investigator', 'Det. Raymond Cooper', 'UNDER_INVESTIGATION', 'SEVERE', 'N/A', '185.220.101.5'),
('case-3', 'CR-2026-3112', 'fir-3', 'FIR-2026-07490', 'Harbor Marina Sports Coupe Theft', 'Vehicle Theft', 'Harbor Bay', 'Pier 14 Slip 8', 84.1, 78.3, '2026-07-22 01:45:00', 'Keyless relay attack executed on luxury sports coupe.', 'user-investigator', 'Det. Raymond Cooper', 'OPEN', 'MODERATE', 'Custom Cobalt Blue Sports Coupe', '192.168.10.45'),
('case-4', 'CR-2026-2910', 'fir-4', 'FIR-2026-06112', 'Dockside Synthetic Opioid Distribution', 'Narcotics', 'Harbor Bay', 'Warehouse 49B, Dockside Rd', 82.0, 81.5, '2026-07-18 23:10:00', 'Maritime smuggling operation interrupted during night raid.', 'user-investigator', 'Det. Raymond Cooper', 'UNDER_INVESTIGATION', 'SEVERE', 'Black Speedboat', '198.51.100.12'),
('case-5', 'CR-2026-2500', 'fir-5', 'FIR-2026-05118', 'Diamond Market Mall Smash & Grab', 'Armed Robbery', 'Downtown Core', 'Diamond Market Mall', 30.0, 45.0, '2026-07-15 19:30:00', 'High value gold stolen in under 3 minutes.', NULL, NULL, 'OPEN', 'SEVERE', 'Black Motorbike', NULL),
('case-6', 'CR-2026-2100', 'fir-6', 'FIR-2026-04221', 'Corporate Spear Phishing Wire Theft', 'Financial Fraud', 'Tech District', 'Corporate Tower 9', 75.0, 25.0, '2026-07-12 11:00:00', 'Fraudulent wire transfer routed through foreign offshore accounts.', NULL, NULL, 'OPEN', 'MODERATE', 'N/A', '198.51.100.99'),
('case-7', 'CR-2026-1900', 'fir-7', 'FIR-2026-03912', 'Industrial Canal Chemical Sabotage', 'Sabotage', 'Industrial Park', 'Factory Gate 4', 50.0, 60.0, '2026-07-10 02:00:00', 'Chemical valves bypassed causing localized environmental hazard.', 'user-investigator', 'Det. Raymond Cooper', 'UNDER_INVESTIGATION', 'CRITICAL', 'White Van', NULL),
('case-8', 'CR-2026-1700', 'fir-8', 'FIR-2026-03102', 'Westside Abduction & Ransom Demand', 'Kidnapping', 'Westside Heights', 'Oakridge Villa 12', 15.0, 30.0, '2026-07-08 18:00:00', 'Targeted kidnapping with encrypted VoIP contact.', 'user-investigator', 'Det. Raymond Cooper', 'UNDER_INVESTIGATION', 'CRITICAL', 'Grey Minivan', '185.220.101.88'),
('case-9', 'CR-2026-1500', 'fir-9', 'FIR-2026-02901', 'Storage Yard Industrial Arson', 'Arson', 'Industrial Park', 'Storage Yard B', 52.0, 62.0, '2026-07-05 01:20:00', 'Chemical accelerants deployed at structural support columns.', NULL, NULL, 'OPEN', 'SEVERE', 'N/A', NULL),
('case-10', 'CR-2026-1300', 'fir-10', 'FIR-2026-02190', 'Green Avenue Domestic Assault', 'Domestic Violence', 'Westside Heights', 'Apt 4B Green Avenue', 12.0, 32.0, '2026-07-02 22:15:00', 'Domestic assault case resolved with victim protection order.', NULL, NULL, 'SOLVED', 'MINOR', 'N/A', NULL),
('case-11', 'CR-2026-1100', 'fir-11', 'FIR-2026-01920', 'Central Arcade Counterfeit Distribution', 'White Collar Crime', 'Downtown Core', 'Central Market Arcade', 32.0, 40.0, '2026-06-28 16:00:00', 'Counterfeit currency ring circulating fake bills.', NULL, NULL, 'OPEN', 'MODERATE', 'N/A', NULL),
('case-12', 'CR-2026-0900', 'fir-12', 'FIR-2026-01550', 'Harbor Container Ghost Guns Seizure', 'Organized Crime', 'Harbor Bay', 'Cargo Terminal 3', 85.0, 75.0, '2026-06-25 04:00:00', 'Illegal weapons shipment intercepted during port inspection.', 'user-investigator', 'Det. Raymond Cooper', 'UNDER_INVESTIGATION', 'CRITICAL', 'Heavy Truck', NULL),
('case-13', 'CR-2026-0700', 'fir-13', 'FIR-2026-00890', 'Station Road ATM Skimmer Theft', 'Cyber Crime', 'Downtown Core', 'Station Road ATM Kiosk', 29.0, 44.0, '2026-06-15 12:00:00', 'Skimming device captured card pins across 200 users.', NULL, NULL, 'OPEN', 'MODERATE', 'N/A', '198.51.100.122'),
('case-14', 'CR-2026-0500', 'fir-14', 'FIR-2026-00410', 'Bazaar Merchant Protection Extortion', 'Extortion', 'Downtown Core', 'Grand Bazaar Market', 31.0, 41.0, '2026-06-10 18:30:00', 'Extortion racket targeting small business owners.', NULL, NULL, 'OPEN', 'SEVERE', 'N/A', NULL),
('case-15', 'CR-2026-0300', 'fir-15', 'FIR-2026-01120', 'Sunset Park Senior Citizen Search', 'Missing Person', 'Westside Heights', 'Sunset Park', 14.0, 28.0, '2026-06-20 09:00:00', 'Missing senior citizen case solved successfully.', NULL, NULL, 'SOLVED', 'MINOR', 'N/A', NULL),
('case-16', 'CR-2026-4510', 'fir-3', 'FIR-2026-07490', 'Harbor Marina Luxury Sports Coupe Heist', 'Vehicle Theft', 'Harbor Bay', 'Pier 14 Slip 8, Harbor Marina', 84.0, 78.0, '2026-07-22 01:45:00', 'Keyless signal amplification relay attack targeting high-end European sports coupe.', 'user-investigator', 'Det. Raymond Cooper', 'UNDER_INVESTIGATION', 'MODERATE', 'Custom Cobalt Blue Sports Coupe', '192.168.10.45'),
('case-17', 'CR-2026-4520', 'fir-5', 'FIR-2026-05118', 'Diamond Market Mall High-Value Jewelry Robbery', 'Armed Robbery', 'Downtown Core', 'Diamond Market Mall, Level 2', 30.0, 45.0, '2026-07-15 19:30:00', 'Smash and grab robbery targeting raw diamonds and 24K gold bullion with smoke canisters.', 'user-investigator', 'Det. Raymond Cooper', 'OPEN', 'SEVERE', 'Matte Black Sport Bike', '198.51.100.88'),
('case-18', 'CR-2026-4530', 'fir-7', 'FIR-2026-03912', 'Industrial Canal Solvents Chemical Sabotage', 'Sabotage', 'Industrial Park', 'Factory Gate 4, Industrial Canal', 50.0, 60.0, '2026-07-10 02:00:00', 'Automated pressure relief valves opened intentionally, discharging toxic industrial solvents.', 'user-investigator', 'Det. Raymond Cooper', 'UNDER_INVESTIGATION', 'CRITICAL', 'White Commercial Delivery Van', '185.220.101.5'),
('case-19', 'CR-2026-4540', 'fir-6', 'FIR-2026-04221', 'Central Financial District Wire Fraud & Phishing', 'Financial Fraud', 'Tech District', 'Corporate Tower 9, Suite 1400', 75.0, 25.0, '2026-07-12 11:00:00', 'Executive identity spoofing campaign directing wire transfers totaling $500,000.', 'user-investigator', 'Det. Raymond Cooper', 'OPEN', 'MODERATE', 'N/A', '198.51.100.99'),
('case-20', 'CR-2026-4550', 'fir-8', 'FIR-2026-03102', 'Westside Heights Abduction & Crypto Ransom', 'Kidnapping', 'Westside Heights', 'Oakridge Villa 12, Westside', 15.0, 30.0, '2026-07-08 18:00:00', 'High-profile abduction outside residence accompanied by encrypted VoIP extortion communications.', 'user-investigator', 'Det. Raymond Cooper', 'UNDER_INVESTIGATION', 'CRITICAL', 'Grey Tinted Minivan', '185.220.101.88'),
('case-21', 'CR-2026-4560', 'fir-12', 'FIR-2026-01550', 'Harbor Terminal Ghost Gun Smuggling Ring', 'Organized Crime', 'Harbor Bay', 'Cargo Terminal 3, Harbor Docks', 85.0, 75.0, '2026-06-25 04:00:00', 'Interception of 40 un-serialized polymer firearms, CNC milling equipment, and silencers.', 'user-investigator', 'Det. Raymond Cooper', 'UNDER_INVESTIGATION', 'CRITICAL', 'Heavy Cargo Freight Truck', NULL),
('case-22', 'CR-2026-4570', 'fir-14', 'FIR-2026-00890', 'Station Road ATM Hardware Skimming Operation', 'Cyber Crime', 'Downtown Core', 'Station Road ATM Kiosk #04', 29.0, 44.0, '2026-06-15 12:00:00', 'Ultra-thin overlay magnetic skimmer paired with pinhole camera captured 150 bank cards.', 'user-investigator', 'Det. Raymond Cooper', 'SOLVED', 'MODERATE', 'N/A', '198.51.100.122');

-- 10. Criminal Profiles (15 Criminal Profiles)
INSERT INTO criminal_profiles (id, code_name, legal_name, photo_url, threat_level, status) VALUES
('crim-1', 'The Specter', 'Darian Vance Rostoff', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 'EXTREME', 'WANTED'),
('crim-2', 'Cipher-X', 'Viktor Alexei Volkov', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'HIGH', 'WANTED'),
('crim-3', 'Ghost Rider', 'Dmitri Petrov', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', 'MEDIUM', 'UNDER_SURVEILLANCE'),
('crim-4', 'Shadow Boss', 'Marcus Anton', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'EXTREME', 'WANTED'),
('crim-5', 'The Mechanic', 'Alexei Ivan', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', 'HIGH', 'IN_CUSTODY'),
('crim-6', 'Viper', 'Siddharth Malhotra', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'MEDIUM', 'WANTED'),
('crim-7', 'Jackal', 'Boris Razor', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'EXTREME', 'WANTED'),
('crim-8', 'Reaper', 'Kane Mason', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', 'HIGH', 'IN_CUSTODY'),
('crim-9', 'Falcon', 'Tariq Al-Mansoor', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150', 'HIGH', 'WANTED'),
('crim-10', 'Fox', 'Elena Voronova', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', 'MEDIUM', 'UNDER_SURVEILLANCE'),
('crim-11', 'Ghost-Key', 'Yuri Gagarin Jr', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150', 'HIGH', 'WANTED'),
('crim-12', 'Broker', 'David Sterling', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'MEDIUM', 'CLEARED'),
('crim-13', 'Hammer', 'Igor Stravinsky', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'EXTREME', 'IN_CUSTODY'),
('crim-14', 'Siren', 'Natasha Roman', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'HIGH', 'WANTED'),
('crim-15', 'Phantom', 'Lucian Drake', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'EXTREME', 'WANTED');

-- 11. Crime Record - Criminal Many To Many Mapping
INSERT INTO crime_record_criminals (crime_record_id, criminal_profile_id) VALUES
('case-1', 'crim-1'),
('case-2', 'crim-2'),
('case-3', 'crim-3'),
('case-4', 'crim-4'),
('case-7', 'crim-5'),
('case-16', 'crim-11'),
('case-17', 'crim-6'),
('case-18', 'crim-5'),
('case-19', 'crim-2'),
('case-20', 'crim-4'),
('case-21', 'crim-7'),
('case-22', 'crim-8');

-- 12. Victims (15 Records)
INSERT INTO victims (id, case_id, name, age, contact_number, address, statement, protectionStatus, is_confidential) VALUES
('vic-1', 'case-1', 'Victor Sterling', 48, '+1 (555) 234-8901', '742 Financial Ave, Downtown Core', 'Assailants moved with tactical signals. Stole vault keys at gunpoint.', 'REQUESTED', false),
('vic-2', 'case-2', 'Dr. Elena Rostova', 42, '+1 (555) 987-1122', '108 Cyber Park Way', 'Ransom note locked all patient trials.', 'NONE', false),
('vic-3', 'case-3', 'Harrison Forde', 35, '+1 (555) 443-0988', 'Pier 14 Slip 8', 'Car disappeared from locked marina berth within 15 minutes.', 'NONE', false),
('vic-4', 'case-4', 'Dockside Port Authority', 50, '+1 (555) 900-1122', 'Warehouse 49B', 'Container seal broken without authorization.', 'ACTIVE_PROTECTION', true),
('vic-5', 'case-5', 'Karan Johar', 52, '+1 (555) 321-7788', 'Diamond Mall', 'Robbers broke display cases with sledgehammers.', 'NONE', false),
('vic-6', 'case-6', 'Sunil Mehta', 45, '+1 (555) 654-1122', 'Corporate Tower 9', 'Transferred funds believing email came from CEO.', 'NONE', false),
('vic-7', 'case-7', 'Ramesh Iyer', 55, '+1 (555) 888-3344', 'Factory Gate 4', 'Chemical runoff damaged local reservoir.', 'NONE', false),
('vic-8', 'case-8', 'Suresh Kapoor', 50, '+1 (555) 777-2211', 'Oakridge Villa 12', 'Son taken while walking home from school.', 'ACTIVE_PROTECTION', true),
('vic-9', 'case-9', 'Pooja Bhatt', 38, '+1 (555) 444-9988', 'Storage Yard B', 'Entire inventory consumed by accelerant fire.', 'NONE', false),
('vic-10', 'case-10', 'Anjali Rao', 30, '+1 (555) 222-3344', 'Apt 4B Green Avenue', 'Physical assault during domestic argument.', 'ACTIVE_PROTECTION', false),
('vic-11', 'case-11', 'Central Bank Cashier', 29, '+1 (555) 999-0011', 'Central Arcade', 'Discovered counterfeit $100 notes during cash audit.', 'NONE', false),
('vic-12', 'case-12', 'Port Customs Inspector', 41, '+1 (555) 333-8877', 'Cargo Terminal 3', 'Un-manifested crate contained illegal firearms.', 'NONE', false),
('vic-13', 'case-13', 'ATM Account Holders', 35, '+1 (555) 666-5544', 'Station Road', 'Unauthorized cash withdrawals across 15 accounts.', 'NONE', false),
('vic-14', 'case-14', 'Deepak Verma', 60, '+1 (555) 888-2233', 'Grand Bazaar', 'Extortion caller threatened store destruction.', 'NONE', false),
('vic-15', 'case-15', 'Gaurav Sharma', 28, '+1 (555) 111-4455', 'Sunset Care Home', 'Grandfather wandered off during morning walk.', 'NONE', false);

-- 13. Witnesses (15 Records)
INSERT INTO witnesses (id, case_id, name, contact_number, statement, credibility_rating, is_protected) VALUES
('wit-1', 'case-1', 'Marcus Brody (Vault Security)', '+1 (555) 888-9911', 'Saw dark blue sedan parked near alleyway. Driver wore black tactical mask.', 'HIGH', true),
('wit-2', 'case-2', 'Julian Vance (IT Admin)', '+1 (555) 111-2233', 'Discovered rogue USB key inserted into server rack.', 'HIGH', false),
('wit-3', 'case-3', 'Captain Donald Vance', '+1 (555) 777-8899', 'Spotted speedboat towing coupe chassis toward interstate loading ramp.', 'MODERATE', false),
('wit-4', 'case-4', 'Harbor Watchman', '+1 (555) 222-4455', 'Observed crates unloaded under darkness without harbor lights.', 'HIGH', true),
('wit-5', 'case-5', 'Mall Security Guard', '+1 (555) 333-5566', 'Heard glass shattering and motorbikes revving.', 'MODERATE', false),
('wit-6', 'case-6', 'Assistant Accountant', '+1 (555) 444-6677', 'Noticed domain spelling discrepancy in CEO email address.', 'HIGH', false),
('wit-7', 'case-7', 'Night Shift Foreman', '+1 (555) 555-7788', 'Saw white van speeding away from chemical storage gate.', 'MODERATE', false),
('wit-8', 'case-8', 'School Bus Driver', '+1 (555) 666-8899', 'Saw grey minivan idling near school exit gate.', 'HIGH', true),
('wit-9', 'case-9', 'Fire Battalion Chief', '+1 (555) 777-9900', 'Smelled gasoline near northern perimeter wall.', 'HIGH', false),
('wit-10', 'case-10', 'Building Supervisor', '+1 (555) 888-0011', 'Heard shouting and called dispatch station immediately.', 'HIGH', false),
('wit-11', 'case-11', 'Market Merchant', '+1 (555) 999-1122', 'Noticed smooth paper texture on fake $100 bills.', 'MODERATE', false),
('wit-12', 'case-12', 'Crane Operator', '+1 (555) 000-2233', 'Observed container marked ASAG transport arriving off-schedule.', 'HIGH', true),
('wit-13', 'case-13', 'Coffee Shop Barista', '+1 (555) 111-3344', 'Saw individual attach electronic device to ATM at midnight.', 'MODERATE', false),
('wit-14', 'case-14', 'Bazaar Shopkeeper', '+1 (555) 222-4455', 'Received same extortion call from masked VoIP number.', 'HIGH', false),
('wit-15', 'case-15', 'Park Vendor', '+1 (555) 333-5566', 'Saw senior citizen sitting on bench near fountain.', 'HIGH', false);

-- 14. Evidence (15 Records)
INSERT INTO evidence (id, case_id, case_number, evidence_code, title, type, file_size, file_format, sha256_hash, collected_by, collection_date, storage_location, is_verified_integrity) VALUES
('evd-1', 'case-1', 'CR-2026-4410', 'EVD-2026-901', 'Vault Alley CCTV Footage', 'CCTV_VIDEO', '4.2 GB', 'MP4', '8f93e2b10a4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e', 'Officer Sarah Jenkins', '2026-07-28 16:00:00', 'Digital Evidence Vault Server #04', true),
('evd-2', 'case-1', 'CR-2026-4410', 'EVD-2026-902', 'Submachine Gun Shell Casing (9mm)', 'WEAPON_LOG', '12 MB', 'RAW', '3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b', 'Dr. Aris Thorne', '2026-07-28 17:30:00', 'Locker A-14, Forensics Lab', true),
('evd-3', 'case-2', 'CR-2026-3891', 'EVD-2026-881', 'BioTech Memory Dump & Ransomware Binary', 'DIGITAL_FORENSIC', '1.8 GB', 'BIN', '7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d', 'Dr. Aris Thorne', '2026-07-25 10:15:00', 'Secure Server Cyber Node #01', true),
('evd-4', 'case-3', 'CR-2026-3112', 'EVD-2026-740', 'Signal Repeater Hardware Circuit', 'DIGITAL_FORENSIC', '25 MB', 'LOG', '1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f', 'Dr. Aris Thorne', '2026-07-22 09:00:00', 'Locker B-02, Forensics Lab', true),
('evd-5', 'case-4', 'CR-2026-2910', 'EVD-2026-610', 'Synthetic Opioid Chemical Analysis Report', 'DOCUMENT', '45 MB', 'PDF', '5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a', 'Dr. Aris Thorne', '2026-07-19 11:30:00', 'Vault Section C-1', true),
('evd-6', 'case-5', 'CR-2026-2500', 'EVD-2026-501', 'Sledgehammer & Fingerprint Smear', 'FINGERPRINT', '8 MB', 'IMG', '9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', 'Dr. Aris Thorne', '2026-07-15 22:00:00', 'Locker A-05', true),
('evd-7', 'case-6', 'CR-2026-2100', 'EVD-2026-401', 'Spear Phishing Email Headers', 'DOCUMENT', '2 MB', 'EML', '2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c', 'Dr. Aris Thorne', '2026-07-12 15:00:00', 'Digital Vault Node #02', true),
('evd-8', 'case-7', 'CR-2026-1900', 'EVD-2026-301', 'Chemical Valve Tampering Residue', 'DOCUMENT', '15 MB', 'RAW', '4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e', 'Dr. Aris Thorne', '2026-07-10 08:00:00', 'Locker C-10', true),
('evd-9', 'case-8', 'CR-2026-1700', 'EVD-2026-201', 'Encrypted Ransom Call Audio Log', 'AUDIO_RECORDING', '120 MB', 'WAV', '6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a', 'Dr. Aris Thorne', '2026-07-08 23:00:00', 'Digital Audio Node #03', true),
('evd-10', 'case-9', 'CR-2026-1500', 'EVD-2026-101', 'Accelerant Chemical Sample Container', 'DOCUMENT', '30 MB', 'LAB', '8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c', 'Dr. Aris Thorne', '2026-07-05 06:00:00', 'Chemical Storage Locker', true),
('evd-11', 'case-10', 'CR-2026-1300', 'EVD-2026-050', 'Domestic Incident Photo Records', 'DOCUMENT', '18 MB', 'JPG', '0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e', 'Officer Sarah Jenkins', '2026-07-02 23:45:00', 'Digital Vault Node #01', true),
('evd-12', 'case-11', 'CR-2026-1100', 'EVD-2026-030', 'Counterfeit $100 Serial Number Logs', 'DOCUMENT', '5 MB', 'PDF', '2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a', 'Officer Sarah Jenkins', '2026-06-28 18:30:00', 'Locker A-01', true),
('evd-13', 'case-12', 'CR-2026-0900', 'EVD-2026-020', 'Ghost Gun Ballistics & Serial Samples', 'WEAPON_LOG', '200 MB', 'DAT', '4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c', 'Dr. Aris Thorne', '2026-06-25 09:00:00', 'Armory Vault Section D', true),
('evd-14', 'case-13', 'CR-2026-0700', 'EVD-2026-010', 'ATM Skimming Hardware Memory Dump', 'DIGITAL_FORENSIC', '60 MB', 'BIN', '6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e', 'Dr. Aris Thorne', '2026-06-15 15:00:00', 'Digital Vault Node #04', true),
('evd-15', 'case-14', 'CR-2026-0500', 'EVD-2026-005', 'Extortion VoIP Call Audio File', 'AUDIO_RECORDING', '40 MB', 'WAV', '8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a', 'Dr. Aris Thorne', '2026-06-10 20:00:00', 'Digital Audio Node #01', true),
('evd-16', 'case-1', 'CR-2026-4410', 'EVD-2026-916', 'Thermal Camera Infrared Signature Stream', 'CCTV_VIDEO', '2.8 GB', 'MKV', '9b8a7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b', 'Dr. Aris Thorne', '2026-07-28 19:45:00', 'Digital Evidence Vault Server #02', true),
('evd-17', 'case-2', 'CR-2026-3891', 'EVD-2026-917', 'Encrypted BTC Wallet Transaction Trace Log', 'DIGITAL_FORENSIC', '350 MB', 'JSON', 'a1b2c3d4e5f60718293a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e', 'Det. Neha Gupta', '2026-07-26 11:20:00', 'Cyber Crime Node #04', true),
('evd-18', 'case-3', 'CR-2026-3112', 'EVD-2026-918', 'ECU Keyless Relay Attack Firmware Extract', 'DIGITAL_FORENSIC', '85 MB', 'HEX', 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', 'Dr. Aris Thorne', '2026-07-22 14:10:00', 'Locker B-08, Forensics Lab', true),
('evd-19', 'case-4', 'CR-2026-2910', 'EVD-2026-919', 'GPS Maritime Vessel Navigation Dump', 'DIGITAL_FORENSIC', '620 MB', 'NMEA', 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', 'Dr. Rohan Verma', '2026-07-19 15:40:00', 'Digital Evidence Vault Server #01', true),
('evd-20', 'case-5', 'CR-2026-2500', 'EVD-2026-920', 'Glass Shatter Acoustic Sensor Waveform', 'AUDIO_RECORDING', '95 MB', 'FLAC', 'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', 'Officer Sarah Jenkins', '2026-07-15 23:15:00', 'Digital Audio Node #02', true),
('evd-21', 'case-7', 'CR-2026-1900', 'EVD-2026-921', 'Industrial Solvents Gas Chromatography Profile', 'DOCUMENT', '110 MB', 'PDF', '7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b', 'Dr. Meera Nambiar', '2026-07-10 11:00:00', 'Locker C-12, Forensics Lab', true),
('evd-22', 'case-12', 'CR-2026-0900', 'EVD-2026-922', '3D Laser Scan of Un-Serialized Firearm Receiver', 'WEAPON_LOG', '1.1 GB', 'STL', 'b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9', 'Dr. Meera Nambiar', '2026-06-25 14:30:00', 'Armory Vault Section D-02', true);

-- 15. Chain of Custody (15 Records)
INSERT INTO chain_of_custody (id, evidence_id, timestamp, handled_by, badge_number, action, notes) VALUES
('coc-1', 'evd-1', '2026-07-28 16:00:00', 'Officer Sarah Jenkins', 'BADGE-4420', 'UPLOADED', 'Secured raw 4K CCTV feed from bank security server.'),
('coc-2', 'evd-1', '2026-07-28 18:30:00', 'Dr. Aris Thorne', 'BADGE-9912', 'TRANSFER_TO_LAB', 'Inverted frame rate for facial recognition enhancement.'),
('coc-3', 'evd-2', '2026-07-28 17:30:00', 'Dr. Aris Thorne', 'BADGE-9912', 'ANALYSIS_COMPLETE', 'Ballistic match connects casing to illegal arms shipment.'),
('coc-4', 'evd-3', '2026-07-25 10:15:00', 'Dr. Aris Thorne', 'BADGE-9912', 'UPLOADED', 'Isolated memory dump from BioTech clinical server.'),
('coc-5', 'evd-4', '2026-07-22 09:00:00', 'Dr. Aris Thorne', 'BADGE-9912', 'ANALYSIS_COMPLETE', 'Decoded signal frequency used in vehicle keyless attack.'),
('coc-6', 'evd-5', '2026-07-19 11:30:00', 'Dr. Aris Thorne', 'BADGE-9912', 'PRESENTED_IN_COURT', 'Lab report attached to prosecution filing.'),
('coc-7', 'evd-6', '2026-07-15 22:00:00', 'Dr. Aris Thorne', 'BADGE-9912', 'UPLOADED', 'Fingerprint lifted from sledgehammer handle.'),
('coc-8', 'evd-7', '2026-07-12 15:00:00', 'Dr. Aris Thorne', 'BADGE-9912', 'ANALYSIS_COMPLETE', 'Traced origin mail server to offshore VPS.'),
('coc-9', 'evd-8', '2026-07-10 08:00:00', 'Dr. Aris Thorne', 'BADGE-9912', 'UPLOADED', 'Chemical sample verified as industrial corrosive.'),
('coc-10', 'evd-9', '2026-07-08 23:00:00', 'Dr. Aris Thorne', 'BADGE-9912', 'ANALYSIS_COMPLETE', 'Audio voice pattern filtered to remove synthesized pitch shift.'),
('coc-11', 'evd-10', '2026-07-05 06:00:00', 'Dr. Aris Thorne', 'BADGE-9912', 'UPLOADED', 'Accelerant confirmed as aviation fuel blend.'),
('coc-12', 'evd-11', '2026-07-02 23:45:00', 'Officer Sarah Jenkins', 'BADGE-4420', 'ARCHIVED', 'Case photos archived following court resolution.'),
('coc-13', 'evd-12', '2026-06-28 18:30:00', 'Officer Sarah Jenkins', 'BADGE-4420', 'UPLOADED', 'Counterfeit serial numbers logged into central currency database.'),
('coc-14', 'evd-13', '2026-06-25 09:00:00', 'Dr. Aris Thorne', 'BADGE-9912', 'TRANSFER_TO_LAB', '3D scan completed on un-serialized firearm receivers.'),
('coc-15', 'evd-14', '2026-06-15 15:00:00', 'Dr. Aris Thorne', 'BADGE-9912', 'ANALYSIS_COMPLETE', 'Extracted 150 compromised card numbers for bank notification.'),
('coc-16', 'evd-16', '2026-07-28 19:45:00', 'Dr. Aris Thorne', 'BADGE-9912', 'UPLOADED', 'Processed high-resolution IR thermal telemetry from bank street sector.'),
('coc-17', 'evd-17', '2026-07-26 11:20:00', 'Det. Neha Gupta', 'BADGE-3011', 'ANALYSIS_COMPLETE', 'Cross-referenced transaction outputs with Darknet tumblers.'),
('coc-18', 'evd-18', '2026-07-22 14:10:00', 'Dr. Aris Thorne', 'BADGE-9912', 'TRANSFER_TO_LAB', 'Extracted ECU flash memory dump from targeted coupe.'),
('coc-19', 'evd-19', '2026-07-19 15:40:00', 'Dr. Rohan Verma', 'BADGE-4012', 'UPLOADED', 'Reconstructed vessel route through international waters.'),
('coc-20', 'evd-20', '2026-07-15 23:15:00', 'Officer Sarah Jenkins', 'BADGE-4420', 'UPLOADED', 'Isolated glass frequency response from mall alarm sensors.'),
('coc-21', 'evd-21', '2026-07-10 11:00:00', 'Dr. Meera Nambiar', 'BADGE-4011', 'ANALYSIS_COMPLETE', 'Titration report indicates high-concentration industrial solvent.'),
('coc-22', 'evd-22', '2026-06-25 14:30:00', 'Dr. Meera Nambiar', 'BADGE-4011', 'PRESENTED_IN_COURT', '3D volumetric rendering attached to grand jury indictment.');

-- 16. Forensic Reports (15 Records)
INSERT INTO forensic_reports (id, evidence_id, case_id, report_number, examiner_name, findings, methodology, status, report_date) VALUES
('fr-1', 'evd-1', 'case-1', 'FR-2026-001', 'Dr. Aris Thorne', 'Submachine gun casing matches 9mm rounds seized in harbor raid.', 'Comparison microscope and ballistic spectral imaging.', 'COMPLETED', '2026-07-29 10:00:00'),
('fr-2', 'evd-3', 'case-2', 'FR-2026-002', 'Dr. Aris Thorne', 'Ransomware deployment contained C2 callback IP 185.220.101.5.', 'Static and dynamic binary analysis in isolated sandbox.', 'COMPLETED', '2026-07-26 14:00:00'),
('fr-3', 'evd-4', 'case-3', 'FR-2026-003', 'Dr. Aris Thorne', 'Repeater hardware operated on 868 MHz frequency band.', 'RF spectrum analysis and oscilloscope signal decoding.', 'COMPLETED', '2026-07-23 11:00:00'),
('fr-4', 'evd-5', 'case-4', 'FR-2026-004', 'Dr. Aris Thorne', 'Opioids synthesized with purity rating of 98.2%.', 'Gas chromatography-mass spectrometry (GC-MS).', 'COMPLETED', '2026-07-20 16:00:00'),
('fr-5', 'evd-6', 'case-5', 'FR-2026-005', 'Dr. Aris Thorne', 'Fingerprint partial matches suspect Boris Razor.', 'AFIS database comparison.', 'COMPLETED', '2026-07-16 12:00:00'),
('fr-6', 'evd-7', 'case-6', 'FR-2026-006', 'Dr. Aris Thorne', 'Email spoofing header traces to compromised MX record.', 'DNS reverse lookup and header forensic audit.', 'COMPLETED', '2026-07-13 09:30:00'),
('fr-7', 'evd-8', 'case-7', 'FR-2026-007', 'Dr. Aris Thorne', 'Acidic corrosion rate indicates deliberate mechanical valve release.', 'Chemical titration and metallurgical examination.', 'COMPLETED', '2026-07-11 15:00:00'),
('fr-8', 'evd-9', 'case-8', 'FR-2026-008', 'Dr. Aris Thorne', 'Voice print acoustic profile matches suspect Darian Vance Rostoff.', 'Acoustic spectrographic voice matching.', 'COMPLETED', '2026-07-09 18:00:00'),
('fr-9', 'evd-10', 'case-9', 'FR-2026-009', 'Dr. Aris Thorne', 'Accelerant contains trace compounds of military grade jet fuel.', 'Chemical chromatography.', 'COMPLETED', '2026-07-06 14:00:00'),
('fr-10', 'evd-11', 'case-10', 'FR-2026-010', 'Dr. Aris Thorne', 'Medical photo evidence documents physical trauma.', 'Forensic medical photography audit.', 'COMPLETED', '2026-07-03 10:00:00'),
('fr-11', 'evd-12', 'case-11', 'FR-2026-011', 'Dr. Aris Thorne', 'Counterfeit bills print technique uses specialized offset lithography.', 'Microscopic paper fiber analysis.', 'COMPLETED', '2026-06-29 11:30:00'),
('fr-12', 'evd-13', 'case-12', 'FR-2026-012', 'Dr. Aris Thorne', 'Ghost guns manufactured using commercial 3D metal printing.', 'CT scanning and metallurgical hardness test.', 'COMPLETED', '2026-06-26 17:00:00'),
('fr-13', 'evd-14', 'case-13', 'FR-2026-013', 'Dr. Aris Thorne', 'Skimmer device captured 150 magnetic track payloads.', 'EEPROM chip dump and reverse engineering.', 'COMPLETED', '2026-06-16 13:00:00'),
('fr-14', 'evd-15', 'case-14', 'FR-2026-014', 'Dr. Aris Thorne', 'VoIP call routed via multiple anonymous proxies.', 'SIP header packet tracing.', 'COMPLETED', '2026-06-11 16:30:00'),
('fr-15', 'evd-1', 'case-15', 'FR-2026-015', 'Dr. Aris Thorne', 'Digital camera metadata confirms location timestamp.', 'EXIF metadata audit.', 'COMPLETED', '2026-06-21 10:00:00'),
('fr-16', 'evd-16', 'case-1', 'FR-2026-016', 'Dr. Aris Thorne', 'IR thermal analysis isolated suspect height and thermal mask heat signature.', 'Infrared spectrographic enhancement and pixel tracking.', 'COMPLETED', '2026-07-29 11:15:00'),
('fr-17', 'evd-17', 'case-2', 'FR-2026-017', 'Det. Neha Gupta', 'BTC wallet address linked to ransomware payout node 185.220.101.5.', 'Blockchain ledger graph clustering and node analysis.', 'COMPLETED', '2026-07-26 16:30:00'),
('fr-18', 'evd-18', 'case-3', 'FR-2026-018', 'Dr. Aris Thorne', 'ECU memory log proves signal repetition attack over 868 MHz frequency.', 'Bus sniffing and microcontroller reverse engineering.', 'COMPLETED', '2026-07-23 13:45:00'),
('fr-19', 'evd-19', 'case-4', 'FR-2026-019', 'Dr. Rohan Verma', 'GPS log shows cargo vessel stopped at offshore coordinate 3.2 miles out.', 'NMEA sentence parsing and marine chart overlay.', 'COMPLETED', '2026-07-20 09:15:00'),
('fr-20', 'evd-20', 'case-5', 'FR-2026-020', 'Officer Sarah Jenkins', 'Audio frequency profile confirms heavy sledgehammer impact on tempered glass.', 'Acoustic FFT spectral analysis.', 'COMPLETED', '2026-07-16 14:00:00'),
('fr-21', 'evd-21', 'case-7', 'FR-2026-021', 'Dr. Meera Nambiar', 'Solvent residue contains toluene and xylene industrial compounds.', 'Gas chromatography-mass spectrometry (GC-MS).', 'COMPLETED', '2026-07-11 11:30:00'),
('fr-22', 'evd-22', 'case-12', 'FR-2026-022', 'Dr. Meera Nambiar', '3D scan reveals micro-machining toolmarks from specialized CNC mill.', 'Sub-micron optical profilometry.', 'COMPLETED', '2026-06-26 15:00:00');

-- 17. Pattern Alerts (15 Records)
INSERT INTO pattern_alerts (id, title, similarity_score, matched_factors, primary_case_id, primary_fir_number, related_case_id, related_fir_number, detection_date, status, suspect_id, suspect_alias) VALUES
('alert-1', '96% High-Confidence MO Match: Armed Robbery & Bank Heist', 96, '["Matching Signal Jamming Frequency (868 MHz)", "Dark Blue Sedan Plate #7XYZ99 Reconnaissance", "Suspect Descriptor Match"]', 'case-1', 'FIR-2026-08942', 'case-2', 'FIR-2026-08103', '2026-07-29 08:30:00', 'UNREVIEWED', 'crim-1', 'The Specter'),
('alert-2', '91% Cross-District Cyber Ransomware Pattern', 91, '["Ransomware Binary Hash Overlap", "Tor Gateway Proxy IP 185.220.101.5", "50 BTC Demand Structuring"]', 'case-2', 'FIR-2026-08103', 'case-6', 'FIR-2026-04221', '2026-07-26 11:15:00', 'CONFIRMED', 'crim-2', 'Cipher-X'),
('alert-3', '88% Vehicle Theft Signal Repeater Modus Operandi', 88, '["868 MHz Relay Hardware Signature", "Harbor Bay Target Radius", "Custom Coupe Target Vehicle"]', 'case-3', 'FIR-2026-07490', 'case-1', 'FIR-2026-08942', '2026-07-23 14:00:00', 'UNREVIEWED', 'crim-3', 'Ghost Rider'),
('alert-4', '94% Opioid & Ghost Gun Smuggling Syndicate Link', 94, '["Harbor Bay Dockside Warehouse Location", "ASAG Shipping Container Markings", "Offshore Phone Contact"]', 'case-4', 'FIR-2026-06112', 'case-12', 'FIR-2026-01550', '2026-07-20 09:45:00', 'CONFIRMED', 'crim-4', 'Shadow Boss'),
('alert-5', '85% Industrial Sabotage & Arson Chemical Match', 85, '["Aviation Fuel Accelerant Trace", "Industrial Park Target Zone", "White Van Spotting"]', 'case-7', 'FIR-2026-03912', 'case-9', 'FIR-2026-02901', '2026-07-11 16:20:00', 'UNREVIEWED', 'crim-5', 'The Mechanic'),
('alert-6', '89% High-Confidence Gold Jewelry Smash & Grab Match', 89, '["3 Minute Execution Window", "Motorbike Escape Vector", "Sledgehammer Entry"]', 'case-5', 'FIR-2026-05118', 'case-1', 'FIR-2026-08942', '2026-07-16 10:00:00', 'UNREVIEWED', 'crim-6', 'Viper'),
('alert-7', '92% Kidnapping & VoIP Extortion Match', 92, '["Encrypted VoIP Voice Pitch Shift", "Ransom Structuring", "Westside Target Zone"]', 'case-8', 'FIR-2026-03102', 'case-14', 'FIR-2026-00410', '2026-07-09 13:10:00', 'CONFIRMED', 'crim-7', 'Jackal'),
('alert-8', '83% ATM Skimmer & Identity Fraud Pattern', 83, '["Station Road Location", "Skimmer EEPROM Board Design", "Compromised BIN Ranges"]', 'case-13', 'FIR-2026-00890', 'case-11', 'FIR-2026-01920', '2026-06-16 08:30:00', 'DISMISSED', 'crim-8', 'Reaper'),
('alert-9', '90% Counterfeit Note Distribution Network Match', 90, '["Lithographic Offset Printing", "Downtown Core Arcade Distribution", "$100 Bill Denominations"]', 'case-11', 'FIR-2026-01920', 'case-6', 'FIR-2026-04221', '2026-06-29 15:45:00', 'UNREVIEWED', 'crim-9', 'Falcon'),
('alert-10', '87% Ghost Gun Un-serialized Metal Printing Match', 87, '["3D Metal Powder Hardness Rating", "Harbor Container Cargo Route", "Port Authority Gate 3"]', 'case-12', 'FIR-2026-01550', 'case-4', 'FIR-2026-06112', '2026-06-26 12:00:00', 'CONFIRMED', 'crim-10', 'Fox'),
('alert-11', '82% Corporate Spear Phishing Domain Spoofing', 82, '["Offshore VPS Mail Host", "Executive Identity Theft", "Tech District Target Zone"]', 'case-6', 'FIR-2026-04221', 'case-2', 'FIR-2026-08103', '2026-07-13 17:30:00', 'UNREVIEWED', 'crim-11', 'Ghost-Key'),
('alert-12', '95% Bank Vault & Signal Jamming Reconnaissance', 95, '["868 MHz Jamming Board", "Financial Ave Target", "Silenced Submachine Gun Casing"]', 'case-1', 'FIR-2026-08942', 'case-12', 'FIR-2026-01550', '2026-07-29 19:10:00', 'CONFIRMED', 'crim-12', 'Broker'),
('alert-13', '86% Chemical Canal Contamination & Toxic Dump', 86, '["Chemical Valve Override", "Industrial Park Canal Gate", "Corrosive Acid Residue"]', 'case-7', 'FIR-2026-03912', 'case-9', 'FIR-2026-02901', '2026-07-11 20:00:00', 'UNREVIEWED', 'crim-13', 'Hammer'),
('alert-14', '84% Harbor Marina Sports Car Export Ring', 84, '["Speedboat Towing Mechanism", "Custom Coupe Keyless Override", "Harbor Pier 14"]', 'case-3', 'FIR-2026-07490', 'case-4', 'FIR-2026-06112', '2026-07-23 18:20:00', 'UNREVIEWED', 'crim-14', 'Siren'),
('alert-15', '93% Extortion Racket & Commercial Threat Ring', 93, '["Grand Bazaar Merchants", "VoIP Audio Pitch Pattern", "Protection Demand Notes"]', 'case-14', 'FIR-2026-00410', 'case-8', 'FIR-2026-03102', '2026-06-11 11:00:00', 'CONFIRMED', 'crim-15', 'Phantom');

-- 18. Hotspots (15 Hotspot Sectors)
INSERT INTO hotspots (id, sector_name, sector_code, risk_level, total_incidents, primary_crime_type, map_coord_x, map_coord_y, active_patrol_units, district_id) VALUES
('hs-1', 'Financial District Core', 'SEC-FIN-01', 'CRITICAL', 142, 'Armed Robbery & Heist', 28.5, 42.1, 8, 'dist-1'),
('hs-2', 'Tech Park Innovation Zone', 'SEC-TECH-04', 'HIGH', 98, 'Cyber Crime & Extortion', 72.4, 21.8, 5, 'dist-2'),
('hs-3', 'Harbor Bay Container Terminal', 'SEC-HARBOR-09', 'CRITICAL', 165, 'Narcotics & Weapons Smuggling', 82.0, 81.5, 9, 'dist-3'),
('hs-4', 'Industrial Park West', 'SEC-IND-02', 'HIGH', 110, 'Arson & Sabotage', 50.0, 60.0, 6, 'dist-4'),
('hs-5', 'Westside Residential Heights', 'SEC-WEST-05', 'MODERATE', 45, 'Kidnapping & Burglary', 15.0, 30.0, 4, 'dist-5'),
('hs-6', 'Central Grand Bazaar Arcade', 'SEC-BAZAAR-03', 'HIGH', 128, 'Counterfeit & Extortion', 31.0, 41.0, 7, 'dist-1'),
('hs-7', 'Pier 14 Slip & Yacht Marina', 'SEC-MARINA-14', 'MODERATE', 62, 'Luxury Vehicle Theft', 84.1, 78.3, 3, 'dist-3'),
('hs-8', 'Station Road ATM Corridor', 'SEC-ATM-01', 'MODERATE', 58, 'ATM Skimming & Fraud', 29.0, 44.0, 4, 'dist-1'),
('hs-9', 'Corporate Tower Plaza', 'SEC-CORP-08', 'LOW', 32, 'Wire Fraud', 75.0, 25.0, 2, 'dist-2'),
('hs-10', 'Diamond Market Mall', 'SEC-MALL-02', 'HIGH', 89, 'Armed Burglary', 30.0, 45.0, 5, 'dist-1'),
('hs-11', 'Chemical Canal Storage Yard', 'SEC-CHEM-03', 'HIGH', 76, 'Chemical Sabotage', 52.0, 62.0, 4, 'dist-4'),
('hs-12', 'Oakridge Villa Estate', 'SEC-OAK-12', 'MODERATE', 28, 'Extortion', 15.0, 30.0, 3, 'dist-5'),
('hs-13', 'Green Avenue Apartments', 'SEC-GREEN-04', 'LOW', 19, 'Domestic Assault', 12.0, 32.0, 2, 'dist-5'),
('hs-14', 'Dockside Warehouses 40-50', 'SEC-DOCK-40', 'CRITICAL', 175, 'Organized Trafficking', 85.0, 75.0, 10, 'dist-3'),
('hs-15', 'Central Market Plaza', 'SEC-MARKET-01', 'MODERATE', 50, 'Counterfeit Currency', 32.0, 40.0, 3, 'dist-1');

-- 19. Audit Logs (15 Records)
INSERT INTO audit_logs (id, timestamp, badge_number, user_name, role, action, module, details, ip_address) VALUES
('audit-1', '2026-07-30 22:01:15', 'BADGE-4420', 'Officer Sarah Jenkins', 'POLICE_OFFICER', 'USER_LOGIN', 'AUTH', 'Authenticated session via SCAP Terminal', '10.14.0.12'),
('audit-2', '2026-07-28 15:30:00', 'BADGE-4420', 'Officer Sarah Jenkins', 'POLICE_OFFICER', 'FIR_FILED', 'FIR', 'Registered FIR-2026-08942: Armed Robbery at First National Vault', '10.14.0.12'),
('audit-3', '2026-07-28 17:10:00', 'BADGE-1001', 'Director Marcus Vance', 'ADMIN', 'FIR_STATUS_UPDATE', 'FIR', 'Upgraded priority of FIR-2026-08942 to CRITICAL; assigned Major Crimes', '10.14.0.10'),
('audit-4', '2026-07-28 17:30:00', 'BADGE-9912', 'Dr. Aris Thorne', 'FORENSIC_OFFICER', 'EVIDENCE_UPLOAD', 'EVIDENCE', 'Logged evidence EVD-2026-902 (9mm shell casing) with computed SHA-256 hash', '10.14.0.15'),
('audit-5', '2026-07-29 08:30:00', 'BADGE-7809', 'Det. Raymond Cooper', 'INVESTIGATOR', 'PATTERN_ALERT_CONFIRMED', 'CRIME', 'Confirmed 96% MO similarity alert between Bank Heist and Cyber Ransomware', '10.14.0.14'),
('audit-6', '2026-07-25 08:00:00', 'BADGE-4420', 'Officer Sarah Jenkins', 'POLICE_OFFICER', 'FIR_FILED', 'FIR', 'Registered FIR-2026-08103: Cyber Extortion at BioTech Labs', '10.14.0.12'),
('audit-7', '2026-07-25 10:15:00', 'BADGE-9912', 'Dr. Aris Thorne', 'FORENSIC_OFFICER', 'EVIDENCE_UPLOAD', 'EVIDENCE', 'Uploaded ransomware binary EVD-2026-881 to digital evidence server', '10.14.0.15'),
('audit-8', '2026-07-22 07:15:00', 'BADGE-4420', 'Officer Sarah Jenkins', 'POLICE_OFFICER', 'FIR_FILED', 'FIR', 'Filed report FIR-2026-07490 for luxury vehicle heist', '10.14.0.12'),
('audit-9', '2026-07-19 02:00:00', 'BADGE-4420', 'Officer Sarah Jenkins', 'POLICE_OFFICER', 'FIR_FILED', 'FIR', 'Logged maritime narcotics seizure FIR-2026-06112', '10.14.0.12'),
('audit-10', '2026-07-15 20:45:00', 'BADGE-4420', 'Officer Sarah Jenkins', 'POLICE_OFFICER', 'FIR_FILED', 'FIR', 'Filed jewelry store robbery FIR-2026-05118', '10.14.0.12'),
('audit-11', '2026-07-12 14:00:00', 'BADGE-4420', 'Officer Sarah Jenkins', 'POLICE_OFFICER', 'FIR_FILED', 'FIR', 'Logged phishing scam FIR-2026-04221', '10.14.0.12'),
('audit-12', '2026-07-10 04:30:00', 'BADGE-4420', 'Officer Sarah Jenkins', 'POLICE_OFFICER', 'FIR_FILED', 'FIR', 'Logged chemical sabotage FIR-2026-03912', '10.14.0.12'),
('audit-13', '2026-07-08 21:00:00', 'BADGE-4420', 'Officer Sarah Jenkins', 'POLICE_OFFICER', 'FIR_FILED', 'FIR', 'Filed kidnapping report FIR-2026-03102', '10.14.0.12'),
('audit-14', '2026-07-05 03:00:00', 'BADGE-4420', 'Officer Sarah Jenkins', 'POLICE_OFFICER', 'FIR_FILED', 'FIR', 'Filed arson report FIR-2026-02901', '10.14.0.12'),
('audit-15', '2026-07-30 21:45:10', 'BADGE-1001', 'Director Marcus Vance', 'ADMIN', 'REPORT_GENERATED', 'REPORT', 'Generated monthly executive intelligence report RPT-2026-101', '10.14.0.10');

-- 20. Reports (15 Records)
INSERT INTO reports (id, report_number, title, report_type, generated_by, generated_date, file_format, file_url, summary_data) VALUES
('rpt-1', 'RPT-2026-101', 'Monthly Executive Intelligence Briefing', 'EXECUTIVE_SUMMARY', 'Director Marcus Vance', '2026-07-30 21:00:00', 'PDF', '/reports/RPT-2026-101.pdf', 'Overview of active cases, hot-spot risk levels, and evidence hash verification.'),
('rpt-2', 'RPT-2026-102', 'Downtown Core FIR Analytics', 'FIR_ANALYSIS', 'Officer Sarah Jenkins', '2026-07-28 18:00:00', 'PDF', '/reports/RPT-2026-102.pdf', 'Breakdown of 15 FIR filings across Downtown Core precinct.'),
('rpt-3', 'RPT-2026-103', 'Digital Forensics Integrity Log', 'EVIDENCE_LOG', 'Dr. Aris Thorne', '2026-07-25 12:00:00', 'PDF', '/reports/RPT-2026-103.pdf', 'Cryptographic verification status for all 15 digital evidence items.'),
('rpt-4', 'RPT-2026-104', 'Major Crimes Homicide & Robbery Summary', 'CRIME_ANALYTICS', 'Det. Raymond Cooper', '2026-07-22 16:00:00', 'PDF', '/reports/RPT-2026-104.pdf', 'Case resolution metrics for armed robbery and extortion.'),
('rpt-5', 'RPT-2026-105', 'Cyber Crime & Ransomware Threat Report', 'CRIME_ANALYTICS', 'Dr. Aris Thorne', '2026-07-20 14:00:00', 'PDF', '/reports/RPT-2026-105.pdf', 'Analysis of ransomware vectors, IP traces, and digital evidence.'),
('rpt-6', 'RPT-2026-106', 'Harbor Bay Maritime Trafficking Report', 'CRIME_ANALYTICS', 'Det. Raymond Cooper', '2026-07-18 10:00:00', 'PDF', '/reports/RPT-2026-106.pdf', 'Interception metrics for contraband and un-serialized ghost guns.'),
('rpt-7', 'RPT-2026-107', 'Industrial Sabotage Environmental Impact', 'EXECUTIVE_SUMMARY', 'Director Marcus Vance', '2026-07-15 09:00:00', 'PDF', '/reports/RPT-2026-107.pdf', 'Chemical runoff evaluation and precinct response.'),
('rpt-8', 'RPT-2026-108', 'Westside Kidnapping Case Brief', 'INVESTIGATION', 'Det. Raymond Cooper', '2026-07-12 11:00:00', 'PDF', '/reports/RPT-2026-108.pdf', 'VoIP call tracing and active suspect surveillance timeline.'),
('rpt-9', 'RPT-2026-109', 'Arson Accelerant Spectral Analysis', 'EVIDENCE_LOG', 'Dr. Aris Thorne', '2026-07-08 15:00:00', 'PDF', '/reports/RPT-2026-109.pdf', 'Laboratory gas chromatography findings.'),
('rpt-10', 'RPT-2026-110', 'Counterfeit Currency Distribution Brief', 'CRIME_ANALYTICS', 'Officer Sarah Jenkins', '2026-07-05 13:00:00', 'PDF', '/reports/RPT-2026-110.pdf', 'Serial number patterns detected across arcade merchants.'),
('rpt-11', 'RPT-2026-111', 'ATM Skimming Compromise Notice', 'EVIDENCE_LOG', 'Dr. Aris Thorne', '2026-06-28 17:00:00', 'PDF', '/reports/RPT-2026-111.pdf', 'EEPROM chip dump details and compromised card ranges.'),
('rpt-12', 'RPT-2026-112', 'Extortion Call VoIP Routing Audit', 'INVESTIGATION', 'Det. Raymond Cooper', '2026-06-25 12:00:00', 'PDF', '/reports/RPT-2026-112.pdf', 'SIP packet trace and proxy node analysis.'),
('rpt-13', 'RPT-2026-113', 'Officer Duty & Activity Audit', 'OFFICER_ACTIVITY', 'Director Marcus Vance', '2026-06-20 16:00:00', 'PDF', '/reports/RPT-2026-113.pdf', 'Duty log and terminal activity for 15 police officers.'),
('rpt-14', 'RPT-2026-114', 'Hotspot Patrol Unit Allocation Matrix', 'EXECUTIVE_SUMMARY', 'Director Marcus Vance', '2026-06-15 10:00:00', 'PDF', '/reports/RPT-2026-114.pdf', 'Patrol unit distribution across 15 high-risk sectors.'),
('rpt-15', 'RPT-2026-115', 'Quarterly Crime Analytics Overview', 'CRIME_ANALYTICS', 'Director Marcus Vance', '2026-06-10 09:00:00', 'PDF', '/reports/RPT-2026-115.pdf', 'Comprehensive 90-day crime trend and conviction rate analysis.');

-- 21. Notifications (15 Records)
INSERT INTO notifications (id, recipient_user_id, title, message, type, is_read, timestamp, reference_url) VALUES
('notif-1', 'user-investigator', '96% MO Pattern Match Triggered', 'Pattern alert generated between Case CR-2026-4410 and CR-2026-3891.', 'PATTERN_MATCH', false, '2026-07-29 08:30:00', '/patterns/alert-1'),
('notif-2', 'user-forensic', 'New Evidence Item Assigned', 'Evidence EVD-2026-902 submitted for ballistic analysis.', 'EVIDENCE_ADDED', false, '2026-07-28 17:30:00', '/evidence/evd-2'),
('notif-3', 'user-officer', 'FIR Status Upgraded to CRITICAL', 'Director Vance upgraded FIR-2026-08942 priority.', 'FIR_UPDATE', true, '2026-07-28 17:10:00', '/firs/fir-1'),
('notif-4', 'user-admin', 'System Security Audit Completed', 'Tamper-proof cryptographic check passed on all 15 evidence records.', 'INFO', true, '2026-07-30 21:00:00', '/audit-logs'),
('notif-5', 'user-investigator', 'Forensic Lab Report Completed', 'Dr. Thorne completed report FR-2026-002 for ransomware case.', 'EVIDENCE_ADDED', false, '2026-07-26 14:00:00', '/investigations/case-2'),
('notif-6', 'user-officer', 'New FIR Registered', 'FIR-2026-08103 logged successfully under Tech District.', 'FIR_UPDATE', true, '2026-07-25 08:00:00', '/firs/fir-2'),
('notif-7', 'user-forensic', 'Evidence Custody Transfer Request', 'Transfer requested for signal repeater EVD-2026-740.', 'EVIDENCE_ADDED', true, '2026-07-22 09:00:00', '/evidence/evd-4'),
('notif-8', 'user-investigator', 'High Priority Case Assigned', 'Assigned lead investigator for Westside Kidnapping CR-2026-1700.', 'CRIME_UPDATE', false, '2026-07-08 21:00:00', '/investigations/case-8'),
('notif-9', 'user-admin', 'Chemical Sabotage Incident Alert', 'Critical incident FIR-2026-03912 reported in Industrial Park.', 'ALERT', true, '2026-07-10 04:30:00', '/firs/fir-7'),
('notif-10', 'user-officer', 'Case Status Solved', 'Green Avenue domestic assault case marked SOLVED.', 'CRIME_UPDATE', true, '2026-07-02 23:00:00', '/crimes/case-10'),
('notif-11', 'user-forensic', 'Ballistics Scan Verified', 'Ghost gun 3D scan completed and archived.', 'EVIDENCE_ADDED', true, '2026-06-25 09:00:00', '/evidence/evd-13'),
('notif-12', 'user-investigator', 'Witness Statement Updated', 'School bus driver statement added to Case CR-2026-1700.', 'CRIME_UPDATE', false, '2026-07-08 22:00:00', '/investigations/case-8'),
('notif-13', 'user-admin', 'Monthly Executive Report Ready', 'Report RPT-2026-101 compiled and ready for download.', 'INFO', true, '2026-07-30 21:45:00', '/reports/rpt-1'),
('notif-14', 'user-officer', 'ATM Skimmer Hardware Uploaded', 'Digital evidence EVD-2026-010 logged into vault.', 'EVIDENCE_ADDED', true, '2026-06-15 15:00:00', '/evidence/evd-14'),
('notif-15', 'user-investigator', 'IP Trace Completed', 'IP 185.220.101.5 traced to Eastern Europe proxy node.', 'INFO', false, '2026-07-26 11:00:00', '/intel/ip-trace');

-- 22. Server Logs & Threat Detections
INSERT INTO server_logs (id, timestamp, source_ip, request_method, request_url, http_status, user_agent, payload_data, threat_flag) VALUES
('log-1', '2026-07-30 22:10:00', '185.220.101.5', 'POST', '/api/v1/auth/login', 401, 'Python-requests/2.28.1', '{"username":"admin\' OR \'1\'=\'1","password":"foo"}', 'SQL_INJECTION'),
('log-2', '2026-07-30 22:11:00', '185.220.101.5', 'POST', '/api/v1/firs/search', 200, 'Mozilla/5.0 SCAP', '{"query":"<script>alert(1)</script>"}', 'XSS'),
('log-3', '2026-07-30 22:12:00', '10.14.0.12', 'GET', '/api/v1/crimes', 200, 'Mozilla/5.0 SCAP-Web', NULL, 'NORMAL');

INSERT INTO threat_detections (id, server_log_id, source_ip, threat_type, severity, payload_pattern, detected_timestamp, status) VALUES
('threat-1', 'log-1', '185.220.101.5', 'SQL_INJECTION', 'CRITICAL', '\' OR \'1\'=\'1', '2026-07-30 22:10:00', 'NEW'),
('threat-2', 'log-2', '185.220.101.5', 'XSS', 'HIGH', '<script>alert(1)</script>', '2026-07-30 22:11:00', 'NEW');

-- 23. IP Addresses & Device Locations
INSERT INTO ip_addresses (id, ip_string, isp, organization, country, city, risk_score, is_tor, is_vpn, threat_level, last_activity) VALUES
('ip-1', '185.220.101.5', 'Tor Gateway Europe', 'Darknet Proxy Node', 'Romania', 'Bucharest', 95, true, true, 'CRITICAL', '2026-07-30 22:11:00'),
('ip-2', '198.51.100.44', 'Cyber Telecom Inc', 'VPN Anonymous Transit', 'United States', 'Chicago', 82, false, true, 'HIGH', '2026-07-28 14:15:00');

INSERT INTO device_locations (id, ip_address_id, latitude, longitude, device_type, mac_address, serial_number) VALUES
('dl-1', 'ip-1', 44.4323, 26.1063, 'Linux Gateway Server', '00:1A:2B:3C:4D:5E', 'SRV-8891-ROM'),
('dl-2', 'ip-2', 41.8781, -87.6298, 'Wireless Router Node', '00:11:22:33:44:55', 'RTR-102-CHI');
