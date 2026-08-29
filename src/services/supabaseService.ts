import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  User,
  FIR,
  CrimeRecord,
  CriminalProfile,
  EvidenceItem,
  Victim,
  Witness,
  InvestigationNote,
  PatternAlert,
  AuditLog,
  HotspotSector,
  FirStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_FIRS,
  INITIAL_CRIME_RECORDS,
  INITIAL_CRIMINALS,
  INITIAL_VICTIMS,
  INITIAL_WITNESSES,
  INITIAL_EVIDENCE,
  INITIAL_INVESTIGATION_NOTES,
  INITIAL_PATTERN_ALERTS,
  INITIAL_AUDIT_LOGS,
  INITIAL_HOTSPOTS,
} from '../data/seedData';

/* ==========================================================================
   DATA MAPPERS (PostgreSQL snake_case <-> TypeScript camelCase)
   ========================================================================== */

// 1. User Mapper
export const mapUserFromDb = (row: any): User => ({
  id: row.id,
  badgeNumber: row.badge_number || row.badgeNumber || 'BADGE-0000',
  name: row.name || 'Unknown Officer',
  email: row.email || '',
  role: row.role || 'POLICE_OFFICER',
  department: row.department || 'Patrol Unit',
  avatarUrl: row.avatar_url || row.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  status: row.status || 'ACTIVE',
  lastLogin: row.last_login || row.lastLogin || new Date().toISOString(),
});

export const mapUserToDb = (u: User) => ({
  id: u.id,
  badge_number: u.badgeNumber,
  name: u.name,
  email: u.email,
  role: u.role,
  department: u.department,
  avatar_url: u.avatarUrl,
  status: u.status,
  last_login: u.lastLogin,
});

// 2. FIR Mapper
export const mapFirFromDb = (row: any): FIR => ({
  id: row.id,
  firNumber: row.fir_number || row.firNumber,
  title: row.title,
  incidentType: row.incident_type || row.incidentType || 'General Crime',
  complainantName: row.complainant_name || row.complainantName,
  complainantContact: row.complainant_contact || row.complainantContact,
  district: row.district || 'Downtown Core',
  locationDetails: row.location_details || row.locationDetails || '',
  incidentDateTime: row.incident_date_time || row.incidentDateTime || new Date().toISOString(),
  filedDateTime: row.filed_date_time || row.filedDateTime || new Date().toISOString(),
  priority: row.priority || 'MEDIUM',
  status: row.status || 'FILED',
  description: row.description || '',
  reportingOfficerId: row.reporting_officer_id || row.reportingOfficerId || '',
  reportingOfficerName: row.reporting_officer_name || row.reportingOfficerName || '',
  assignedInvestigatorId: row.assigned_investigator_id || row.assignedInvestigatorId,
  assignedInvestigatorName: row.assigned_investigator_name || row.assignedInvestigatorName,
  history: Array.isArray(row.history) ? row.history : [],
});

export const mapFirToDb = (f: FIR) => ({
  id: f.id,
  fir_number: f.firNumber,
  title: f.title,
  incident_type: f.incidentType,
  complainant_name: f.complainantName,
  complainant_contact: f.complainantContact,
  district: f.district,
  location_details: f.locationDetails,
  incident_date_time: f.incidentDateTime,
  filed_date_time: f.filedDateTime,
  priority: f.priority,
  status: f.status,
  description: f.description,
  reporting_officer_id: f.reportingOfficerId,
  reporting_officer_name: f.reportingOfficerName,
  assigned_investigator_id: f.assignedInvestigatorId || null,
  assigned_investigator_name: f.assignedInvestigatorName || null,
  history: f.history || [],
});

