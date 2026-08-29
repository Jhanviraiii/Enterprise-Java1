import React, { useState } from 'react';
import { CrimeRecord, InvestigationNote, User } from '../../types';
import { generateUUID } from '../../utils/crypto';
import {
  Kanban,
  Plus,
  Clock,
  UserCheck,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Send,
} from 'lucide-react';

interface InvestigationViewProps {
  crimeRecords: CrimeRecord[];
  notes: InvestigationNote[];
  currentUser: User;
  onAddNote: (newNote: InvestigationNote) => void;
  onUpdateStatus: (caseId: string, status: CrimeRecord['status']) => void;
}

export const InvestigationView: React.FC<InvestigationViewProps> = ({
  crimeRecords,
  notes,
  currentUser,
  onAddNote,
  onUpdateStatus,
}) => {
  const [selectedCase, setSelectedCase] = useState<CrimeRecord>(crimeRecords[0] || crimeRecords[0]);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<InvestigationNote['category']>('LEAD');

  const caseNotes = notes.filter((n) => n.caseId === selectedCase.id);

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const note: InvestigationNote = {
      id: generateUUID(),
      caseId: selectedCase.id,
      timestamp: nowStr,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      content: newNoteContent,
      category: newNoteCategory,
    };

    onAddNote(note);
    setNewNoteContent('');
  };

  const statusColumns: CrimeRecord['status'][] = ['OPEN', 'UNDER_INVESTIGATION', 'SOLVED', 'CLOSED'];

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] font-bold tracking-wider uppercase">
            <Kanban className="w-3.5 h-3.5" />
            <span>CASE LIFECYCLE & BOARD</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Case Investigation & Status Flow Board
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Lifecycle case board (Open → Under Investigation → Solved → Closed) and chronological detective timeline notes.
          </p>
        </div>
      </div>

      {/* Case Board Kanban Columns */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusColumns.map((colStatus) => {
          const casesInCol = crimeRecords.filter((c) => c.status === colStatus);

          return (
            <div key={colStatus} className="bg-[#111827] border border-[#1E293B] rounded-2xl p-4 space-y-3 flex flex-col shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
                <span className="text-xs font-mono font-bold text-white">
                  {colStatus.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-md">
                  {casesInCol.length}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                {casesInCol.map((c) => {
                  const isSelected = selectedCase.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCase(c)}
                      className={`p-3.5 rounded-[14px] border transition-all duration-200 cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-[#0F172A] border-blue-500 shadow-md ring-1 ring-blue-500/30'
                          : 'bg-[#0F172A] border-[#1E293B] hover:border-slate-700 hover:-translate-y-0.5 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-blue-400">{c.caseNumber}</span>
                        <span className="text-[9px] font-mono bg-[#111827] text-slate-400 px-2 py-0.5 rounded-md border border-[#1E293B]">
                          {c.district}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-white leading-snug tracking-tight">{c.title}</h4>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Investigator: {c.assignedInvestigatorName}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Case Investigation Notes Timeline & Entry */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E293B] pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-blue-400">{selectedCase.caseNumber}</span>
            <h3 className="text-lg font-bold text-white">{selectedCase.title}</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">TRANSITION STATUS:</span>
            {statusColumns.map((st) => (
              <button
                key={st}
                onClick={() => {
                  onUpdateStatus(selectedCase.id, st);
                  setSelectedCase({ ...selectedCase, status: st });
                }}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-mono font-semibold transition-all duration-200 ${
                  selectedCase.status === st
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-[#0F172A] border border-[#1E293B] text-slate-400 hover:text-white'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Add Investigation Note Entry Form */}
        <form onSubmit={handleAddNoteSubmit} className="space-y-3 bg-[#0F172A] border border-[#1E293B] p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="font-bold text-white flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-blue-400" />
              Log Chronological Investigation Note
            </span>
            <select
              value={newNoteCategory}
              onChange={(e) => setNewNoteCategory(e.target.value as any)}
              className="bg-[#111827] border border-[#1E293B] px-3 py-1 rounded-xl text-slate-300 outline-none cursor-pointer"
            >
              <option value="LEAD">Investigative Lead</option>
              <option value="INTERROGATION">Interrogation Finding</option>
              <option value="FORENSIC_UPDATE">Forensic Update</option>
              <option value="SURVEILLANCE">Surveillance Log</option>
              <option value="CASE_DECISION">Case Decision</option>
            </select>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              required
              placeholder="Enter detailed investigation note, suspect response, or evidence lead..."
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="flex-1 px-4 py-2 bg-[#111827] border border-[#1E293B] rounded-xl text-xs text-white outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shrink-0 transition-colors duration-200 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              Log Note
            </button>
          </div>
        </form>

        {/* Chronological Timeline */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            CHRONOLOGICAL INVESTIGATION TIMELINE ({caseNotes.length} ENTRIES)
          </h4>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#1E293B]">
            {caseNotes.map((n) => (
              <div key={n.id} className="relative pl-8 space-y-1">
                <div className="absolute left-1.5 top-2 w-4 h-4 rounded-full bg-blue-500 border-2 border-[#111827]" />
                <div className="p-4 bg-[#0F172A] border border-[#1E293B] rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{n.authorName}</span>
                    <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-md border border-blue-500/20">
                      {n.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.content}</p>
                  <div className="text-[10px] font-mono text-slate-400 pt-1">{n.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

