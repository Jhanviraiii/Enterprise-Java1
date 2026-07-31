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

// Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ToastContainer, ToastMessage } from './components/Toast';
import { DemoGuideModal } from './components/DemoGuideModal';
import { LoginView } from './components/auth/LoginView';

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
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);
  const [activeModule, setActiveModule] = useState<string>('analytics');
  const [isDemoGuideOpen, setIsDemoGuideOpen] = useState(false);
  const [selectedIpForFilter, setSelectedIpForFilter] = useState<string>('');

  // App Master Datasets
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

  // Toast System
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

  const addAuditLog = (action: string, module: AuditLog['module'], details: string) => {
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
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Auth & Role Switch Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    addToast('success', 'Authentication Successful', `Welcome Officer ${user.name} (${user.role})`);
    addAuditLog('USER_LOGIN', 'AUTH', `Authenticated session for ${user.badgeNumber}`);
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    const matchedUser = users.find((u) => u.role === newRole) || {
      ...currentUser!,
      role: newRole,
    };
    setCurrentUser(matchedUser);
    addToast('info', 'Evaluator Role Switch', `Active session role switched to ${newRole}`);
    addAuditLog('ROLE_SWITCH', 'AUTH', `Switched active role to ${newRole}`);
  };

  const handleLogout = () => {
    addAuditLog('USER_LOGOUT', 'AUTH', `Logged out session`);
    setCurrentUser(null);
    addToast('info', 'Logged Out', 'Terminal session terminated safely.');
  };

  // FIR Handlers
  const handleAddFir = (newFir: FIR) => {
    setFirs((prev) => [newFir, ...prev]);
    addToast('success', 'FIR Registered', `New ${newFir.firNumber} filed under ${newFir.district}`);
    addAuditLog('FIR_FILED', 'FIR', `Registered new FIR ${newFir.firNumber}: ${newFir.title}`);
  };

  const handleUpdateFirStatus = (firId: string, status: FirStatus, note: string) => {
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
    addToast('info', 'FIR Status Updated', `FIR status changed to ${status}`);
    addAuditLog('FIR_STATUS_UPDATE', 'FIR', `Updated status of FIR ${firId} to ${status}`);
  };

  // Crime Record Handlers
  const handleUpdateCrimeStatus = (caseId: string, newStatus: CrimeRecord['status']) => {
    setCrimeRecords((prev) =>
      prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c))
    );
    addToast('info', 'Case Status Updated', `Case status updated to ${newStatus}`);
    addAuditLog('CRIME_STATUS_UPDATE', 'CRIME', `Updated case ${caseId} status to ${newStatus}`);
  };

  // Pattern Alert Handlers
  const handleConfirmAlert = (alertId: string) => {
    setPatternAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'CONFIRMED' } : a))
    );
    addToast('success', 'Case Link Confirmed', `Pattern alert #${alertId} confirmed and linked into joint investigation dossier.`);
    addAuditLog('PATTERN_ALERT_CONFIRMED', 'CRIME', `Confirmed pattern alert ${alertId}`);
  };

  const handleDismissAlert = (alertId: string) => {
    setPatternAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'DISMISSED' } : a))
    );
    addToast('info', 'Alert Dismissed', `Pattern alert #${alertId} dismissed.`);
  };

  const handleRunPatternScan = () => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newAlert: PatternAlert = {
      id: `alert-${patternAlerts.length + 1}`,
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

    setPatternAlerts((prev) => [newAlert, ...prev]);
    addToast('alert', 'AI Pattern Detected!', 'New 96% high-confidence cross-case connection alert discovered between FIR-2026-08942 and FIR-2026-08103!');
    addAuditLog('PATTERN_SCAN_RUN', 'CRIME', 'Ran AI Pattern Detection scan across FIR database.');
  };

  // Evidence Handlers
  const handleAddEvidence = (newEvd: EvidenceItem) => {
    setEvidenceItems((prev) => [newEvd, ...prev]);
    addToast('success', 'Evidence File Uploaded', `SHA-256 hash verified: ${newEvd.sha256Hash.substring(0, 16)}...`);
    addAuditLog('EVIDENCE_UPLOAD', 'EVIDENCE', `Uploaded item ${newEvd.evidenceCode} with SHA-256 checksum.`);
  };

  const handleAddCustodyLog = (
    evidenceId: string,
    action: EvidenceItem['custodyChain'][0]['action'],
    notesText: string
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setEvidenceItems((prev) =>
      prev.map((item) => {
        if (item.id === evidenceId) {
          const newEntry: EvidenceItem['custodyChain'][0] = {
            id: generateUUID(),
            timestamp: nowStr,
            handledBy: currentUser?.name || 'Officer',
            badgeNumber: currentUser?.badgeNumber || 'BADGE-000',
            action,
            notes: notesText,
          };
          return {
            ...item,
            custodyChain: [newEntry, ...item.custodyChain],
          };
        }
        return item;
      })
    );
    addToast('info', 'Custody Chain Updated', `Logged ${action} entry for evidence file.`);
    addAuditLog('CUSTODY_LOG_ADDED', 'EVIDENCE', `Added custody log for ${evidenceId}`);
  };

  // Investigation Note Handler
  const handleAddNote = (newNote: InvestigationNote) => {
    setInvestigationNotes((prev) => [newNote, ...prev]);
    addToast('success', 'Investigation Note Logged', `Logged ${newNote.category} note.`);
  };

  // User Mgmt Handlers
  const handleAddUser = (user: User) => {
    setUsers((prev) => [user, ...prev]);
    addToast('success', 'Account Provisioned', `Provisioned officer account for ${user.name}`);
    addAuditLog('USER_PROVISIONED', 'USER', `Created account ${user.badgeNumber}`);
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : u))
    );
    addToast('warning', 'User Status Updated', 'Officer account status toggled.');
  };

  // Select Crime shortcut
  const handleSelectCrime = (crime: CrimeRecord) => {
    setActiveModule('crimes');
  };

  // Unauthenticated render
  if (!currentUser) {
    return (
      <>
        <LoginView onLoginSuccess={handleLoginSuccess} />
        <ToastContainer toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  const unreviewedCount = patternAlerts.filter((a) => a.status === 'UNREVIEWED').length;

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500 selection:text-slate-950">
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
        onNavigate={(mod) => setActiveModule(mod)}
        patternAlerts={patternAlerts}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Role-Filtered Side Navigation */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          userRole={currentUser.role}
          unreviewedAlertsCount={unreviewedCount}
        />

        {/* Main Workspace Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-950/40">
          <div className="max-w-7xl mx-auto">
            {activeModule === 'analytics' && (
              <AnalyticsDashboard
                firs={firs}
                crimeRecords={crimeRecords}
                evidenceItems={evidenceItems}
                hotspots={INITIAL_HOTSPOTS}
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
                onAddCriminal={(c) => setCriminals([c, ...criminals])}
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
                onAddVictim={(v) => setVictims([v, ...victims])}
                onAddWitness={(w) => setWitnesses([w, ...witnesses])}
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

            {activeModule === 'users' && currentUser.role === 'ADMIN' && (
              <UserManagementView
                users={users}
                auditLogs={auditLogs}
                currentUser={currentUser}
                onAddUser={handleAddUser}
                onToggleUserStatus={handleToggleUserStatus}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