// 3. Crime Record Mapper
export const mapCrimeFromDb = (row: any): CrimeRecord => {
  const coordsObj = typeof row.coordinates === 'object' && row.coordinates !== null ? row.coordinates : {};
  const lat = row.latitude ?? coordsObj.lat ?? null;
  const lng = row.longitude ?? coordsObj.lng ?? null;
  const landmark = row.landmark || coordsObj.landmark || '';
  const nearestPoliceStation = row.nearest_police_station || coordsObj.nearestStation || '';
  const sectorCode = row.sector_code || coordsObj.sectorCode || '';

  return {
    id: row.id,
    caseNumber: row.case_number || row.caseNumber,
    firId: row.fir_id || row.firId,
    firNumber: row.fir_number || row.firNumber,
    title: row.title,
    crimeType: row.crime_type || row.crimeType,
    district: row.district,
    sectorCode: sectorCode || undefined,
    locationAddress: row.location_address || row.locationAddress || '',
    landmark: landmark || undefined,
    nearestPoliceStation: nearestPoliceStation || undefined,
    latitude: typeof lat === 'number' ? lat : undefined,
    longitude: typeof lng === 'number' ? lng : undefined,
    coordinates: {
      x: coordsObj.x ?? 50,
      y: coordsObj.y ?? 50,
      lat: typeof lat === 'number' ? lat : undefined,
      lng: typeof lng === 'number' ? lng : undefined,
      landmark: landmark || undefined,
      nearestStation: nearestPoliceStation || undefined,
      sectorCode: sectorCode || undefined,
    },
    dateTimeOccurred: row.date_time_occurred || row.dateTimeOccurred || new Date().toISOString(),
    description: row.description || '',
    assignedInvestigatorId: row.assigned_investigator_id || row.assignedInvestigatorId || '',
    assignedInvestigatorName: row.assigned_investigator_name || row.assignedInvestigatorName || '',
    status: row.status || 'OPEN',
    severity: row.severity || 'MODERATE',
    modusOperandi: Array.isArray(row.modus_operandi) ? row.modus_operandi : (row.modusOperandi || []),
    vehicleDetails: row.vehicle_details || row.vehicleDetails,
    suspectPhoneNumbers: Array.isArray(row.suspect_phone_numbers) ? row.suspect_phone_numbers : (row.suspectPhoneNumbers || []),
    ipAddress: row.ip_address || row.ipAddress,
    linkedCriminalIds: Array.isArray(row.linked_criminal_ids) ? row.linked_criminal_ids : (row.linkedCriminalIds || []),
    evidenceIds: Array.isArray(row.evidence_ids) ? row.evidence_ids : (row.evidenceIds || []),
    victimIds: Array.isArray(row.victim_ids) ? row.victim_ids : (row.victimIds || []),
    witnessIds: Array.isArray(row.witness_ids) ? row.witness_ids : (row.witnessIds || []),
  };
};

export const mapCrimeToDb = (c: CrimeRecord) => ({
  id: c.id,
  case_number: c.caseNumber,
  fir_id: c.firId,
  fir_number: c.firNumber,
  title: c.title,
  crime_type: c.crimeType,
  district: c.district,
  location_address: c.locationAddress,
  coordinates: {
    x: c.coordinates?.x ?? 50,
    y: c.coordinates?.y ?? 50,
    lat: c.latitude ?? c.coordinates?.lat,
    lng: c.longitude ?? c.coordinates?.lng,
    landmark: c.landmark ?? c.coordinates?.landmark,
    nearestStation: c.nearestPoliceStation ?? c.coordinates?.nearestStation,
    sectorCode: c.sectorCode ?? c.coordinates?.sectorCode,
  },
  date_time_occurred: c.dateTimeOccurred,
  description: c.description,
  assigned_investigator_id: c.assignedInvestigatorId,
  assigned_investigator_name: c.assignedInvestigatorName,
  status: c.status,
  severity: c.severity,
  modus_operandi: c.modusOperandi || [],
  vehicle_details: c.vehicleDetails || null,
  suspect_phone_numbers: c.suspectPhoneNumbers || [],
  ip_address: c.ipAddress || null,
  linked_criminal_ids: c.linkedCriminalIds || [],
  evidence_ids: c.evidenceIds || [],
  victim_ids: c.victimIds || [],
  witness_ids: c.witnessIds || [],
});

