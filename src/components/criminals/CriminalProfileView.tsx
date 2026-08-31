import React, { useState } from 'react';
import { CriminalProfile } from '../../types';
import { generateUUID } from '../../utils/crypto';
import {
  UserCheck,
  Search,
  Filter,
  Plus,
  ShieldAlert,
  Zap,
  Award,
  Users,
  Eye,
  X,
} from 'lucide-react';

interface CriminalProfileViewProps {
  criminals: CriminalProfile[];
  onAddCriminal: (newCriminal: CriminalProfile) => void;
}

export const CriminalProfileView: React.FC<CriminalProfileViewProps> = ({
  criminals,
  onAddCriminal,
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
    const matchesSearch =
      crim.codeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crim.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crim.aliases.some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()));

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
    // Reset
    setCodeName('');
    setLegalName('');
    setAliases('');
    setPhotoUrl('');
    setModusOperandi('');
    setPastConvictions('');
  };

  const threatBadges = {
    EXTREME: 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse',
    HIGH: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    MEDIUM: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
    LOW: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
  };

  const statusBadges = {
    WANTED: 'bg-red-500/20 text-red-400 border-red-500/40 font-bold',
    IN_CUSTODY: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    UNDER_SURVEILLANCE: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    CLEARED: 'bg-slate-800 text-slate-400',
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-amber-400" />
            Criminal & Suspect Dossier Registry
          </h2>
          <p className="text-xs text-slate-400">
            Known offender profiles, mugshots, threat scores, modus operandi, and conviction histories
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Suspect Dossier</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid sm:grid-cols-12 gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Alias, Legal Name, Code Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-slate-200 outline-none"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={threatFilter}
            onChange={(e) => setThreatFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">All Threat Levels</option>
            <option value="EXTREME">Extreme Threat</option>
            <option value="HIGH">High Threat</option>
            <option value="MEDIUM">Medium Threat</option>
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 outline-none cursor-pointer"
          >
            <option value="ALL">All Legal Statuses</option>
            <option value="WANTED">Wanted</option>
            <option value="IN_CUSTODY">In Custody</option>
            <option value="UNDER_SURVEILLANCE">Under Surveillance</option>
          </select>
        </div>
      </div>

      {/* Grid of Suspect Dossier Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCriminals.map((crim) => (
          <div
            key={crim.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between transition-all group"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={crim.photoUrl || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80'}
                  alt={crim.legalName}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80';
                  }}
                  className="w-16 h-20 rounded-xl object-cover border-2 border-slate-700 group-hover:border-amber-500 transition-colors shadow-lg"
                />
                <div className="space-y-1 min-w-0 flex-1">
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${threatBadges[crim.threatLevel]}`}>
                    {crim.threatLevel} THREAT
                  </span>
                  <h3 className="text-base font-bold text-slate-100 truncate">{crim.codeName}</h3>
                  <div className="text-xs text-slate-300 truncate">{crim.legalName}</div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Aliases: {crim.aliases.join(', ') || 'None'}
                  </div>
                </div>
              </div>

              {/* Modus Operandi Tags */}
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase">MODUS OPERANDI:</span>
                <div className="flex flex-wrap gap-1">
                  {crim.modusOperandi.map((mo, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 text-amber-400" />
                      {mo}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusBadges[crim.status]}`}>
                {crim.status.replace(/_/g, ' ')}
              </span>

              <button
                onClick={() => setSelectedCriminal(crim)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 text-slate-200 font-semibold text-xs rounded-xl flex items-center gap-1 transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                Full Dossier
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Suspect Full Dossier Modal */}
      {selectedCriminal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <div className="flex items-center gap-3">
                <img
                  src={selectedCriminal.photoUrl || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80'}
                  alt={selectedCriminal.legalName}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80';
                  }}
                  className="w-10 h-10 rounded-lg object-cover border border-amber-500"
                />
                <div>
                  <span className="text-xs font-mono font-bold text-amber-400">{selectedCriminal.codeName}</span>
                  <h3 className="text-lg font-bold text-slate-100">{selectedCriminal.legalName}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedCriminal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              {/* Mugshot Image Header */}
              <div className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-950 border border-slate-800 rounded-2xl items-center sm:items-start">
                <div className="relative group flex-shrink-0">
                  <img
                    src={selectedCriminal.photoUrl || 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80'}
                    alt={selectedCriminal.legalName}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80';
                    }}
                    className="w-28 h-36 rounded-xl object-cover border-2 border-amber-500/50 shadow-2xl"
                  />
                  <div className="absolute bottom-1 right-1 bg-slate-950/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-amber-400 border border-amber-500/30">
                    MUGSHOT #01
                  </div>
                </div>
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${threatBadges[selectedCriminal.threatLevel]}`}>
                      {selectedCriminal.threatLevel} THREAT
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${statusBadges[selectedCriminal.status]}`}>
                      {selectedCriminal.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-100">{selectedCriminal.codeName}</h4>
                  <p className="text-xs text-slate-300 font-medium">Legal Name: {selectedCriminal.legalName}</p>
                  <p className="text-[11px] font-mono text-slate-400">
                    Known Aliases: {selectedCriminal.aliases.join(', ') || 'None registered'}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400">
                    Distinguishing Marks: {selectedCriminal.scarsOrTattoos.join(', ') || 'None noted'}
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-4 gap-3 text-center">
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-mono text-slate-500 block">DOB</span>
                  <span className="font-bold text-slate-200">{selectedCriminal.dateOfBirth}</span>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-mono text-slate-500 block">HEIGHT</span>
                  <span className="font-bold text-slate-200">{selectedCriminal.height}</span>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-mono text-slate-500 block">BUILD</span>
                  <span className="font-bold text-slate-200">{selectedCriminal.build}</span>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-mono text-slate-500 block">GENDER</span>
                  <span className="font-bold text-slate-200">{selectedCriminal.gender}</span>
                </div>
              </div>

              {/* Past Convictions */}
              <div className="space-y-2">
                <h4 className="font-mono font-bold text-slate-300 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  PAST CRIMINAL CONVICTIONS:
                </h4>
                <div className="space-y-1">
                  {selectedCriminal.pastConvictions.map((c, i) => (
                    <div key={i} className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-300">
                      • {c}
                    </div>
                  ))}
                </div>
              </div>

              {/* Known Associates */}
              {selectedCriminal.knownAssociates.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-mono font-bold text-slate-300 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-cyan-400" />
                    KNOWN ASSOCIATES & SYNDICATE LINKS:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCriminal.knownAssociates.map((assoc, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-950 border border-slate-800 text-slate-200 rounded-lg">
                        {assoc}
                      </span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-amber-400" />
                Add Suspect / Criminal Profile Dossier
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800"
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
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
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
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-mono mb-1 block">MUGSHOT / PROFILE PHOTO URL</label>
                <div className="flex items-center gap-3">
                  <img
                    src={photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'}
                    alt="Mugshot Preview"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/mugshot/200/260';
                    }}
                    className="w-12 h-14 rounded-lg object-cover border-2 border-red-500/60 shrink-0 shadow"
                  />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or leave empty for default mugshot"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none text-xs"
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
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-mono mb-1 block">THREAT LEVEL</label>
                  <select
                    value={threatLevel}
                    onChange={(e) => setThreatLevel(e.target.value as CriminalProfile['threatLevel'])}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none cursor-pointer"
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
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none cursor-pointer"
                  >
                    <option value="WANTED">Wanted</option>
                    <option value="IN_CUSTODY">In Custody</option>
                    <option value="UNDER_SURVEILLANCE">Under Surveillance</option>
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
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-mono mb-1 block">PAST CONVICTIONS</label>
                <input
                  type="text"
                  placeholder="Armed Robbery (2018), Grand Theft Auto (2015)"
                  value={pastConvictions}
                  onChange={(e) => setPastConvictions(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl shadow-lg"
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
