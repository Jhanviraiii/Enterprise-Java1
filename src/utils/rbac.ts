import { UserRole } from '../types';

export type NormalizedRole = 'ADMIN' | 'INVESTIGATOR' | 'POLICE' | 'FORENSICS' | 'ANALYST';

export type Permission =
  | 'dashboard.view'
  | 'analytics.view'
  | 'pattern.view'
  | 'pattern.manage'
  | 'intel.view'
  | 'firs.view'
  | 'firs.create'
  | 'firs.update'
  | 'crimes.view'
  | 'crimes.create'
  | 'crimes.update'
  | 'crimes.delete'
  | 'criminals.view'
  | 'criminals.create'
  | 'criminals.update'
  | 'criminals.delete'
  | 'cases.view'
  | 'cases.manage'
  | 'evidence.view'
  | 'evidence.create'
  | 'evidence.update'
  | 'evidence.verify'
  | 'evidence.delete'
  | 'investigation.view'
  | 'investigation.create_note'
  | 'people.view'
  | 'people.create'
  | 'gis.view'
  | 'gis.patrol'
  | 'reports.view'
  | 'reports.generate'
  | 'users.view'
  | 'users.manage'
  | 'audit.view'
  | 'settings.manage';

export const normalizeRole = (role: UserRole): NormalizedRole => {
  if (role === 'POLICE_OFFICER' || role === 'POLICE') return 'POLICE';
  if (role === 'FORENSIC_OFFICER' || role === 'FORENSICS') return 'FORENSICS';
  if (role === 'INVESTIGATOR') return 'INVESTIGATOR';
  if (role === 'ANALYST') return 'ANALYST';
  return 'ADMIN';
};

export const ROLE_PERMISSIONS: Record<NormalizedRole, Permission[]> = {
  ADMIN: [
    'dashboard.view',
    'analytics.view',
    'pattern.view',
    'pattern.manage',
    'intel.view',
    'firs.view',
    'firs.create',
    'firs.update',
    'crimes.view',
    'crimes.create',
    'crimes.update',
    'crimes.delete',
    'criminals.view',
    'criminals.create',
    'criminals.update',
    'criminals.delete',
    'cases.view',
    'cases.manage',
    'evidence.view',
    'evidence.create',
    'evidence.update',
    'evidence.verify',
    'evidence.delete',
    'investigation.view',
    'investigation.create_note',
    'people.view',
    'people.create',
    'gis.view',
    'gis.patrol',
    'reports.view',
    'reports.generate',
    'users.view',
    'users.manage',
    'audit.view',
    'settings.manage',
  ],

  INVESTIGATOR: [
    'dashboard.view',
    'analytics.view',
    'pattern.view',
    'pattern.manage',
    'intel.view',
    'firs.view',
    'firs.create',
    'firs.update',
    'crimes.view',
    'crimes.create',
    'crimes.update',
    'criminals.view',
    'criminals.create',
    'criminals.update',
    'cases.view',
    'cases.manage',
    'evidence.view',
    'investigation.view',
    'investigation.create_note',
    'people.view',
    'people.create',
    'gis.view',
    'reports.view',
    'reports.generate',
  ],

  POLICE: [
    'dashboard.view',
    'analytics.view',
    'gis.view',
    'gis.patrol',
    'firs.view',
    'firs.create',
    'crimes.view',
    'crimes.update',
    'people.view',
    'people.create',
    'reports.view',
    'reports.generate',
  ],

  FORENSICS: [
    'dashboard.view',
    'analytics.view',
    'intel.view',
    'crimes.view',
    'evidence.view',
    'evidence.create',
    'evidence.update',
    'evidence.verify',
    'gis.view',
    'reports.view',
    'reports.generate',
  ],

  ANALYST: [
    'dashboard.view',
    'analytics.view',
    'pattern.view',
    'intel.view',
    'firs.view',
    'crimes.view',
    'gis.view',
    'reports.view',
    'reports.generate',
  ],
};

export const hasPermission = (role: UserRole, permission: Permission): boolean => {
  const norm = normalizeRole(role);
  return ROLE_PERMISSIONS[norm]?.includes(permission) ?? false;
};

// Module to required permission mappings
export const MODULE_PERMISSIONS: Record<string, Permission> = {
  analytics: 'analytics.view',
  pattern: 'pattern.view',
  iptracing: 'intel.view',
  loganalysis: 'intel.view',
  firs: 'firs.view',
  crimes: 'crimes.view',
  criminals: 'criminals.view',
  evidence: 'evidence.view',
  investigation: 'investigation.view',
  people: 'people.view',
  reports: 'reports.view',
  users: 'users.manage',
};

export const canAccessModule = (role: UserRole, moduleId: string): boolean => {
  const requiredPerm = MODULE_PERMISSIONS[moduleId];
  if (!requiredPerm) return true;
  return hasPermission(role, requiredPerm);
};

export const getRoleBadge = (
  role: UserRole
): { title: string; badge: string; description: string; color: string; bg: string } => {
  const norm = normalizeRole(role);
  switch (norm) {
    case 'ADMIN':
      return {
        title: 'System Administrator',
        badge: 'ADMIN',
        description: 'Full unconstrained system management, user CRUD, and security audit logs.',
        color: 'text-purple-400 border-purple-500/30',
        bg: 'bg-purple-500/10',
      };
    case 'INVESTIGATOR':
      return {
        title: 'Lead Detective',
        badge: 'INVESTIGATOR',
        description: 'Assigned case files, suspect dossiers, pattern engine, and case diary.',
        color: 'text-amber-400 border-amber-500/30',
        bg: 'bg-amber-500/10',
      };
    case 'POLICE':
      return {
        title: 'Police Patrol Officer',
        badge: 'POLICE',
        description: 'Patrol telemetry, GIS incident markers, FIR registration, and field navigation.',
        color: 'text-blue-400 border-blue-500/30',
        bg: 'bg-blue-500/10',
      };
    case 'FORENSICS':
      return {
        title: 'Forensic Lab Analyst',
        badge: 'FORENSICS',
        description: 'Digital evidence vault, SHA-256 integrity verification, and chain of custody.',
        color: 'text-emerald-400 border-emerald-500/30',
        bg: 'bg-emerald-500/10',
      };
    case 'ANALYST':
      return {
        title: 'Senior Intelligence Analyst',
        badge: 'ANALYST',
        description: 'Crime velocity metrics, spatial hotspot radars, pattern overview, and reports.',
        color: 'text-cyan-400 border-cyan-500/30',
        bg: 'bg-cyan-500/10',
      };
  }
};