// 4. Criminal Profile Mapper
export const mapCriminalFromDb = (row: any): CriminalProfile => ({
  id: row.id,
  codeName: row.code_name || row.codeName,
  legalName: row.legal_name || row.legalName,
  aliases: Array.isArray(row.aliases) ? row.aliases : [],
  photoUrl: row.photo_url || row.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
  dateOfBirth: row.date_of_birth || row.dateOfBirth || '1990-01-01',
  gender: row.gender || 'Male',
  height: row.height || '6 ft 0 in',
  build: row.build || 'Medium',
  scarsOrTattoos: Array.isArray(row.scars_or_tattoos) ? row.scars_or_tattoos : (row.scarsOrTattoos || []),
  threatLevel: row.threat_level || row.threatLevel || 'HIGH',
  modusOperandi: Array.isArray(row.modus_operandi) ? row.modus_operandi : (row.modusOperandi || []),
  pastConvictions: Array.isArray(row.past_convictions) ? row.past_convictions : (row.pastConvictions || []),
  knownAssociates: Array.isArray(row.known_associates) ? row.known_associates : (row.knownAssociates || []),
  status: row.status || 'WANTED',
  linkedCaseIds: Array.isArray(row.linked_case_ids) ? row.linked_case_ids : (row.linkedCaseIds || []),
});

export const mapCriminalToDb = (c: CriminalProfile) => ({
  id: c.id,
  code_name: c.codeName,
  legal_name: c.legalName,
  aliases: c.aliases || [],
  photo_url: c.photoUrl,
  date_of_birth: c.dateOfBirth,
  gender: c.gender,
  height: c.height,
  build: c.build,
  scars_or_tattoos: c.scarsOrTattoos || [],
  threat_level: c.threatLevel,
  modus_operandi: c.modusOperandi || [],
  past_convictions: c.pastConvictions || [],
  known_associates: c.knownAssociates || [],
  status: c.status,
  linked_case_ids: c.linkedCaseIds || [],
});

// 5. Evidence Item Mapper
export const mapEvidenceFromDb = (row: any): EvidenceItem => ({
  id: row.id,
  caseId: row.case_id || row.caseId,
  caseNumber: row.case_number || row.caseNumber,
  evidenceCode: row.evidence_code || row.evidenceCode,
  title: row.title,
  type: row.type || 'DOCUMENT',
  fileSize: row.file_size || row.fileSize || '1 MB',
  fileFormat: row.file_format || row.fileFormat || 'PDF',
  sha256Hash: row.sha256_hash || row.sha256Hash || '',
  collectedBy: row.collected_by || row.collectedBy || 'Officer',
  collectionDate: row.collection_date || row.collectionDate || new Date().toISOString(),
  storageLocation: row.storage_location || row.storageLocation || 'Secure Evidence Vault',
  isVerifiedIntegrity: typeof row.is_verified_integrity === 'boolean' ? row.is_verified_integrity : (row.isVerifiedIntegrity ?? true),
  custodyChain: Array.isArray(row.custody_chain) ? row.custody_chain : (row.custodyChain || []),
});

export const mapEvidenceToDb = (e: EvidenceItem) => ({
  id: e.id,
  case_id: e.caseId,
  case_number: e.caseNumber,
  evidence_code: e.evidenceCode,
  title: e.title,
  type: e.type,
  file_size: e.fileSize,
  file_format: e.fileFormat,
  sha256_hash: e.sha256Hash,
  collected_by: e.collectedBy,
  collection_date: e.collectionDate,
  storage_location: e.storageLocation,
  is_verified_integrity: e.isVerifiedIntegrity,
  custody_chain: e.custodyChain || [],
});

// 6. Victim Mapper
export const mapVictimFromDb = (row: any): Victim => ({
  id: row.id,
  caseId: row.case_id || row.caseId,
  name: row.name,
  age: row.age || 30,
  contactNumber: row.contact_number || row.contactNumber || '',
  address: row.address || '',
  statement: row.statement || '',
  protectionStatus: row.protection_status || row.protectionStatus || 'NONE',
  isConfidential: typeof row.is_confidential === 'boolean' ? row.is_confidential : Boolean(row.isConfidential),
});

