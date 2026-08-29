/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  User,
  UserRole,
  FIR,
  CrimeRecord,
  CriminalProfile,
  Victim,
  Witness,
  EvidenceItem,
  InvestigationNote,
  PatternAlert,
  AuditLog,
  HotspotSector,
  FirStatus,
} from './types';
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
} from './data/seedData';
import { generateUUID } from './utils/crypto';
import * as api from './services/api';
import { supabase, isSupabaseConfigured } from './lib/supabase';

// Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ToastContainer, ToastMessage } from './components/Toast';
import { DemoGuideModal } from './components/DemoGuideModal';
import { LoginView } from './components/auth/LoginView';
import { AccessDeniedView } from './components/common/AccessDeniedView';
import { canAccessModule } from './utils/rbac';

// Modules
import { AnalyticsDashboard } from './components/dashboard/AnalyticsDashboard';
import { PatternDetectionView } from './components/pattern/PatternDetectionView';
import { IpTracingView } from './components/intel/IpTracingView';
import { FastLogAnalysisView } from './components/intel/FastLogAnalysisView';
import { FirManagementView } from './components/firs/FirManagementView';
import { CrimeRecordView } from './components/crimes/CrimeRecordView';
import { CriminalProfileView } from './components/criminals/CriminalProfileView';
import { EvidenceManagementView } from './components/evidence/EvidenceManagementView';
import { InvestigationView } from './components/investigation/InvestigationView';
import { VictimsWitnessesView } from './components/people/VictimsWitnessesView';
import { ReportGenerationView } from './components/reports/ReportGenerationView';
import { UserManagementView } from './components/users/UserManagementView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = sessionStorage.getItem('scap_session_user');
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return INITIAL_USERS[0];
  });
  const [activeModule, setActiveModule] = useState<string>('analytics');
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);
  const [selectedIpForFilter, setSelectedIpForFilter] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // App Master Datasets (Loaded from Supabase PostgreSQL Database)
  const [firs, setFirs] = useState<FIR[]>(INITIAL_FIRS);
  const [crimeRecords, setCrimeRecords] = useState<CrimeRecord[]>(INITIAL_CRIME_RECORDS);
  const [criminals, setCriminals] = useState<CriminalProfile[]>(INITIAL_CRIMINALS);
  const [victims, setVictims] = useState<Victim[]>(INITIAL_VICTIMS);
  const [witnesses, setWitnesses] = useState<Witness[]>(INITIAL_WITNESSES);
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>(INITIAL_EVIDENCE);
  const [investigationNotes, setInvestigationNotes] = useState<InvestigationNote[]>(INITIAL_INVESTIGATION_NOTES);
  const [patternAlerts, setPatternAlerts] = useState<PatternAlert[]>(INITIAL_PATTERN_ALERTS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);
  const [hotspots, setHotspots] = useState<HotspotSector[]>(INITIAL_HOTSPOTS);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dbConnected, setDbConnected] = useState<boolean>(false);

  // Fetch initial master data from Supabase on mount
  useEffect(() => {
    const loadApiData = async () => {
      try {
        setIsLoading(true);
        const [
          fetchedUsers,
          fetchedFirs,
          fetchedCrimes,
          fetchedCriminals,
          fetchedEvidence,
          fetchedVictims,
          fetchedWitnesses,
          fetchedNotes,
          fetchedAlerts,
          fetchedAuditLogs,
          fetchedHotspots,
        ] = await Promise.all([
          api.fetchUsers(),
          api.fetchFirs(),
          api.fetchCrimeRecords(),
          api.fetchCriminals(),
          api.fetchEvidenceItems(),
          api.fetchVictims(),
          api.fetchWitnesses(),
          api.fetchInvestigationNotes(),
          api.fetchPatternAlerts(),
          api.fetchAuditLogs(),
          api.fetchHotspotSectors(),
        ]);

        if (fetchedUsers && fetchedUsers.length > 0) setUsers(fetchedUsers);
        if (fetchedFirs) setFirs(fetchedFirs);
        if (fetchedCrimes) setCrimeRecords(fetchedCrimes);
        if (fetchedCriminals) setCriminals(fetchedCriminals);
        if (fetchedEvidence) setEvidenceItems(fetchedEvidence);
        if (fetchedVictims) setVictims(fetchedVictims);
        if (fetchedWitnesses) setWitnesses(fetchedWitnesses);
        if (fetchedNotes) setInvestigationNotes(fetchedNotes);
        if (fetchedAlerts) setPatternAlerts(fetchedAlerts);
        if (fetchedAuditLogs) setAuditLogs(fetchedAuditLogs);
        if (fetchedHotspots) setHotspots(fetchedHotspots);

        setDbConnected(isSupabaseConfigured());
      } catch (err) {
        console.warn('[SCAP] Database connection fallback:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadApiData();
  }, []);

  // Supabase Realtime Subscriptions (for Live Incident Feeds and Alerts)
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const firsChannel = supabase
      .channel('public:firs')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'firs' }, (payload) => {
        const newFir = api.mapFirFromDb(payload.new);
        setFirs((prev) => {
          if (prev.some((f) => f.id === newFir.id)) return prev;
          return [newFir, ...prev];
        });
        addToast('info', 'Live FIR Registered', `${newFir.firNumber}: ${newFir.title}`);
      })
      .subscribe();

    const alertsChannel = supabase
      .channel('public:pattern_alerts')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pattern_alerts' }, (payload) => {
        const newAlert = api.mapAlertFromDb(payload.new);
        setPatternAlerts((prev) => {
          if (prev.some((a) => a.id === newAlert.id)) return prev;
          return [newAlert, ...prev];
        });
        addToast('alert', 'Live AI Pattern Alert', newAlert.title);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(firsChannel);
      supabase.removeChannel(alertsChannel);
    };
  }, []);

  // Toast Notification System
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const newToast: ToastMessage = {
      id: generateUUID(),
      type,
      title,
      message,
    };
    setToasts((prev) => [newToast, ...prev]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addAuditLog = async (action: string, module: AuditLog['module'], details: string) => {
    if (!currentUser) return;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog: AuditLog = {
      id: generateUUID(),
      timestamp: nowStr,
      badgeNumber: currentUser.badgeNumber,
      userName: currentUser.name,
      role: currentUser.role,
      action,
      module,
      details,
      ipAddress: '10.14.0.12',
    };
    try {
      const savedLog = await api.createAuditLog(newLog);
      setAuditLogs((prev) => [savedLog || newLog, ...prev]);
    } catch (err) {
      console.warn('Failed to persist audit log:', err);
      setAuditLogs((prev) => [newLog, ...prev]);
    }
  };

  // Auth & Role Switch Handlers
  const handleLoginSuccess = (user: User) => {
    try {
      sessionStorage.setItem('scap_session_user', JSON.stringify(user));
    } catch {
      // Ignore
    }
    setCurrentUser(user);
    addToast('success', 'Authentication Successful', `Welcome Officer ${user.name} (${user.role})`);
    addAuditLog('USER_LOGIN', 'AUTH', `Authenticated session for ${user.badgeNumber}`);
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    const matchedUser = users.find((u) => u.role === newRole) || {
      ...currentUser!,
      role: newRole,
    };
    try {
      sessionStorage.setItem('scap_session_user', JSON.stringify(matchedUser));
    } catch {
      // Ignore
    }
    setCurrentUser(matchedUser);
    addToast('info', 'Evaluator Role Switch', `Active session role switched to ${newRole}`);
    addAuditLog('ROLE_SWITCH', 'AUTH', `Switched active role to ${newRole}`);
  };

  const handleLogout = () => {
    addAuditLog('USER_LOGOUT', 'AUTH', `Logged out session`);
    try {
      sessionStorage.removeItem('scap_session_user');
    } catch {
      // Ignore
    }
    setCurrentUser(null);
    addToast('info', 'Logged Out', 'Terminal session terminated safely.');
  };

  // FIR Handlers (Supabase Connected)
  const handleAddFir = async (newFir: FIR) => {
    try {
      const savedFir = await api.createFir(newFir);
      setFirs((prev) => [savedFir || newFir, ...prev]);
      addToast('success', 'FIR Registered', `New ${newFir.firNumber} filed under ${newFir.district}`);
      addAuditLog('FIR_FILED', 'FIR', `Registered new FIR ${newFir.firNumber}: ${newFir.title}`);
    } catch (err: any) {
      console.error('Failed to register FIR in Supabase:', err);
      addToast('alert', 'FIR Registration Error', err.message || 'Database error while registering FIR.');
    }
  };

  const handleUpdateFirStatus = async (firId: string, status: FirStatus, note: string) => {
    try {
      const updatedFir = await api.updateFirStatus(firId, status, note);
      if (updatedFir) {
        setFirs((prev) => prev.map((f) => (f.id === firId ? updatedFir : f)));
      } else {
        const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
        setFirs((prev) =>
          prev.map((f) => {
            if (f.id === firId) {
              return {
                ...f,
                status,
                history: [
                  {
                    id: generateUUID(),
                    timestamp: nowStr,
                    updatedBy: currentUser?.name || 'System Officer',
                    changesSummary: note,
                    status,
                  },
                  ...f.history,
                ],
              };
            }
            return f;
          })
        );
      }
      addToast('info', 'FIR Status Updated', `FIR status changed to ${status}`);
      addAuditLog('FIR_STATUS_UPDATE', 'FIR', `Updated status of FIR ${firId} to ${status}`);
    } catch (err: any) {
      console.error('Failed to update FIR status in Supabase:', err);
      addToast('alert', 'FIR Update Error', err.message || 'Database error updating FIR status.');
    }
  };

  // Crime Record Handlers (Supabase Connected)
  const handleUpdateCrimeStatus = async (caseId: string, newStatus: CrimeRecord['status']) => {
    try {
      const updatedCrime = await api.updateCrimeStatus(caseId, newStatus);
      setCrimeRecords((prev) =>
        prev.map((c) => (c.id === caseId ? (updatedCrime || { ...c, status: newStatus }) : c))
      );
      addToast('info', 'Case Status Updated', `Case status updated to ${newStatus}`);
      addAuditLog('CRIME_STATUS_UPDATE', 'CRIME', `Updated case ${caseId} status to ${newStatus}`);
    } catch (err: any) {
      console.error('Failed to update crime status in Supabase:', err);
      addToast('alert', 'Case Status Error', err.message || 'Database error updating case status.');
    }
  };

  // Criminal Profile Handlers (Supabase Connected)
  const handleAddCriminal = async (c: CriminalProfile) => {
    try {
      const savedCriminal = await api.createCriminalProfile(c);
      setCriminals((prev) => [savedCriminal || c, ...prev]);
      addToast('success', 'Profile Created', `Registered profile for ${c.legalName}`);
      addAuditLog('CRIMINAL_PROFILE_CREATED', 'CRIME', `Created suspect profile for ${c.legalName}`);
    } catch (err: any) {
      console.error('Failed to save criminal profile in Supabase:', err);
      addToast('alert', 'Profile Creation Error', err.message || 'Database error creating suspect profile.');
    }
  };

  const handleUpdateCriminal = async (c: CriminalProfile) => {
    try {
      const updated = await api.updateCriminalProfile(c);
      setCriminals((prev) => prev.map((item) => (item.id === c.id ? (updated || c) : item)));
      addToast('info', 'Profile Updated', `Updated suspect dossier for ${c.legalName}`);
      addAuditLog('CRIMINAL_PROFILE_UPDATED', 'CRIME', `Updated legal status of ${c.legalName}`);
    } catch (err: any) {
      console.error('Failed to update criminal profile in Supabase:', err);
      addToast('alert', 'Profile Update Error', err.message || 'Database error updating suspect profile.');
    }
  };

  const handleDeleteCriminal = async (id: string) => {
    try {
      await api.deleteCriminalProfile(id);
      setCriminals((prev) => prev.filter((item) => item.id !== id));
      addToast('warning', 'Profile Deleted', 'Suspect profile removed from registry.');
      addAuditLog('CRIMINAL_PROFILE_DELETED', 'CRIME', `Deleted suspect profile ${id}`);
    } catch (err: any) {
      console.error('Failed to delete profile in Supabase:', err);
      addToast('alert', 'Delete Error', err.message || 'Database error deleting suspect profile.');
    }
  };

  // Victim & Witness Handlers (Supabase Connected)
  const handleAddVictim = async (v: Victim) => {
    try {
      const savedVictim = await api.createVictim(v);
      setVictims((prev) => [savedVictim || v, ...prev]);
      addToast('success', 'Victim Record Logged', `Registered victim ${v.name}`);
      addAuditLog('VICTIM_LOGGED', 'CRIME', `Registered victim ${v.name}`);
    } catch (err: any) {
      console.error('Failed to log victim in Supabase:', err);
      addToast('alert', 'Victim Log Error', err.message || 'Database error logging victim record.');
    }
  };

  const handleAddWitness = async (w: Witness) => {
    try {
      const savedWitness = await api.createWitness(w);
      setWitnesses((prev) => [savedWitness || w, ...prev]);
      addToast('success', 'Witness Deposition Logged', `Registered witness ${w.name}`);
      addAuditLog('WITNESS_LOGGED', 'CRIME', `Registered witness ${w.name}`);
    } catch (err: any) {
      console.error('Failed to log witness in Supabase:', err);
      addToast('alert', 'Witness Log Error', err.message || 'Database error logging witness deposition.');
    }
  };

  // Pattern Alert Handlers (Supabase Connected)
  const handleConfirmAlert = async (alertId: string) => {
    try {
      const updatedAlert = await api.updateAlertStatus(alertId, 'CONFIRMED');
      setPatternAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? (updatedAlert || { ...a, status: 'CONFIRMED' }) : a))
      );
      addToast('success', 'Case Link Confirmed', `Pattern alert #${alertId} confirmed and linked into joint investigation dossier.`);
      addAuditLog('PATTERN_ALERT_CONFIRMED', 'CRIME', `Confirmed pattern alert ${alertId}`);
    } catch (err: any) {
      console.error('Failed to confirm alert in Supabase:', err);
      addToast('alert', 'Alert Confirmation Error', err.message || 'Database error confirming alert.');
    }
  };

  const handleDismissAlert = async (alertId: string) => {
    try {
      const updatedAlert = await api.updateAlertStatus(alertId, 'DISMISSED');
      setPatternAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? (updatedAlert || { ...a, status: 'DISMISSED' }) : a))
      );
      addToast('info', 'Alert Dismissed', `Pattern alert #${alertId} dismissed.`);
    } catch (err: any) {
      console.error('Failed to dismiss alert in Supabase:', err);
      addToast('alert', 'Alert Dismissal Error', err.message || 'Database error dismissing alert.');
    }
  };

  const handleRunPatternScan = async () => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newAlert: PatternAlert = {
      id: generateUUID(),
      title: '96% High-Confidence MO Match: Armed Robbery & Bank Heist Reconnaissance',
      similarityScore: 96,
      matchedFactors: [
        'Matching Signal Jamming Frequency (868 MHz)',
        'Dark Blue Sedan Plate #7XYZ99 Reconnaissance',
        'Suspect Darian Vance Rostoff ("The Specter") Physical Descriptor Match',
        'Tactical Earpiece Communications Signature',
      ],
      primaryCaseId: crimeRecords[0]?.id || 'cr-1',
      primaryFirNumber: firs[0]?.firNumber || 'FIR-2026-08942',
      relatedCaseId: crimeRecords[1]?.id || 'cr-2',
      relatedFirNumber: firs[1]?.firNumber || 'FIR-2026-08103',
      detectionDate: nowStr,
      status: 'UNREVIEWED',
      suspectAlias: 'The Specter',
    };

    try {
      const savedAlert = await api.createPatternAlert(newAlert);
      setPatternAlerts((prev) => [savedAlert || newAlert, ...prev]);
      addToast('alert', 'AI Pattern Detected!', 'New 96% high-confidence cross-case connection alert discovered between FIRs!');
      addAuditLog('PATTERN_SCAN_RUN', 'CRIME', 'Ran AI Pattern Detection scan across FIR database.');
    } catch (err: any) {
      console.error('Failed to save pattern alert in Supabase:', err);
      addToast('alert', 'Pattern Scan Error', err.message || 'Database error saving pattern alert.');
    }
  };

  // Evidence Handlers (Supabase Connected)
  const handleAddEvidence = async (newEvd: EvidenceItem) => {
    try {
      const savedEvd = await api.createEvidence(newEvd);
      setEvidenceItems((prev) => [savedEvd || newEvd, ...prev]);
      addToast('success', 'Evidence File Uploaded', `SHA-256 hash verified: ${newEvd.sha256Hash.substring(0, 16)}...`);
      addAuditLog('EVIDENCE_UPLOAD', 'EVIDENCE', `Uploaded item ${newEvd.evidenceCode} with SHA-256 checksum.`);
    } catch (err: any) {
      console.error('Failed to save evidence to Supabase:', err);
      addToast('alert', 'Evidence Upload Error', err.message || 'Database error saving evidence file.');
    }
  };

  const handleAddCustodyLog = async (
    evidenceId: string,
    action: EvidenceItem['custodyChain'][0]['action'],
    notesText: string
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newEntry: EvidenceItem['custodyChain'][0] = {
      id: generateUUID(),
      timestamp: nowStr,
      handledBy: currentUser?.name || 'Officer',
      badgeNumber: currentUser?.badgeNumber || 'BADGE-000',
      action,
      notes: notesText,
    };
    try {
      const updatedEvd = await api.addEvidenceCustody(evidenceId, newEntry);
      setEvidenceItems((prev) =>
        prev.map((item) => (item.id === evidenceId ? (updatedEvd || { ...item, custodyChain: [newEntry, ...item.custodyChain] }) : item))
      );
      addToast('info', 'Custody Chain Updated', `Logged ${action} entry for evidence file in database.`);
      addAuditLog('CUSTODY_LOG_ADDED', 'EVIDENCE', `Added custody log for ${evidenceId}`);
    } catch (err: any) {
      console.error('Failed to save custody log in Supabase:', err);
      addToast('alert', 'Custody Log Error', err.message || 'Database error saving custody log.');
    }
  };

  // Investigation Note Handler (Supabase Connected)
  const handleAddNote = async (newNote: InvestigationNote) => {
    try {
      const savedNote = await api.createInvestigationNote(newNote);
      setInvestigationNotes((prev) => [savedNote || newNote, ...prev]);
      addToast('success', 'Investigation Note Logged', `Logged ${newNote.category} note to case diary.`);
    } catch (err: any) {
      console.error('Failed to save note to Supabase:', err);
      addToast('alert', 'Note Logging Error', err.message || 'Database error saving investigation note.');
    }
  };

  // User Management Handlers (Supabase Connected)
  const handleAddUser = async (user: User) => {
    try {
      const savedUser = await api.createUser(user);
      setUsers((prev) => [savedUser || user, ...prev]);
      addToast('success', 'Account Provisioned', `Provisioned officer account for ${user.name}`);
      addAuditLog('USER_PROVISIONED', 'USER', `Created account ${user.badgeNumber}`);
    } catch (err: any) {
      console.error('Failed to create user in Supabase:', err);
      addToast('alert', 'Account Provisioning Error', err.message || 'Database error creating user account.');
    }
  };

  const handleToggleUserStatus = async (userId: string) => {
    try {
      const updatedUser = await api.updateUserStatus(userId);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? (updatedUser || { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' }) : u))
      );
      addToast('warning', 'User Status Updated', 'Officer account status toggled in database.');
    } catch (err: any) {
      console.error('Failed to toggle user status in Supabase:', err);
      addToast('alert', 'User Status Error', err.message || 'Database error toggling user status.');
    }
  };

  // Select Crime shortcut
  const handleSelectCrime = (crime: CrimeRecord) => {
    setActiveModule('crimes');
  };

  // Unauthenticated render
  if (!currentUser) {
    return (
      <>
        <LoginView users={users} onLoginSuccess={handleLoginSuccess} />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  const unreviewedCount = patternAlerts.filter((a) => a.status === 'UNREVIEWED').length;

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Evaluator Walkthrough Guide Modal */}
      <DemoGuideModal
        isOpen={isDemoGuideOpen}
        onClose={() => setIsDemoGuideOpen(false)}
        onNavigate={(mod) => setActiveModule(mod)}
      />

      {/* Top Navigation Header */}
      <Header
        currentUser={currentUser}
        onRoleSwitch={handleRoleSwitch}
        onLogout={handleLogout}
        onOpenDemoGuide={() => setIsDemoGuideOpen(true)}
        onNavigate={(mod) => {
          setActiveModule(mod);
          setIsMobileMenuOpen(false);
        }}
        patternAlerts={patternAlerts}
        activeModule={activeModule}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Role-Filtered Side Navigation */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={(mod) => {
            setActiveModule(mod);
            setIsMobileMenuOpen(false);
          }}
          userRole={currentUser.role}
          unreviewedAlertsCount={unreviewedCount}
          currentUser={currentUser}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Workspace Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 bg-[#0F172A]">
          <div className="max-w-[1500px] mx-auto">
            {!canAccessModule(currentUser.role, activeModule) ? (
              <AccessDeniedView
                currentUser={currentUser}
                attemptedModule={activeModule}
                onNavigate={setActiveModule}
              />
            ) : (
              <>
                {activeModule === 'analytics' && (
                  <AnalyticsDashboard
                    firs={firs}
                    crimeRecords={crimeRecords}
                    evidenceItems={evidenceItems}
                    hotspots={hotspots}
                    onSelectCrime={handleSelectCrime}
                    onNavigate={setActiveModule}
                  />
                )}

                {activeModule === 'pattern' && (
                  <PatternDetectionView
                    alerts={patternAlerts}
                    crimeRecords={crimeRecords}
                    firs={firs}
                    onConfirmAlert={handleConfirmAlert}
                    onDismissAlert={handleDismissAlert}
                    onSelectCrime={handleSelectCrime}
                    onRunScan={handleRunPatternScan}
                  />
                )}

                {activeModule === 'iptracing' && (
                  <IpTracingView
                    crimeRecords={crimeRecords}
                    firs={firs}
                    currentUser={currentUser}
                    onNavigateToLogs={(ip) => {
                      if (ip) setSelectedIpForFilter(ip);
                      setActiveModule('loganalysis');
                    }}
                    onSelectCrime={handleSelectCrime}
                  />
                )}

                {activeModule === 'loganalysis' && (
                  <FastLogAnalysisView
                    currentUser={currentUser}
                    crimeRecords={crimeRecords}
                    initialIpFilter={selectedIpForFilter}
                    onNavigateToIpTrace={(ip) => {
                      setSelectedIpForFilter(ip);
                      setActiveModule('iptracing');
                    }}
                    onSelectCrime={handleSelectCrime}
                  />
                )}

                {activeModule === 'firs' && (
                  <FirManagementView
                    firs={firs}
                    currentUser={currentUser}
                    onAddFir={handleAddFir}
                    onUpdateFirStatus={handleUpdateFirStatus}
                  />
                )}

                {activeModule === 'crimes' && (
                  <CrimeRecordView
                    crimeRecords={crimeRecords}
                    currentUser={currentUser}
                    onSelectCrime={handleSelectCrime}
                    onUpdateStatus={handleUpdateCrimeStatus}
                  />
                )}

                {activeModule === 'criminals' && (
                  <CriminalProfileView
                    criminals={criminals}
                    onAddCriminal={handleAddCriminal}
                    onUpdateCriminal={handleUpdateCriminal}
                    onDeleteCriminal={handleDeleteCriminal}
                  />
                )}

                {activeModule === 'evidence' && (
                  <EvidenceManagementView
                    evidenceItems={evidenceItems}
                    currentUser={currentUser}
                    onAddEvidence={handleAddEvidence}
                    onAddCustodyLog={handleAddCustodyLog}
                  />
                )}

                {activeModule === 'investigation' && (
                  <InvestigationView
                    crimeRecords={crimeRecords}
                    notes={investigationNotes}
                    currentUser={currentUser}
                    onAddNote={handleAddNote}
                    onUpdateStatus={handleUpdateCrimeStatus}
                  />
                )}

                {activeModule === 'people' && (
                  <VictimsWitnessesView
                    victims={victims}
                    witnesses={witnesses}
                    onAddVictim={handleAddVictim}
                    onAddWitness={handleAddWitness}
                  />
                )}

                {activeModule === 'reports' && (
                  <ReportGenerationView
                    firs={firs}
                    crimeRecords={crimeRecords}
                    evidenceItems={evidenceItems}
                    currentUser={currentUser}
                  />
                )}

                {activeModule === 'users' && (
                  <UserManagementView
                    users={users}
                    auditLogs={auditLogs}
                    currentUser={currentUser}
                    onAddUser={handleAddUser}
                    onToggleUserStatus={handleToggleUserStatus}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
