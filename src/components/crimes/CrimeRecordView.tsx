import React, { useState } from 'react';
import { CrimeRecord, User } from '../../types';
import {
  FolderOpen,
  Search,
  Filter,
  Eye,
  UserCheck,
  Zap,
  Phone,
  Car,
  Globe,
  X,
  ShieldAlert,
} from 'lucide-react';

interface CrimeRecordViewProps {
  crimeRecords: CrimeRecord[];
  currentUser: User;
  onSelectCrime: (crime: CrimeRecord) => void;
  onUpdateStatus: (caseId: string, newStatus: CrimeRecord['status']) => void;
}

export const CrimeRecordView: React.FC<CrimeRecordViewProps> = ({
  crimeRecords,
  currentUser,
  onSelectCrime,
  onUpdateStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState<CrimeRecord | null>(null);

  const filteredRecords = crimeRecords.filter((rec) => {
    const matchesSearch =
      rec.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.firNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.assignedInvestigatorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'ALL' || rec.crimeType === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || rec.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const severityBadges = {
    CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse',
    SEVERE: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    MODERATE: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    MINOR: 'bg-slate-800 text-slate-400',
  };

  const statusBadges = {
    OPEN: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    UNDER_INVESTIGATION: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    SOLVED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    CLOSED: 'bg-slate-800 text-slate-500',
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-amber-400" />
            Crime Record & Investigation Master File
          </h2>
          <p className="text-xs text-slate-400">
            Multi-criteria case search, modus operandi cataloging, assigned detectives, and evidence links
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid sm:grid-cols-12 gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Case Number, Title, FIR Number, Investigator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-slate-200 outline-none"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">All Crime Types</option>
            <option value="Armed Robbery">Armed Robbery</option>
            <option value="Cyber Crime">Cyber Crime</option>
            <option value="Narcotics">Narcotics</option>
            <option value="Vehicle Theft">Vehicle Theft</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">All Case Statuses</option>
            <option value="OPEN">Open</option>
            <option value="UNDER_INVESTIGATION">Under Investigation</option>
            <option value="SOLVED">Solved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Grid of Crime Record Dossier Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.map((rec) => (
          <div
            key={rec.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400">{rec.caseNumber}</span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${severityBadges[rec.severity]}`}>
                  {rec.severity}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                  {rec.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{rec.description}</p>
              </div>

              {/* Modus Operandi Tags */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">MODUS OPERANDI:</span>
                <div className="flex flex-wrap gap-1">
                  {rec.modusOperandi.map((mo, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 text-amber-400" />
                      {mo}
                    </span>
                  ))}
                </div>
              </div>

              {/* Telemetry info */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px] font-mono text-slate-400">
                <div className="flex items-center justify-between">
                  <span>INVESTIGATOR:</span>
                  <span className="text-slate-200 font-semibold">{rec.assignedInvestigatorName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>LINKED FIR:</span>
                  <span className="text-amber-300">{rec.firNumber}</span>
                </div>
              </div>
            </div>

            {/* Card Action Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${statusBadges[rec.status]}`}>
                {rec.status.replace(/_/g, ' ')}
              </span>

              <button
                onClick={() => setSelectedRecord(rec)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Inspect File
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Record Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400">{selectedRecord.caseNumber}</span>
                <h3 className="text-lg font-bold text-slate-100">{selectedRecord.title}</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-mono font-bold text-slate-300">FULL CASE DESCRIPTION</h4>
                <p className="text-slate-300 leading-relaxed">{selectedRecord.description}</p>
              </div>

              {/* Specific Intelligence Parameters */}
              <div className="grid sm:grid-cols-2 gap-3">
                {selectedRecord.vehicleDetails && (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <Car className="w-3.5 h-3.5 text-amber-400" /> ESCAPE VEHICLE TELEMETRY
                    </span>
                    <p className="font-semibold text-slate-200">{selectedRecord.vehicleDetails}</p>
                  </div>
                )}
                {selectedRecord.ipAddress && (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-cyan-400" /> IP ADDRESS / SUBNET RECON
                    </span>
                    <p className="font-mono font-semibold text-cyan-300">{selectedRecord.ipAddress}</p>
                  </div>
                )}
              </div>

              {/* Status Update Bar */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="font-mono font-bold text-slate-300">CHANGE CASE STATUS FLOW:</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(['OPEN', 'UNDER_INVESTIGATION', 'SOLVED', 'CLOSED'] as CrimeRecord['status'][]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onUpdateStatus(selectedRecord.id, st);
                        setSelectedRecord({ ...selectedRecord, status: st });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                        selectedRecord.status === st
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