export const mapVictimToDb = (v: Victim) => ({
  id: v.id,
  case_id: v.caseId,
  name: v.name,
  age: v.age,
  contact_number: v.contactNumber,
  address: v.address,
  statement: v.statement,
  protection_status: v.protectionStatus,
  is_confidential: v.isConfidential,
});

// 7. Witness Mapper
export const mapWitnessFromDb = (row: any): Witness => ({
  id: row.id,
  caseId: row.case_id || row.caseId,
  name: row.name,
  contactNumber: row.contact_number || row.contactNumber || '',
  statement: row.statement || '',
  credibilityRating: row.credibility_rating || row.credibilityRating || 'HIGH',
  isProtected: typeof row.is_protected === 'boolean' ? row.is_protected : Boolean(row.isProtected),
  depositionDate: row.deposition_date || row.depositionDate,
});

export const mapWitnessToDb = (w: Witness) => ({
  id: w.id,
  case_id: w.caseId,
  name: w.name,
  contact_number: w.contactNumber,
  statement: w.statement,
  credibility_rating: w.credibilityRating,
  is_protected: w.isProtected,
  deposition_date: w.depositionDate || null,
});

// 8. Investigation Note Mapper
export const mapNoteFromDb = (row: any): InvestigationNote => ({
  id: row.id,
  caseId: row.case_id || row.caseId,
  timestamp: row.timestamp || new Date().toISOString(),
  authorName: row.author_name || row.authorName || 'Lead Detective',
  authorRole: row.author_role || row.authorRole || 'INVESTIGATOR',
  content: row.content || '',
  category: row.category || 'LEAD',
});

export const mapNoteToDb = (n: InvestigationNote) => ({
  id: n.id,
  case_id: n.caseId,
  timestamp: n.timestamp,
  author_name: n.authorName,
  author_role: n.authorRole,
  content: n.content,
  category: n.category,
});

// 9. Pattern Alert Mapper
export const mapAlertFromDb = (row: any): PatternAlert => ({
  id: row.id,
  title: row.title,
  similarityScore: row.similarity_score ?? row.similarityScore ?? 80,
  matchedFactors: Array.isArray(row.matched_factors) ? row.matched_factors : (row.matchedFactors || []),
  primaryCaseId: row.primary_case_id || row.primaryCaseId || '',
  primaryFirNumber: row.primary_fir_number || row.primaryFirNumber || '',
  relatedCaseId: row.related_case_id || row.relatedCaseId || '',
  relatedFirNumber: row.related_fir_number || row.relatedFirNumber || '',
  detectionDate: row.detection_date || row.detectionDate || new Date().toISOString(),
  status: row.status || 'UNREVIEWED',
  suspectId: row.suspect_id || row.suspectId,
  suspectAlias: row.suspect_alias || row.suspectAlias,
});

export const mapAlertToDb = (a: PatternAlert) => ({
  id: a.id,
  title: a.title,
  similarity_score: a.similarityScore,
  matched_factors: a.matchedFactors || [],
  primary_case_id: a.primaryCaseId,
  primary_fir_number: a.primaryFirNumber,
  related_case_id: a.relatedCaseId,
  related_fir_number: a.relatedFirNumber,
  detection_date: a.detectionDate,
  status: a.status,
  suspect_id: a.suspectId || null,
  suspect_alias: a.suspectAlias || null,
});

// 10. Audit Log Mapper
export const mapAuditFromDb = (row: any): AuditLog => ({
  id: row.id,
  timestamp: row.timestamp || new Date().toISOString(),
  badgeNumber: row.badge_number || row.badgeNumber || 'BADGE-0000',
  userName: row.user_name || row.userName || 'System Officer',
  role: row.role || 'POLICE_OFFICER',
  action: row.action || 'ACTIVITY',
  module: row.module || 'AUTH',
  details: row.details || '',
  ipAddress: row.ip_address || row.ipAddress || '127.0.0.1',
});

