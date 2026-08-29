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
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] font-bold tracking-wider uppercase">
            <Users className="w-3.5 h-3.5" />
            <span>WITNESS & VICTIM PROTECTION</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Victim & Witness Protection Management
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Recorded testimonies, protected witness identities, credibility assessments, and victim support tracking.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="h-11 px-5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all duration-200 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record Statement & Protect Person</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1E293B] pb-3">
        <button
          onClick={() => setActiveTab('VICTIMS')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 ${
            activeTab === 'VICTIMS'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-[#111827] border border-[#1E293B] text-slate-400 hover:text-white'
          }`}
        >
          Victim Records ({victims.length})
        </button>
        <button
          onClick={() => setActiveTab('WITNESSES')}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 ${
            activeTab === 'WITNESSES'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-[#111827] border border-[#1E293B] text-slate-400 hover:text-white'
          }`}
        >
          Witness Depositions ({witnesses.length})
        </button>
      </div>

      {/* Cards List */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeTab === 'VICTIMS'
          ? victims.map((v) => (
              <div
                key={v.id}
                className="bg-[#111827] border border-[#1E293B] hover:border-slate-700 rounded-[14px] p-5 shadow-sm hover:shadow-md space-y-3 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-tight">{v.name}</span>
                  {v.isConfidential && (
                    <span className="text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-md">
                      CONFIDENTIAL
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-slate-400">Contact: {v.contactNumber}</div>
                <div className="p-3 bg-[#0F172A] border border-[#1E293B] rounded-xl text-xs text-slate-300 italic leading-relaxed">
                  "{v.statement}"
                </div>
              </div>
            ))
          : witnesses.map((w) => (
              <div
                key={w.id}
                className="bg-[#111827] border border-[#1E293B] hover:border-slate-700 rounded-[14px] p-5 shadow-sm hover:shadow-md space-y-3 transition-all duration-200 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white tracking-tight">{w.name}</span>
                  <span className="text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-0.5 rounded-md">
                    {w.credibilityRating} CREDIBILITY
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">Contact: {w.contactNumber}</div>
                <div className="p-3 bg-[#0F172A] border border-[#1E293B] rounded-xl text-xs text-slate-300 italic leading-relaxed">
                  "{w.statement}"
                </div>
              </div>
            ))}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">
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
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white outline-none"
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
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white outline-none"
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
                  className="w-full px-3 py-2 bg-[#0F172A] border border-[#1E293B] rounded-xl text-white outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="confidential"
                  checked={isConfidential}
                  onChange={(e) => setIsConfidential(e.target.checked)}
                  className="rounded bg-[#0F172A] border-[#1E293B] text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="confidential" className="text-slate-300 font-mono">
                  Protect / Confidential Identity Flag
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#0F172A] border border-[#1E293B] text-slate-300 font-semibold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-sm transition-colors"
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
