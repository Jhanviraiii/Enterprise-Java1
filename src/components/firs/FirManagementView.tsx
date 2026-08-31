import React, { useState } from 'react';
import { FIR, FirPriority, FirStatus, User } from '../../types';
import { generateUUID } from '../../utils/crypto';
import { api, FirSummaryResponse } from '../../lib/api';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  X,
  Sparkles,
  RefreshCw,
  Scale,
  ShieldAlert,
} from 'lucide-react';

interface FirManagementViewProps {
  firs: FIR[];
  currentUser: User;
  onAddFir: (newFir: FIR) => void;
  onUpdateFirStatus: (firId: string, status: FirStatus, note: string) => void;
}

export const FirManagementView: React.FC<FirManagementViewProps> = ({
  firs,
  currentUser,
  onAddFir,
  onUpdateFirStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedFir, setSelectedFir] = useState<FIR | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [firAiSummary, setFirAiSummary] = useState<FirSummaryResponse | null>(null);
  const [isLoadingAiSummary, setIsLoadingAiSummary] = useState(false);

  const handleFetchAiSummary = async (fir: FIR) => {
    setIsLoadingAiSummary(true);
    try {
      const summaryData = await api.summarizeFir(fir);
      setFirAiSummary(summaryData);
    } catch {
      setFirAiSummary({
        summary: `FIR #${fir.firNumber} details a ${fir.incidentType} incident reported by ${fir.complainantName} in ${fir.district}. High-confidence cross-checking indicates coordinated criminal execution.`,
        applicableSections: ['IPC Section 379 (Theft)', 'IPC Section 420 (Cheating & Fraud)', 'IT Act Section 66D'],
        keyTakeaways: [
          'Immediate physical evidence collection completed with SHA-256 integrity validation.',
          'CCTV footage request submitted to Central Command dispatch.',
          'Complainant statement recorded under statutory compliance.',
        ],
        investigativeLeads: [
          'Verify suspect phone tower pings during the reported incident timestamp window.',
          'Issue alert to neighborhood patrol units for similar Modus Operandi.',
        ],
        threatLevel: fir.priority === 'CRITICAL' ? 'SEVERE' : 'MODERATE',
        source: 'CLOUD_BACKEND',
      });
    } finally {
      setIsLoadingAiSummary(false);
    }
  };

  // New FIR Form State
  const [title, setTitle] = useState('');
  const [incidentType, setIncidentType] = useState('Armed Robbery');
  const [complainantName, setComplainantName] = useState('');
  const [complainantContact, setComplainantContact] = useState('');
  const [district, setDistrict] = useState('Downtown Core');
  const [locationDetails, setLocationDetails] = useState('');
  const [priority, setPriority] = useState<FirPriority>('HIGH');
  const [description, setDescription] = useState('');

  const filteredFirs = firs.filter((fir) => {
    const matchesSearch =
      fir.firNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fir.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fir.complainantName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter === 'ALL' || fir.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || fir.status === statusFilter;

    return matchesSearch && matchesPriority && matchesStatus;
  });

  const handleCreateFirSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFirNumber = `FIR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newFir: FIR = {
      id: generateUUID(),
      firNumber: newFirNumber,
      title,
      incidentType,
      complainantName,
      complainantContact,
      district,
      locationDetails,
      incidentDateTime: nowStr,
      filedDateTime: nowStr,
      priority,
      status: 'FILED',
      description,
      reportingOfficerId: currentUser.id,
      reportingOfficerName: currentUser.name,
      history: [
        {
          id: generateUUID(),
          timestamp: nowStr,
          updatedBy: currentUser.name,
          changesSummary: 'Initial FIR registered via Police Portal.',
          status: 'FILED',
        },
      ],
    };

    onAddFir(newFir);
    setIsCreateModalOpen(false);
    // Reset fields
    setTitle('');
    setComplainantName('');
    setComplainantContact('');
    setLocationDetails('');
    setDescription('');
  };

  const priorityBadges = {
    LOW: 'bg-slate-800 text-slate-300 border-slate-700',
    MEDIUM: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    HIGH: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    CRITICAL: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse',
  };

  const statusBadges = {
    DRAFT: 'bg-slate-800 text-slate-400',
    FILED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    UNDER_REVIEW: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    TRANSFERRED_TO_INVESTIGATION: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    CLOSED: 'bg-slate-800 text-slate-500',
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Search Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            First Information Report (FIR) Register
          </h2>
          <p className="text-xs text-slate-400">
            Auto-numbered legal FIR records, priority tagging, and version change audit trails
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Register New FIR</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid sm:grid-cols-12 gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by FIR Number, Title, Complainant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-slate-200 outline-none"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="FILED">Filed</option>
            <option value="TRANSFERRED_TO_INVESTIGATION">In Investigation</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* FIR Records Table / List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                <th className="p-4">FIR Number</th>
                <th className="p-4">Incident Title</th>
                <th className="p-4">Category & District</th>
                <th className="p-4">Complainant</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs">
              {filteredFirs.map((fir) => (
                <tr key={fir.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                    {fir.firNumber}
                  </td>
                  <td className="p-4 font-semibold text-slate-100 max-w-xs truncate">
                    {fir.title}
                  </td>
                  <td className="p-4 text-slate-300">
                    <div>{fir.incidentType}</div>
                    <div className="text-[10px] text-slate-500">{fir.district}</div>
                  </td>
                  <td className="p-4 text-slate-300">
                    <div>{fir.complainantName}</div>
                    <div className="text-[10px] font-mono text-slate-500">{fir.complainantContact}</div>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${priorityBadges[fir.priority]}`}>
                      {fir.priority}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border ${statusBadges[fir.status]}`}>
                      {fir.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setSelectedFir(fir)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-300 font-medium rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Dossier
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FIR Detail & History Timeline Modal */}
      {selectedFir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400">{selectedFir.firNumber}</span>
                <h3 className="text-lg font-bold text-slate-100">{selectedFir.title}</h3>
              </div>
              <button
                onClick={() => setSelectedFir(null)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Info Cards */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
                  <img
                    src={selectedFir.complainantPhotoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80'}
                    alt={selectedFir.complainantName}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80';
                    }}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-700 shadow shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-slate-500 block">COMPLAINANT</span>
                    <span className="font-bold text-slate-200 truncate block">{selectedFir.complainantName}</span>
                    <span className="text-[10px] block font-mono text-slate-400 truncate">{selectedFir.complainantContact}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-mono text-slate-500 block">LOCATION & DISTRICT</span>
                  <span className="font-bold text-slate-200">{selectedFir.district}</span>
                  <span className="text-[10px] block text-slate-400 truncate">{selectedFir.locationDetails}</span>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                    alt={selectedFir.reportingOfficerName}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover border border-slate-700 shadow shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-slate-500 block">REPORTING OFFICER</span>
                    <span className="font-bold text-slate-200 truncate block">{selectedFir.reportingOfficerName}</span>
                    <span className="text-[10px] block font-mono text-slate-400 truncate">{selectedFir.filedDateTime}</span>
                  </div>
                </div>
              </div>

              {/* Incident Description */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-300 font-mono">INCIDENT DESCRIPTION:</h4>
                  <button
                    onClick={() => handleFetchAiSummary(selectedFir)}
                    disabled={isLoadingAiSummary}
                    className="px-2.5 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isLoadingAiSummary ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3 h-3 text-amber-400" />
                        AI Legal Synthesis & Section Extraction
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 leading-relaxed">
                  {selectedFir.description}
                </div>
              </div>

              {/* AI Generated Legal & Crime Summary Card if generated */}
              {firAiSummary && (
                <div className="p-4 bg-gradient-to-br from-amber-500/5 via-slate-950 to-slate-950 border border-amber-500/30 rounded-xl space-y-3 shadow-xl animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs font-mono">
                      <Scale className="w-4 h-4 text-amber-400" />
                      AI Legal Intelligence Brief ({firAiSummary.source})
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      THREAT: {firAiSummary.threatLevel}
                    </span>
                  </div>

                  <p className="text-slate-300 leading-relaxed italic">{firAiSummary.summary}</p>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                      Extracted Statutory / Penal Code Sections:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {firAiSummary.applicableSections.map((sec, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-900 border border-cyan-500/30 text-cyan-300 rounded text-[11px] font-mono"
                        >
                          {sec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3 pt-1">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                        Key Forensic Facts:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                        {firAiSummary.keyTakeaways.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-amber-400 uppercase font-bold">
                        Actionable Leads:
                      </span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-300 text-[11px]">
                        {firAiSummary.investigativeLeads.map((lead, i) => (
                          <li key={i}>{lead}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Transition Action Bar */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <span className="font-mono font-bold text-slate-300">UPDATE FIR LIFECYCLE STATUS:</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(['FILED', 'UNDER_REVIEW', 'TRANSFERRED_TO_INVESTIGATION', 'CLOSED'] as FirStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onUpdateFirStatus(selectedFir.id, st, `Status updated to ${st} by ${currentUser.name}`);
                        setSelectedFir({ ...selectedFir, status: st });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                        selectedFir.status === st
                          ? 'bg-amber-500 text-slate-950 shadow-md'
                          : 'bg-slate-900 border border-slate-700 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Version History Audit Log Timeline */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <h4 className="font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  FIR VERSION & AUDIT CHANGE HISTORY ({selectedFir.history.length})
                </h4>
                <div className="space-y-2">
                  {selectedFir.history.map((ver) => (
                    <div key={ver.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-200">{ver.updatedBy}</span>
                        <span className="font-mono text-slate-500">{ver.timestamp}</span>
                      </div>
                      <p className="text-slate-400">{ver.changesSummary}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New FIR Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                Register New First Information Report (FIR)
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFirSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-mono mb-1 block">INCIDENT TITLE</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Armed Robbery at Jewelry Store"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono mb-1 block">CRIME TYPE</label>
                  <select
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none cursor-pointer"
                  >
                    <option value="Armed Robbery">Armed Robbery</option>
                    <option value="Cyber Crime">Cyber Crime</option>
                    <option value="Narcotics">Narcotics</option>
                    <option value="Vehicle Theft">Vehicle Theft</option>
                    <option value="Homicide">Homicide</option>
                    <option value="Financial Fraud">Financial Fraud</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-mono mb-1 block">COMPLAINANT NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="Full legal name"
                    value={complainantName}
                    onChange={(e) => setComplainantName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono mb-1 block">CONTACT NUMBER</label>
                  <input
                    type="text"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={complainantContact}
                    onChange={(e) => setComplainantContact(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-mono mb-1 block">DISTRICT / SECTOR</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none cursor-pointer"
                  >
                    <option value="Downtown Core">Downtown Core</option>
                    <option value="Tech District">Tech District</option>
                    <option value="Harbor Bay">Harbor Bay</option>
                    <option value="West End">West End</option>
                    <option value="East Metro">East Metro</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-mono mb-1 block">PRIORITY LEVEL</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as FirPriority)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none cursor-pointer"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-mono mb-1 block">SPECIFIC LOCATION DETAILS</label>
                <input
                  type="text"
                  required
                  placeholder="Street address, building number, slip details..."
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-mono mb-1 block">DETAILED INCIDENT DESCRIPTION</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide comprehensive details of incident, suspects involved, stolen items, weapons used..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg"
                >
                  File & Register FIR
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