export const mapAuditToDb = (l: AuditLog) => ({
  id: l.id,
  timestamp: l.timestamp,
  badge_number: l.badgeNumber,
  user_name: l.userName,
  role: l.role,
  action: l.action,
  module: l.module,
  details: l.details,
  ip_address: l.ipAddress,
});

// 11. Hotspot Sector Mapper
export const mapHotspotFromDb = (row: any): HotspotSector => ({
  id: row.id,
  name: row.name,
  code: row.code,
  riskLevel: row.risk_level || row.riskLevel || 'MODERATE',
  totalIncidents: row.total_incidents ?? row.totalIncidents ?? 0,
  primaryCrimeType: row.primary_crime_type || row.primaryCrimeType || 'General Crime',
  crimeCoordinates: row.crime_coordinates || {
    x: row.coord_x ?? 50,
    y: row.coord_y ?? 50,
  },
  activePatrolUnits: row.active_patrol_units ?? row.activePatrolUnits ?? 4,
});

export const mapHotspotToDb = (h: HotspotSector) => ({
  id: h.id,
  name: h.name,
  code: h.code,
  risk_level: h.riskLevel,
  total_incidents: h.totalIncidents,
  primary_crime_type: h.primaryCrimeType,
  coord_x: h.crimeCoordinates?.x || 50,
  coord_y: h.crimeCoordinates?.y || 50,
  active_patrol_units: h.activePatrolUnits,
});

/* ==========================================================================
   CRUD DATABASE OPERATIONS (Supabase direct client with resilient fallbacks)
   ========================================================================== */

// 1. Users API
export async function fetchUsers(): Promise<User[]> {
  if (!isSupabaseConfigured()) return INITIAL_USERS;
  try {
    const { data, error } = await supabase.from('users').select('*').order('name');
    if (error) throw error;
    return (data && data.length > 0) ? data.map(mapUserFromDb) : INITIAL_USERS;
  } catch (err) {
    console.warn('[Supabase] fetchUsers fallback to seed data:', err);
    return INITIAL_USERS;
  }
}

export async function createUser(user: User): Promise<User> {
  if (!isSupabaseConfigured()) return user;
  const { data, error } = await supabase.from('users').insert([mapUserToDb(user)]).select().single();
  if (error) {
    console.error('[Supabase] createUser error:', error);
    throw new Error(error.message);
  }
  return mapUserFromDb(data);
}

export async function updateUserStatus(userId: string): Promise<User> {
  if (!isSupabaseConfigured()) {
    const u = INITIAL_USERS.find(x => x.id === userId);
    return u ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : INITIAL_USERS[0];
  }
  // Read current status first
  const { data: current } = await supabase.from('users').select('status').eq('id', userId).single();
  const nextStatus = current?.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';

  const { data, error } = await supabase
    .from('users')
    .update({ status: nextStatus })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] updateUserStatus error:', error);
    throw new Error(error.message);
  }
  return mapUserFromDb(data);
}

// 2. FIRs API
export async function fetchFirs(): Promise<FIR[]> {
  if (!isSupabaseConfigured()) return INITIAL_FIRS;
  try {
    const { data, error } = await supabase
      .from('firs')
      .select('*')
      .order('filed_date_time', { ascending: false });
    if (error) throw error;
    return (data && data.length > 0) ? data.map(mapFirFromDb) : INITIAL_FIRS;
  } catch (err) {
    console.warn('[Supabase] fetchFirs fallback to seed data:', err);
    return INITIAL_FIRS;
  }
}

export async function createFir(fir: FIR): Promise<FIR> {
  if (!isSupabaseConfigured()) return fir;
  const { data, error } = await supabase.from('firs').insert([mapFirToDb(fir)]).select().single();
  if (error) {
    console.error('[Supabase] createFir error:', error);
    throw new Error(error.message);
  }
  return mapFirFromDb(data);
}

