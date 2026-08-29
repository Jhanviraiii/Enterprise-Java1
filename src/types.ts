export type UserRole =
  | 'ADMIN'
  | 'INVESTIGATOR'
  | 'POLICE'
  | 'FORENSICS'
  | 'ANALYST'
  | 'POLICE_OFFICER'
  | 'FORENSIC_OFFICER';

export interface User {
  id: string;
  badgeNumber: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl: string;
  status: 'ACTIVE' | 'SUSPENDED';
  lastLogin: string;
}

export type FirStatus = 'DRAFT' | 'FILED' | 'UNDER_REVIEW' | 'TRANSFERRED_TO_INVESTIGATION' | 'CLOSED';
export type FirPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface FirVersion {
  id: string;
  timestamp: string;
  updatedBy: string;
  changesSummary: string;
  status: FirStatus;
}

export interface FIR {
  id: string;
  firNumber: string; // e.g., FIR-2026-08942
  title: string;
  incidentType: string;
  complainantName: string;
  complainantContact: string;
  district: string;
  locationDetails: string;
  incidentDateTime: string;
  filedDateTime: string;
  priority: FirPriority;
  status: FirStatus;
  description: string;
  reportingOfficerId: string;
  reportingOfficerName: string;
  assignedInvestigatorId?: string;
  assignedInvestigatorName?: string;
  history: FirVersion[];
}

export type CaseStatus = 'OPEN' | 'UNDER_INVESTIGATION' | 'SOLVED' | 'CLOSED';

export interface CrimeRecord {
  id: string;
  caseNumber: string; // e.g., CR-2026-4410
  firId: string;
  firNumber: string;
  title: string;
  crimeType: string;
  district: string;
  sectorCode?: string; // e.g. SEC-101, SEC-102, SEC-103, SEC-104, SEC-105
  locationAddress: string;
  landmark?: string;
  nearestPoliceStation?: string;
  latitude?: number;
  longitude?: number;
  coordinates: {
    x: number;
    y: number;
    lat?: number;
    lng?: number;
    landmark?: string;
    nearestStation?: string;
    sectorCode?: string;
  };
  dateTimeOccurred: string;
  description: string;
  assignedInvestigatorId: string;
  assignedInvestigatorName: string;
  status: CaseStatus;
  severity: 'MINOR' | 'MODERATE' | 'SEVERE' | 'CRITICAL';
  modusOperandi: string[];
  vehicleDetails?: string;
  suspectPhoneNumbers?: string[];
  ipAddress?: string;
  linkedCriminalIds: string[];
  evidenceIds: string[];
  victimIds: string[];
  witnessIds: string[];
}

export interface CriminalProfile {
  id: string;
  codeName: string;
  legalName: string;
  aliases: string[];
  photoUrl: string;
  dateOfBirth: string;
  gender: string;
  height: string;
  build: string;
  scarsOrTattoos: string[];
  threatLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  modusOperandi: string[];
  pastConvictions: string[];
  knownAssociates: string[];
  status: 'WANTED' | 'IN_CUSTODY' | 'UNDER_SURVEILLANCE' | 'CLEARED';
  linkedCaseIds: string[];
}

export interface Victim {
  id: string;
  caseId: string;
  name: string;
  age: number;
  contactNumber: string;
  address: string;
  statement: string;
  protectionStatus: 'NONE' | 'REQUESTED' | 'ACTIVE_PROTECTION';
  isConfidential: boolean;
}

export interface Witness {
  id: string;
  caseId: string;
  name: string;
  contactNumber: string;
  statement: string;
  credibilityRating: 'HIGH' | 'MODERATE' | 'LOW';
  isProtected: boolean;
  depositionDate?: string;
}

export interface ChainOfCustodyEntry {
  id: string;
  timestamp: string;
  handledBy: string;
  badgeNumber: string;
  action: 'UPLOADED' | 'TRANSFER_TO_LAB' | 'ANALYSIS_COMPLETE' | 'PRESENTED_IN_COURT' | 'ARCHIVED';
  notes: string;
}

export interface EvidenceItem {
  id: string;
  caseId: string;
  caseNumber: string;
  evidenceCode: string; // e.g., EVD-2026-901
  title: string;
  type: 'CCTV_VIDEO' | 'FINGERPRINT' | 'DIGITAL_FORENSIC' | 'AUDIO_RECORDING' | 'WEAPON_LOG' | 'DOCUMENT';
  fileSize: string;
  fileFormat: string;
  sha256Hash: string; // Real computed hash
  collectedBy: string;
  collectionDate: string;
  storageLocation: string;
  isVerifiedIntegrity: boolean;
  custodyChain: ChainOfCustodyEntry[];
}

export interface InvestigationNote {
  id: string;
  caseId: string;
  timestamp: string;
  authorName: string;
  authorRole: string;
  content: string;
  category: 'LEAD' | 'INTERROGATION' | 'FORENSIC_UPDATE' | 'SURVEILLANCE' | 'CASE_DECISION';
}

export interface PatternAlert {
  id: string;
  title: string;
  similarityScore: number; // e.g. 94%
  matchedFactors: string[]; // ['Modus Operandi', 'Location Radius (1.2km)', 'Vehicle Model (Blue Sedan)']
  primaryCaseId: string;
  primaryFirNumber: string;
  relatedCaseId: string;
  relatedFirNumber: string;
  detectionDate: string;
  status: 'UNREVIEWED' | 'CONFIRMED' | 'DISMISSED';
  suspectId?: string;
  suspectAlias?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  badgeNumber: string;
  userName: string;
  role: UserRole;
  action: string;
  module: 'AUTH' | 'USER' | 'FIR' | 'CRIME' | 'CRIMINAL' | 'EVIDENCE' | 'INVESTIGATION' | 'REPORT';
  details: string;
  ipAddress: string;
}

export interface HotspotSector {
  id: string;
  name: string;
  code: string;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  totalIncidents: number;
  primaryCrimeType: string;
  crimeCoordinates: { x: number; y: number }; // SVG map percentage positions
  activePatrolUnits: number;
}
