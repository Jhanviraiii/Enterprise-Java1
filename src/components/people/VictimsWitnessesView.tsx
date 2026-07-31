import React, { useState } from 'react';
import { Victim, Witness } from '../../types';
import { generateUUID } from '../../utils/crypto';
import {
  Users,
  Shield,
  Eye,
  Lock,
  Plus,
  X,
  UserCheck,
  Phone,
  FileText,
} from 'lucide-react';

interface VictimsWitnessesViewProps {
  victims: Victim[];
  witnesses: Witness[];
  onAddVictim: (victim: Victim) => void;
  onAddWitness: (witness: Witness) => void;
}

export const VictimsWitnessesView: React.FC<VictimsWitnessesViewProps> = ({
  victims,
  witnesses,
  onAddVictim,
  onAddWitness,
}) => {
  const [activeTab, setActiveTab] = useState<'VICTIMS' | 'WITNESSES'>('VICTIMS');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [statement, setStatement] = useState('');
  const [isConfidential, setIsConfidential] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = generateUUID();

    if (activeTab === 'VICTIMS') {
      const v: Victim = {
        id,
        caseId: 'cr-1',
        name,
        age: 35,
        contactNumber,
        address: 'Confidential Address',
        statement,
        protectionStatus: isConfidential ? 'ACTIVE_PROTECTION' : 'NONE',
        isConfidential,
      };
      onAddVictim(v);
    } else {
      const w: Witness = {
        id,
        caseId: 'cr-1',
        name,
        contactNumber,
        statement,
        credibilityRating: 'HIGH',
        isProtected: isConfidential,
      };
      onAddWitness(w);
    }

    setIsModalOpen(false);
    setName('');
    setContactNumber('');
    setStatement('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Users className="w-6 h-6 text-amber-400" />
            Victim & Witness Protection Management
          </h2>
          <p className="text-xs text-slate-400">
            Recorded testimonies, protected witness identities, and victim support tracking
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add {activeTab === 'VICTIMS' ? 'Victim Record' : 'Witness Deposition'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('VICTIMS')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'VICTIMS'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Victim Records ({victims.length})
        </button>
        <button
          onClick={() => setActiveTab('WITNESSES')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
            activeTab === 'WITNESSES'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          Witness Depositions ({witnesses.length})
        </button>
      </div>

      {/* Cards List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === 'VICTIMS'
          ? victims.map((v) => (
              <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100">{v.name}</span>
                  {v.isConfidential && (
                    <span className="text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                      <Lock className="w-3 h-3" /> CONFIDENTIAL
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-slate-400">Contact: {v.contactNumber}</div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 italic leading-relaxed">
                  "{v.statement}"
                </div>
              </div>
            ))
          : witnesses.map((w) => (
              <div key={w.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100">{w.name}</span>
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                    {w.credibilityRating} CREDIBILITY
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">Contact: {w.contactNumber}</div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 italic leading-relaxed">
                  "{w.statement}"
                </div>
              </div>
            ))}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100">
              Add {activeTab === 'VICTIMS' ? 'Victim Record' : 'Witness Deposition'}
            </h3>
            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-mono mb-1 block">FULL NAME</label>
                <input
                  type="text"
                  required
                  placeholder="Legal name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-mono mb-1 block">CONTACT NUMBER</label>
                <input
                  type="text"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-mono mb-1 block">RECORDED STATEMENT</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record summary statement..."
                  value={statement}
                  onChange={(e) => setStatement(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="confidential"
                  checked={isConfidential}
                  onChange={(e) => setIsConfidential(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-amber-500 focus:ring-amber-500"
                />
                <label htmlFor="confidential" className="text-slate-300 font-mono">
                  Protect / Confidential Identity Flag
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