export async function updateFirStatus(firId: string, status: FirStatus, note: string): Promise<FIR> {
  if (!isSupabaseConfigured()) {
    const f = INITIAL_FIRS.find(x => x.id === firId);
    return f ? { ...f, status } : INITIAL_FIRS[0];
  }
  // Retrieve existing history array
  const { data: existing } = await supabase.from('firs').select('history, status').eq('id', firId).single();
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const updatedHistory = [
    {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(),
      timestamp: nowStr,
      updatedBy: 'Authorized Officer',
      changesSummary: note,
      status,
    },
    ...(Array.isArray(existing?.history) ? existing.history : []),
  ];

  const { data, error } = await supabase
    .from('firs')
    .update({ status, history: updatedHistory })
    .eq('id', firId)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] updateFirStatus error:', error);
    throw new Error(error.message);
  }
  return mapFirFromDb(data);
}

// 3. Crime Records API
export async function fetchCrimeRecords(): Promise<CrimeRecord[]> {
  if (!isSupabaseConfigured()) return INITIAL_CRIME_RECORDS;
  try {
    const { data, error } = await supabase
      .from('crime_records')
      .select('*')
      .order('date_time_occurred', { ascending: false });
    if (error) throw error;
    return (data && data.length > 0) ? data.map(mapCrimeFromDb) : INITIAL_CRIME_RECORDS;
  } catch (err) {
    console.warn('[Supabase] fetchCrimeRecords fallback to seed data:', err);
    return INITIAL_CRIME_RECORDS;
  }
}

export async function createCrimeRecord(crime: CrimeRecord): Promise<CrimeRecord> {
  if (!isSupabaseConfigured()) return crime;
  const { data, error } = await supabase
    .from('crime_records')
    .insert([mapCrimeToDb(crime)])
    .select()
    .single();
  if (error) {
    console.error('[Supabase] createCrimeRecord error:', error);
    throw new Error(error.message);
  }
  return mapCrimeFromDb(data);
}

export async function updateCrimeStatus(caseId: string, status: CrimeRecord['status']): Promise<CrimeRecord> {
  if (!isSupabaseConfigured()) {
    const c = INITIAL_CRIME_RECORDS.find(x => x.id === caseId);
    return c ? { ...c, status } : INITIAL_CRIME_RECORDS[0];
  }
  const { data, error } = await supabase
    .from('crime_records')
    .update({ status })
    .eq('id', caseId)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] updateCrimeStatus error:', error);
    throw new Error(error.message);
  }
  return mapCrimeFromDb(data);
}

// 4. Criminal Profiles API
export async function fetchCriminals(): Promise<CriminalProfile[]> {
  if (!isSupabaseConfigured()) return INITIAL_CRIMINALS;
  try {
    const { data, error } = await supabase
      .from('criminal_profiles')
      .select('*')
      .order('threat_level', { ascending: false });
    if (error) throw error;
    return (data && data.length > 0) ? data.map(mapCriminalFromDb) : INITIAL_CRIMINALS;
  } catch (err) {
    console.warn('[Supabase] fetchCriminals fallback to seed data:', err);
    return INITIAL_CRIMINALS;
  }
}

export async function createCriminalProfile(criminal: CriminalProfile): Promise<CriminalProfile> {
  if (!isSupabaseConfigured()) return criminal;
  const { data, error } = await supabase
    .from('criminal_profiles')
    .insert([mapCriminalToDb(criminal)])
    .select()
    .single();
  if (error) {
    console.error('[Supabase] createCriminalProfile error:', error);
    throw new Error(error.message);
  }
  return mapCriminalFromDb(data);
}

export async function updateCriminalProfile(criminal: CriminalProfile): Promise<CriminalProfile> {
  if (!isSupabaseConfigured()) return criminal;
  const { data, error } = await supabase
    .from('criminal_profiles')
    .update(mapCriminalToDb(criminal))
    .eq('id', criminal.id)
    .select()
    .single();
  if (error) {
    console.error('[Supabase] updateCriminalProfile error:', error);
    throw new Error(error.message);
  }
  return mapCriminalFromDb(data);
}

