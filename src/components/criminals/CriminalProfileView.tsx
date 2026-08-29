import React, { useState } from 'react';
import { CriminalProfile } from '../../types';
import { generateUUID } from '../../utils/crypto';
import {
  UserCheck,
  Search,
  Plus,
  Award,
  Users,
  Eye,
  X,
  SearchX,
  Trash2,
  Edit3,
} from 'lucide-react';

interface CriminalProfileViewProps {
  criminals: CriminalProfile[];
  onAddCriminal: (newCriminal: CriminalProfile) => void;
  onUpdateCriminal?: (updatedCriminal: CriminalProfile) => void;
  onDeleteCriminal?: (id: string) => void;
}

export const CriminalProfileView: React.FC<CriminalProfileViewProps> = ({
  criminals,
  onAddCriminal,
  onUpdateCriminal,
  onDeleteCriminal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [threatFilter, setThreatFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedCriminal, setSelectedCriminal] = useState<CriminalProfile | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [codeName, setCodeName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [aliases, setAliases] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [threatLevel, setThreatLevel] = useState<CriminalProfile['threatLevel']>('HIGH');
  const [modusOperandi, setModusOperandi] = useState('');
  const [pastConvictions, setPastConvictions] = useState('');
  const [status, setStatus] = useState<CriminalProfile['status']>('WANTED');

  const filteredCriminals = criminals.filter((crim) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      (crim.codeName && crim.codeName.toLowerCase().includes(searchLower)) ||
      (crim.legalName && crim.legalName.toLowerCase().includes(searchLower)) ||
      (Array.isArray(crim.aliases) && crim.aliases.some((a) => a.toLowerCase().includes(searchLower)));

    const matchesThreat = threatFilter === 'ALL' || crim.threatLevel === threatFilter;
    const matchesStatus = statusFilter === 'ALL' || crim.status === statusFilter;

    return matchesSearch && matchesThreat && matchesStatus;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: CriminalProfile = {
      id: generateUUID(),
      codeName: codeName || legalName,
      legalName,
      aliases: aliases.split(',').map((a) => a.trim()).filter(Boolean),
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      dateOfBirth: '1990-01-01',
      gender: 'Male',
      height: '6 ft 0 in',
      build: 'Medium',
      scarsOrTattoos: ['Unspecified tattoos'],
      threatLevel,
      modusOperandi: modusOperandi.split(',').map((m) => m.trim()).filter(Boolean),
      pastConvictions: pastConvictions.split(',').map((c) => c.trim()).filter(Boolean),
      knownAssociates: [],
      status,
      linkedCaseIds: [],
    };

    onAddCriminal(newProfile);
    setIsAddModalOpen(false);
    // Reset form
    setCodeName('');
    setLegalName('');
    setAliases('');
    setPhotoUrl('');
    setModusOperandi('');
    setPastConvictions('');
  };

  const threatBadges: Record<string, string> = {
    EXTREME: 'bg-red-500/10 text-red-400 border-red-500/20 font-bold',
    HIGH: 'bg-amber-500/10 text-amber-400 border-amber-500/20 font-semibold',
    MEDIUM: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
    LOW: 'bg-slate-800 text-slate-400 border-slate-700',
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] font-bold tracking-wider uppercase">
            <UserCheck className="w-3.5 h-3.5" />
            <span>OFFENDER & SUSPECT REGISTRY</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Criminal & Suspect Dossier Registry
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Known offender profiles, mugshots, threat scores, modus operandi, and conviction histories synced with Supabase.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="h-11 px-5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all duration-200 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Suspect Dossier</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid sm:grid-cols-12 gap-3 bg-[#111827] border border-[#1E293B] rounded-xl p-4 shadow-sm">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Alias, Legal Name, Code Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0F172A] border border-[#1E293B] focus:border-blue-500/60 rounded-xl text-xs text-white outline-none transition-colors"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={threatFilter}
            onChange={(e) => setThreatFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-xl text-xs text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">All Threat Levels</option>
            <option value="EXTREME">Extreme Threat</option>
            <option value="HIGH">High Threat</option>
            <option value="MEDIUM">Medium Threat</option>
            <option value="LOW">Low Threat</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-xl text-xs text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">All Legal Statuses</option>
            <option value="WANTED">Wanted</option>
            <option value="IN_CUSTODY">In Custody</option>
            <option value="UNDER_SURVEILLANCE">Under Surveillance</option>
            <option value="CLEARED">Cleared</option>
          </select>
        </div>
      </div>

      {/* Grid of Suspect Dossier Cards OR Empty State */}
      {filteredCriminals.length === 0 ? (
        <div className="p-12 text-center bg-[#111827] border border-[#1E293B] rounded-2xl space-y-3 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto text-blue-400">
            <SearchX className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-white tracking-tight">No Matching Suspect Dossiers Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            No suspect profiles match your current search query or active threat filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setThreatFilter('ALL');
              setStatusFilter('ALL');
            }}
            className="px-4 py-2 bg-[#0F172A] hover:bg-slate-800 border border-[#1E293B] text-blue-400 font-semibold text-xs rounded-xl transition-colors duration-200 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCriminals.map((crim) => (
            <div
              key={crim.id}
              className="bg-[#111827] border border-[#1E293B] hover:border-slate-700 rounded-[14px] p-5 shadow-sm hover:shadow-md space-y-4 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 group"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <img
                    src={crim.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
                    alt={crim.legalName}
                    className="w-16 h-20 rounded-xl object-cover border border-[#1E293B] group-hover:border-blue-500 transition-colors shadow-sm shrink-0"
                  />
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-md border ${threatBadges[crim.threatLevel] || 'bg-slate-800 text-slate-400'}`}>
                      {crim.threatLevel} THREAT
                    </span>
                    <h3 className="text-base font-bold text-white truncate tracking-tight">{crim.codeName || crim.aliases?.[0] || crim.legalName}</h3>
                    <div className="text-xs text-slate-300 truncate">{crim.legalName}</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">MODUS OPERANDI:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(crim.modusOperandi) && crim.modusOperandi.length > 0 ? (
                      crim.modusOperandi.slice(0, 2).map((mo, i) => (
                        <span key={i} className="text-[10px] bg-[#0F172A] text-slate-300 px-2.5 py-0.5 rounded-md border border-[#1E293B]">
                          {mo}
                        </span>
                      ))
                    ) : (
                      <span className="text-[10px] text-slate-500 italic">No MO recorded</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {crim.status ? crim.status.replace(/_/g, ' ') : 'WANTED'}
                </span>

                <div className="flex items-center gap-2">
                  {onDeleteCriminal && (
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete profile for ${crim.legalName}?`)) {
                          onDeleteCriminal(crim.id);
                        }
                      }}
                      className="p-1.5 bg-[#0F172A] hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-[#1E293B] rounded-xl transition-colors cursor-pointer"
                      title="Delete Profile"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedCriminal(crim)}
                    className="px-3 py-1.5 bg-[#0F172A] hover:bg-blue-600/10 border border-[#1E293B] text-blue-400 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors duration-200 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Dossier</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Suspect Full Dossier Modal */}
      {selectedCriminal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-[#1E293B] flex items-center justify-between bg-[#0F172A]">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCriminal.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200'}
                  alt={selectedCriminal.legalName}
                  className="w-10 h-10 rounded-lg object-cover border border-blue-500"
                />
                <div>
                  <span className="text-xs font-mono font-bold text-blue-400">{selectedCriminal.codeName}</span>
                  <h3 className="text-lg font-bold text-white">{selectedCriminal.legalName}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedCriminal(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs custom-scrollbar">
              <div className="grid sm:grid-cols-4 gap-3 text-center">
                <div className="p-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xl">
                  <span className="text-[10px] font-mono text-slate-400 block">DOB</span>
                  <span className="font-bold text-white">{selectedCriminal.dateOfBirth || '1990-01-01'}</span>
                </div>
                <div className="p-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xl">
                  <span className="text-[10px] font-mono text-slate-400 block">HEIGHT</span>
                  <span className="font-bold text-white">{selectedCriminal.height || '6 ft 0 in'}</span>
                </div>
                <div className="p-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xl">
                  <span className="text-[10px] font-mono text-slate-400 block">BUILD</span>
                  <span className="font-bold text-white">{selectedCriminal.build || 'Medium'}</span>
                </div>
                <div className="p-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xl">
                  <span className="text-[10px] font-mono text-slate-400 block">GENDER</span>
                  <span className="font-bold text-white">{selectedCriminal.gender || 'Male'}</span>
                </div>
              </div>

              {/* Modus Operandi Details */}
              <div className="space-y-2">
                <h4 className="font-mono font-bold text-slate-300">MODUS OPERANDI:</h4>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(selectedCriminal.modusOperandi) && selectedCriminal.modusOperandi.length > 0 ? (
                    selectedCriminal.modusOperandi.map((mo, i) => (
                      <span key={i} className="px-3 py-1 bg-[#0F172A] border border-[#1E293B] text-slate-200 rounded-lg">
                        {mo}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic">No MO recorded</span>
                  )}
                </div>
              </div>

              {/* Past Convictions */}
              <div className="space-y-2">
                <h4 className="font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-blue-400" />
                  PAST CRIMINAL CONVICTIONS:
                </h4>
                <div className="space-y-1">
                  {Array.isArray(selectedCriminal.pastConvictions) && selectedCriminal.pastConvictions.length > 0 ? (
                    selectedCriminal.pastConvictions.map((c, i) => (
                      <div key={i} className="p-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xl text-slate-300">
                        • {c}
                      </div>
                    ))
                  ) : (
                    <div className="p-2.5 bg-[#0F172A] border border-[#1E293B] rounded-xl text-slate-500 italic">
                      No prior convictions logged in national database.
                    </div>
                  )}
                </div>
              </div>

              {/* Known Associates */}
              {Array.isArray(selectedCriminal.knownAssociates) && selectedCriminal.knownAssociates.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-mono font-bold text-slate-300 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-400" />
                    KNOWN ASSOCIATES & SYNDICATE LINKS:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCriminal.knownAssociates.map((assoc, i) => (
                      <span key={i} className="px-3 py-1 bg-[#0F172A] border border-[#1E293B] text-slate-200 rounded-lg">
                        {assoc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Update Quick Controls */}
              {onUpdateCriminal && (
                <div className="pt-4 border-t border-[#1E293B] flex items-center justify-between">
                  <span className="text-slate-400 font-mono">UPDATE LEGAL STATUS:</span>
                  <div className="flex gap-2">
                    {(['WANTED', 'IN_CUSTODY', 'UNDER_SURVEILLANCE', 'CLEARED'] as CriminalProfile['status'][]).map((st) => (
                      <button
                        key={st}
                        onClick={() => {
                          const updated = { ...selectedCriminal, status: st };
                          onUpdateCriminal(updated);
                          setSelectedCriminal(updated);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold border cursor-pointer transition-colors ${
                          selectedCriminal.status === st
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-[#0F172A] text-slate-400 border-[#1E293B] hover:text-white'
                        }`}
                      >
                        {st.replace(/_/g, ' ')}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Criminal Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-[#1E293B] flex items-center justify-between bg-[#0F172A]">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                Add Suspect / Criminal Profile Dossier
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-mono mb-1 block">CODE / ALIAS NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Specter"
                    value={codeName}
                    onChange={(e) => setCodeName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-mono mb-1 block">FULL LEGAL NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Darian Vance Rostoff"
                    value={legalName}
                    onChange={(e) => setLegalName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-mono mb-1 block">ALIASES (COMMA SEPARATED)</label>
                <input
                  type="text"
                  placeholder="Cipher, Ghost, Vance"
                  value={aliases}
                  onChange={(e) => setAliases(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-mono mb-1 block">THREAT LEVEL</label>
                  <select
                    value={threatLevel}
                    onChange={(e) => setThreatLevel(e.target.value as CriminalProfile['threatLevel'])}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white outline-none cursor-pointer"
                  >
                    <option value="EXTREME">Extreme Threat</option>
                    <option value="HIGH">High Threat</option>
                    <option value="MEDIUM">Medium Threat</option>
                    <option value="LOW">Low Threat</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-mono mb-1 block">LEGAL STATUS</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as CriminalProfile['status'])}
                    className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white outline-none cursor-pointer"
                  >
                    <option value="WANTED">Wanted</option>
                    <option value="IN_CUSTODY">In Custody</option>
                    <option value="UNDER_SURVEILLANCE">Under Surveillance</option>
                    <option value="CLEARED">Cleared</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-mono mb-1 block">MODUS OPERANDI (COMMA SEPARATED)</label>
                <input
                  type="text"
                  placeholder="Signal Jamming, Vault Breaching, Blue Sedan Escape"
                  value={modusOperandi}
                  onChange={(e) => setModusOperandi(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-mono mb-1 block">PAST CONVICTIONS</label>
                <input
                  type="text"
                  placeholder="Armed Robbery (2018), Grand Theft Auto (2015)"
                  value={pastConvictions}
                  onChange={(e) => setPastConvictions(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white outline-none"
                />
              </div>

              <div className="pt-3 border-t border-[#1E293B] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-[#0F172A] border border-[#1E293B] text-slate-300 font-semibold rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  Save Profile Dossier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
