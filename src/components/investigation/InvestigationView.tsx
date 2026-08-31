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
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <Kanban className="w-6 h-6 text-amber-400" />
            Case Investigation & Status Flow Board
          </h2>
          <p className="text-xs text-slate-400">
            Lifecycle case board (Open → Under Investigation → Solved → Closed) & chronological timeline notes
          </p>
        </div>
      </div>

      {/* Case Board Kanban Columns */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusColumns.map((colStatus) => {
          const casesInCol = crimeRecords.filter((c) => c.status === colStatus);

          return (
            <div key={colStatus} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-mono font-bold text-slate-200">
                  {colStatus.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] font-mono font-bold bg-slate-800 text-amber-400 px-2 py-0.5 rounded">
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
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-slate-950 border-amber-500 shadow-xl ring-1 ring-amber-500/30'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-amber-400">{c.caseNumber}</span>
                        <span className="text-[9px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                          {c.district}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-100 leading-snug">{c.title}</h4>
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400">{selectedCase.caseNumber}</span>
            <h3 className="text-lg font-bold text-slate-100">{selectedCase.title}</h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono">TRANSITION CASE STATUS:</span>
            {statusColumns.map((st) => (
              <button
                key={st}
                onClick={() => {
                  onUpdateStatus(selectedCase.id, st);
                  setSelectedCase({ ...selectedCase, status: st });
                }}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-semibold transition-all ${
                  selectedCase.status === st
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Add Investigation Note Entry Form */}
        <form onSubmit={handleAddNoteSubmit} className="space-y-3 bg-slate-950 border border-slate-800 p-4 rounded-xl">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="font-bold text-slate-200 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              Log Chronological Investigation Note
            </span>
            <select
              value={newNoteCategory}
              onChange={(e) => setNewNoteCategory(e.target.value as any)}
              className="bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg text-slate-300 outline-none cursor-pointer"
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
              className="flex-1 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              Log Note
            </button>
          </div>
        </form>

        {/* Chronological Timeline */}
        <div className="space-y-4">
          <h4 className="text-xs font-mono font-bold text-slate-400 uppercase">
            CHRONOLOGICAL INVESTIGATION TIMELINE ({caseNotes.length} ENTRIES)
          </h4>

          <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
            {caseNotes.map((n) => (
              <div key={n.id} className="relative pl-8 space-y-1">
                <div className="absolute left-1.5 top-2 w-4 h-4 rounded-full bg-amber-500 border-2 border-slate-900" />
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
                        alt={n.authorName}
                        referrerPolicy="no-referrer"
                        className="w-6 h-6 rounded-full object-cover border border-amber-500/50"
                      />
                      <span className="font-bold text-slate-100">{n.authorName}</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {n.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.content}</p>
                  <div className="text-[10px] font-mono text-slate-500 pt-1">{n.timestamp}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