export async function deleteCriminalProfile(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;
  const { error } = await supabase.from('criminal_profiles').delete().eq('id', id);
  if (error) {
    console.error('[Supabase] deleteCriminalProfile error:', error);
    throw new Error(error.message);
  }
  return true;
}

// 5. Evidence Items API
export async function fetchEvidenceItems(): Promise<EvidenceItem[]> {
  if (!isSupabaseConfigured()) return INITIAL_EVIDENCE;
  try {
    const { data, error } = await supabase
      .from('evidence_items')
      .select('*')
      .order('collection_date', { ascending: false });
    if (error) throw error;
    return (data && data.length > 0) ? data.map(mapEvidenceFromDb) : INITIAL_EVIDENCE;
  } catch (err) {
    console.warn('[Supabase] fetchEvidenceItems fallback to seed data:', err);
    return INITIAL_EVIDENCE;
  }
}

export async function createEvidence(evidence: EvidenceItem): Promise<EvidenceItem> {
  if (!isSupabaseConfigured()) return evidence;
  const { data, error } = await supabase
    .from('evidence_items')
    .insert([mapEvidenceToDb(evidence)])
    .select()
    .single();
  if (error) {
    console.error('[Supabase] createEvidence error:', error);
    throw new Error(error.message);
  }
  return mapEvidenceFromDb(data);
}

export async function addEvidenceCustody(
  evidenceId: string,
  custodyEntry: EvidenceItem['custodyChain'][0]
): Promise<EvidenceItem> {
  if (!isSupabaseConfigured()) {
    const e = INITIAL_EVIDENCE.find(x => x.id === evidenceId);
    return e ? { ...e, custodyChain: [custodyEntry, ...e.custodyChain] } : INITIAL_EVIDENCE[0];
  }
  const { data: existing } = await supabase.from('evidence_items').select('custody_chain').eq('id', evidenceId).single();
  const updatedChain = [custodyEntry, ...(Array.isArray(existing?.custody_chain) ? existing.custody_chain : [])];

  const { data, error } = await supabase
    .from('evidence_items')
    .update({ custody_chain: updatedChain })
    .eq('id', evidenceId)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] addEvidenceCustody error:', error);
    throw new Error(error.message);
  }
  return mapEvidenceFromDb(data);
}

// 6. Victims API
export async function fetchVictims(): Promise<Victim[]> {
  if (!isSupabaseConfigured()) return INITIAL_VICTIMS;
  try {
    const { data, error } = await supabase.from('victims').select('*');
    if (error) throw error;
    return (data && data.length > 0) ? data.map(mapVictimFromDb) : INITIAL_VICTIMS;
  } catch (err) {
    console.warn('[Supabase] fetchVictims fallback to seed data:', err);
    return INITIAL_VICTIMS;
  }
}

export async function createVictim(victim: Victim): Promise<Victim> {
  if (!isSupabaseConfigured()) return victim;
  const { data, error } = await supabase.from('victims').insert([mapVictimToDb(victim)]).select().single();
  if (error) {
    console.error('[Supabase] createVictim error:', error);
    throw new Error(error.message);
  }
  return mapVictimFromDb(data);
}

// 7. Witnesses API
export async function fetchWitnesses(): Promise<Witness[]> {
  if (!isSupabaseConfigured()) return INITIAL_WITNESSES;
  try {
    const { data, error } = await supabase.from('witnesses').select('*');
    if (error) throw error;
    return (data && data.length > 0) ? data.map(mapWitnessFromDb) : INITIAL_WITNESSES;
  } catch (err) {
    console.warn('[Supabase] fetchWitnesses fallback to seed data:', err);
    return INITIAL_WITNESSES;
  }
}

export async function createWitness(witness: Witness): Promise<Witness> {
  if (!isSupabaseConfigured()) return witness;
  const { data, error } = await supabase.from('witnesses').insert([mapWitnessToDb(witness)]).select().single();
  if (error) {
    console.error('[Supabase] createWitness error:', error);
    throw new Error(error.message);
  }
  return mapWitnessFromDb(data);
}

