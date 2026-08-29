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
  SearchX,
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
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<CrimeRecord | null>(null);

  const filteredRecords = crimeRecords.filter((rec) => {
    const matchesSearch =
      !searchQuery ||
      rec.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.firNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.assignedInvestigatorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = typeFilter === 'ALL' || rec.crimeType.toLowerCase().includes(typeFilter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || rec.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const severityBadges: Record<string, string> = {
    CRITICAL: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    HIGH: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    MEDIUM: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    LOW: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  const statusBadges: Record<string, string> = {
    OPEN: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    UNDER_INVESTIGATION: 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold',
    SOLVED: 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold',
    CLOSED: 'bg-slate-800 text-slate-400',
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] font-bold tracking-wider uppercase">
            <FolderOpen className="w-3.5 h-3.5" />
            <span>CRIME MASTER DOSSIERS</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Crime Record & Investigation Master File
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Multi-criteria case search, modus operandi cataloging, assigned detectives, and evidence links across municipal law enforcement units.
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="grid sm:grid-cols-12 gap-3 bg-[#111827] border border-[#1E293B] rounded-xl p-4 shadow-sm">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Case Number, Title, FIR Number, Investigator..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0F172A] border border-[#1E293B] focus:border-blue-500/60 rounded-xl text-xs text-white outline-none transition-colors"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-xl text-xs text-slate-300 outline-none cursor-pointer"
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
            className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-xl text-xs text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">All Case Statuses</option>
            <option value="OPEN">Open</option>
            <option value="UNDER_INVESTIGATION">Under Investigation</option>
            <option value="SOLVED">Solved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Grid of Crime Record Dossier Cards OR Empty State */}
      {filteredRecords.length === 0 ? (
        <div className="p-12 text-center bg-[#111827] border border-[#1E293B] rounded-2xl space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
            <SearchX className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white tracking-tight">No Matching Crime Records Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            No active crime records match your current search criteria. Try clearing query filters or adjusting case status.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('ALL');
              setStatusFilter('ALL');
            }}
            className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 border border-[#1E293B] text-blue-400 font-semibold text-xs rounded-xl transition-colors duration-200 cursor-pointer"
          >
            Reset Search Filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-[#111827] border border-[#1E293B] hover:border-slate-700 rounded-[14px] p-5 shadow-sm hover:shadow-md space-y-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-blue-400 tracking-wide">{rec.caseNumber}</span>
                  <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md border ${severityBadges[rec.severity]}`}>
                    {rec.severity}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors duration-200 tracking-tight">
                    {rec.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">{rec.description}</p>
                </div>

                {/* Modus Operandi Tags */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">MODUS OPERANDI:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {rec.modusOperandi.map((mo, idx) => (
                      <span key={idx} className="text-[10px] bg-[#0F172A] text-slate-300 px-2.5 py-0.5 rounded-md border border-[#1E293B]">
                        {mo}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Telemetry info */}
                <div className="pt-3 border-t border-[#1E293B] space-y-1.5 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>INVESTIGATOR:</span>
                    <span className="text-slate-200 font-semibold">{rec.assignedInvestigatorName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>LINKED FIR:</span>
                    <span className="text-blue-400 font-semibold">{rec.firNumber}</span>
                  </div>
                </div>
              </div>

              {/* Card Action Footer */}
              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between">
                <span className={`text-[10px] font-mono font-semibold px-2.5 py-0.5 rounded-md ${statusBadges[rec.status]}`}>
                  {rec.status.replace(/_/g, ' ')}
                </span>

                <button
                  onClick={() => setSelectedRecord(rec)}
                  className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-blue-600/10 border border-[#1E293B] text-blue-400 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors duration-200 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect File</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Record Inspection Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-[#1E293B] flex items-center justify-between bg-[#0F172A]">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400">{selectedRecord.caseNumber}</span>
                <h3 className="text-lg font-bold text-white">{selectedRecord.title}</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              <div className="p-4 bg-[#0F172A] border border-[#1E293B] rounded-xl space-y-2">
                <h4 className="font-mono font-bold text-slate-300">FULL CASE DESCRIPTION</h4>
                <p className="text-slate-300 leading-relaxed">{selectedRecord.description}</p>
              </div>

              {/* Specific Intelligence Parameters */}
              <div className="grid sm:grid-cols-2 gap-3">
                {selectedRecord.vehicleDetails && (
                  <div className="p-3 bg-[#0F172A] border border-[#1E293B] rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Car className="w-3.5 h-3.5 text-blue-400" /> ESCAPE VEHICLE TELEMETRY
                    </span>
                    <p className="font-semibold text-white">{selectedRecord.vehicleDetails}</p>
                  </div>
                )}
                {selectedRecord.ipAddress && (
                  <div className="p-3 bg-[#0F172A] border border-[#1E293B] rounded-xl space-y-1">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-blue-400" /> IP ADDRESS / SUBNET RECON
                    </span>
                    <p className="font-mono font-semibold text-blue-400">{selectedRecord.ipAddress}</p>
                  </div>
                )}
              </div>

              {/* Status Update Bar */}
              <div className="p-4 bg-[#0F172A] border border-[#1E293B] rounded-xl space-y-2">
                <span className="font-mono font-bold text-slate-300">CHANGE CASE STATUS FLOW:</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(['OPEN', 'UNDER_INVESTIGATION', 'SOLVED', 'CLOSED'] as CrimeRecord['status'][]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onUpdateStatus(selectedRecord.id, st);
                        setSelectedRecord({ ...selectedRecord, status: st });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all duration-200 ${
                        selectedRecord.status === st
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-[#111827] border border-[#1E293B] text-slate-300 hover:border-slate-600'
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

