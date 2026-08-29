import React, { useState } from 'react';
import { FIR, FirPriority, FirStatus, User } from '../../types';
import { generateUUID } from '../../utils/crypto';
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
  SearchX,
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
    LOW: 'bg-slate-800 text-slate-400 border-slate-700',
    MEDIUM: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    HIGH: 'bg-blue-500/10 text-blue-400 border-blue-500/20 font-semibold',
    CRITICAL: 'bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold',
  };

  const statusBadges = {
    DRAFT: 'bg-slate-800 text-slate-400',
    FILED: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    UNDER_REVIEW: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    TRANSFERRED_TO_INVESTIGATION: 'bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold',
    CLOSED: 'bg-slate-800 text-slate-400',
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] font-bold tracking-wider uppercase">
            <FileText className="w-3.5 h-3.5" />
            <span>LEGAL FIR REGISTRY</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            First Information Report (FIR) Register
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Auto-numbered legal FIR records, priority tagging, station assignments, and version change audit trails.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="h-11 px-5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all duration-200 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Register New FIR</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid sm:grid-cols-12 gap-3 bg-[#111827] border border-[#1E293B] rounded-xl p-4 shadow-sm">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by FIR Number, Title, Complainant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0F172A] border border-[#1E293B] focus:border-blue-500/60 rounded-xl text-xs text-white outline-none transition-colors"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-xl text-xs text-slate-300 outline-none cursor-pointer"
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
            className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-xl text-xs text-slate-300 outline-none cursor-pointer"
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
      <div className="bg-[#111827] border border-[#1E293B] rounded-[14px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 z-10 bg-[#0F172A] border-b border-[#1E293B] shadow-sm">
              <tr className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3.5">FIR Number</th>
                <th className="px-5 py-3.5">Incident Title</th>
                <th className="px-5 py-3.5">Category & District</th>
                <th className="px-5 py-3.5">Complainant</th>
                <th className="px-5 py-3.5">Priority</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B] text-xs">
              {filteredFirs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center bg-[#111827]">
                    <div className="space-y-3">
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
                        <SearchX className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-white tracking-tight">No Matching FIR Records Found</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                        No FIRs match your current search query or active filters. Try clearing search keywords.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('');
                          setPriorityFilter('ALL');
                          setStatusFilter('ALL');
                        }}
                        className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 border border-[#1E293B] text-blue-400 font-semibold text-xs rounded-xl transition-colors duration-200 cursor-pointer"
                      >
                        Reset FIR Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredFirs.map((fir) => (
                <tr key={fir.id} className="hover:bg-[#0F172A]/80 transition-colors duration-150 group">
                  <td className="px-5 py-4 font-mono font-bold text-blue-400 whitespace-nowrap tracking-wide">
                    {fir.firNumber}
                  </td>
                  <td className="px-5 py-4 font-semibold text-white max-w-xs truncate group-hover:text-blue-400 transition-colors duration-150">
                    {fir.title}
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    <div className="font-medium text-white">{fir.incidentType}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{fir.district}</div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">
                    <div className="font-medium text-white">{fir.complainantName}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">{fir.complainantContact}</div>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border ${priorityBadges[fir.priority]}`}>
                      {fir.priority}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-mono font-semibold px-2.5 py-1 rounded-md ${statusBadges[fir.status]}`}>
                      {fir.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => setSelectedFir(fir)}
                      className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-blue-600/10 border border-[#1E293B] text-blue-400 font-semibold rounded-xl text-xs transition-colors duration-150 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Dossier
                    </button>
                  </td>
                </tr>
              ))
            )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FIR Detail & History Timeline Modal */}
      {selectedFir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-[#1E293B] flex items-center justify-between bg-[#0F172A]">
              <div>
                <span className="text-xs font-mono font-bold text-blue-400">{selectedFir.firNumber}</span>
                <h3 className="text-lg font-bold text-white">{selectedFir.title}</h3>
              </div>
              <button
                onClick={() => setSelectedFir(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Info Cards */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#0F172A] border border-[#1E293B] rounded-xl">
                  <span className="text-[10px] font-mono text-slate-400 block">COMPLAINANT</span>
                  <span className="font-bold text-white">{selectedFir.complainantName}</span>
                  <span className="text-[10px] block font-mono text-slate-400">{selectedFir.complainantContact}</span>
                </div>
                <div className="p-3 bg-[#0F172A] border border-[#1E293B] rounded-xl">
                  <span className="text-[10px] font-mono text-slate-400 block">LOCATION & DISTRICT</span>
                  <span className="font-bold text-white">{selectedFir.district}</span>
                  <span className="text-[10px] block text-slate-400 truncate">{selectedFir.locationDetails}</span>
                </div>
                <div className="p-3 bg-[#0F172A] border border-[#1E293B] rounded-xl">
                  <span className="text-[10px] font-mono text-slate-400 block">REPORTING OFFICER</span>
                  <span className="font-bold text-white">{selectedFir.reportingOfficerName}</span>
                  <span className="text-[10px] block font-mono text-slate-400">{selectedFir.filedDateTime}</span>
                </div>
              </div>

              {/* Incident Description */}
              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-300 font-mono">INCIDENT DESCRIPTION:</h4>
                <div className="p-4 bg-[#0F172A] border border-[#1E293B] rounded-xl text-slate-300 leading-relaxed">
                  {selectedFir.description}
                </div>
              </div>

              {/* Status Transition Action Bar */}
              <div className="p-4 bg-[#0F172A] border border-[#1E293B] rounded-xl space-y-2">
                <span className="font-mono font-bold text-slate-300">UPDATE FIR LIFECYCLE STATUS:</span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {(['FILED', 'UNDER_REVIEW', 'TRANSFERRED_TO_INVESTIGATION', 'CLOSED'] as FirStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        onUpdateFirStatus(selectedFir.id, st, `Status updated to ${st} by ${currentUser.name}`);
                        setSelectedFir({ ...selectedFir, status: st });
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all duration-200 ${
                        selectedFir.status === st
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-[#111827] border border-[#1E293B] text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      {st.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Version History Audit Log Timeline */}
              <div className="space-y-3 pt-2 border-t border-[#1E293B]">
                <h4 className="font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-400" />
                  FIR VERSION & AUDIT CHANGE HISTORY ({selectedFir.history.length})
                </h4>
                <div className="space-y-2">
                  {selectedFir.history.map((ver) => (
                    <div key={ver.id} className="p-3 bg-[#0F172A] border border-[#1E293B] rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-white">{ver.updatedBy}</span>
                        <span className="font-mono text-slate-400">{ver.timestamp}</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-[#1E293B] flex items-center justify-between bg-[#0F172A]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                Register New First Information Report (FIR)
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFirSubmit} className="p-6 space-y-5 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">INCIDENT TITLE *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Armed Robbery at Jewelry Store"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#0F172A] border border-[#1E293B] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white outline-none transition-all duration-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">CRIME TYPE *</label>
                  <select
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#0F172A] border border-[#1E293B] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white outline-none cursor-pointer transition-all duration-200"
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

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">COMPLAINANT NAME *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full legal name"
                    value={complainantName}
                    onChange={(e) => setComplainantName(e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#0F172A] border border-[#1E293B] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white outline-none transition-all duration-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">CONTACT NUMBER *</label>
                  <input
                    type="text"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={complainantContact}
                    onChange={(e) => setComplainantContact(e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#0F172A] border border-[#1E293B] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white outline-none transition-all duration-200 font-mono"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">DISTRICT / SECTOR *</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full h-11 px-3.5 bg-[#0F172A] border border-[#1E293B] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white outline-none cursor-pointer transition-all duration-200"
                  >
                    <option value="Downtown Core">Downtown Core</option>
                    <option value="Tech District">Tech District</option>
                    <option value="Harbor Bay">Harbor Bay</option>
                    <option value="West End">West End</option>
                    <option value="East Metro">East Metro</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">PRIORITY LEVEL *</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as FirPriority)}
                    className="w-full h-11 px-3.5 bg-[#0F172A] border border-[#1E293B] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white outline-none cursor-pointer transition-all duration-200"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">SPECIFIC LOCATION DETAILS *</label>
                <input
                  type="text"
                  required
                  placeholder="Street address, building number, slip details..."
                  value={locationDetails}
                  onChange={(e) => setLocationDetails(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#0F172A] border border-[#1E293B] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white outline-none transition-all duration-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">DETAILED INCIDENT DESCRIPTION *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide comprehensive details of incident, suspects involved, stolen items, weapons used..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3.5 bg-[#0F172A] border border-[#1E293B] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white outline-none resize-none transition-all duration-200"
                />
              </div>

              <div className="pt-4 border-t border-[#1E293B] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="h-11 px-5 bg-[#0F172A] hover:bg-slate-800 border border-[#1E293B] text-slate-300 font-semibold rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
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