// 8. Investigation Notes API
export async function fetchInvestigationNotes(): Promise<InvestigationNote[]> {
  if (!isSupabaseConfigured()) return INITIAL_INVESTIGATION_NOTES;
  try {
    const { data, error } = await supabase
      .from('investigation_notes')
      .select('*')
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return (data && data.length > 0) ? data.map(mapNoteFromDb) : INITIAL_INVESTIGATION_NOTES;
  } catch (err) {
    console.warn('[Supabase] fetchInvestigationNotes fallback to seed data:', err);
    return INITIAL_INVESTIGATION_NOTES;
  }
}

export async function createInvestigationNote(note: InvestigationNote): Promise<InvestigationNote> {
  if (!isSupabaseConfigured()) return note;
  const { data, error } = await supabase.from('investigation_notes').insert([mapNoteToDb(note)]).select().single();
  if (error) {
    console.error('[Supabase] createInvestigationNote error:', error);
    throw new Error(error.message);
  }
  return mapNoteFromDb(data);
}

// 9. Pattern Alerts API
export async function fetchPatternAlerts(): Promise<PatternAlert[]> {
  if (!isSupabaseConfigured()) return INITIAL_PATTERN_ALERTS;
  try {
    const { data, error } = await supabase
      .from('pattern_alerts')
      .select('*')
      .order('similarity_score', { ascending: false });
    if (error) throw error;
    return (data && data.length > 0) ? data.map(mapAlertFromDb) : INITIAL_PATTERN_ALERTS;
  } catch (err) {
    console.warn('[Supabase] fetchPatternAlerts fallback to seed data:', err);
    return INITIAL_PATTERN_ALERTS;
  }
}

export async function createPatternAlert(alert: PatternAlert): Promise<PatternAlert> {
  if (!isSupabaseConfigured()) return alert;
  const { data, error } = await supabase.from('pattern_alerts').insert([mapAlertToDb(alert)]).select().single();
  if (error) {
    console.error('[Supabase] createPatternAlert error:', error);
    throw new Error(error.message);
  }
  return mapAlertFromDb(data);
}

export async function updateAlertStatus(alertId: string, status: PatternAlert['status']): Promise<PatternAlert> {
  if (!isSupabaseConfigured()) {
    const a = INITIAL_PATTERN_ALERTS.find(x => x.id === alertId);
    return a ? { ...a, status } : INITIAL_PATTERN_ALERTS[0];
  }
  const { data, error } = await supabase
    .from('pattern_alerts')
    .update({ status })
    .eq('id', alertId)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] updateAlertStatus error:', error);
    throw new Error(error.message);
  }
  return mapAlertFromDb(data);
}

// 10. Audit Logs API
export async function fetchAuditLogs(): Promise<AuditLog[]> {
  if (!isSupabaseConfigured()) return INITIAL_AUDIT_LOGS;
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);
    if (error) throw error;
    return (data && data.length > 0) ? data.map(mapAuditFromDb) : INITIAL_AUDIT_LOGS;
  } catch (err) {
    console.warn('[Supabase] fetchAuditLogs fallback to seed data:', err);
    return INITIAL_AUDIT_LOGS;
  }
}

export async function createAuditLog(log: AuditLog): Promise<AuditLog> {
  if (!isSupabaseConfigured()) return log;
  const { data, error } = await supabase.from('audit_logs').insert([mapAuditToDb(log)]).select().single();
  if (error) {
    console.warn('[Supabase] createAuditLog non-fatal warning:', error.message);
    return log;
  }
  return mapAuditFromDb(data);
}

// 11. Hotspot Sectors API (Fallback to INITIAL_HOTSPOTS if table not yet created)
export async function fetchHotspotSectors(): Promise<HotspotSector[]> {
  if (!isSupabaseConfigured()) return INITIAL_HOTSPOTS;
  try {
    const { data, error } = await supabase.from('hotspot_sectors').select('*');
    if (error || !data || data.length === 0) return INITIAL_HOTSPOTS;
    return data.map(mapHotspotFromDb);
  } catch {
    return INITIAL_HOTSPOTS;
  }
}
