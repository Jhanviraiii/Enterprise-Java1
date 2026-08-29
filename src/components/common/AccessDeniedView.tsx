import React from 'react';
import { User, UserRole } from '../../types';
import { getRoleBadge } from '../../utils/rbac';
import { ShieldAlert, Lock, ArrowLeft, KeyRound, AlertTriangle } from 'lucide-react';

interface AccessDeniedViewProps {
  currentUser: User;
  attemptedModule: string;
  onNavigate: (module: string) => void;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  currentUser,
  attemptedModule,
  onNavigate,
}) => {
  const roleBadge = getRoleBadge(currentUser.role);

  const moduleTitles: Record<string, string> = {
    users: 'User Management & Security Audit Logs',
    criminals: 'Offender & Suspect Registry',
    evidence: 'Digital Evidence Vault',
    investigation: 'Investigation Case Diary Board',
    pattern: 'AI Pattern Detection Engine',
    iptracing: 'Location IP Tracing',
    loganalysis: 'Fast Log Analysis',
  };

  const title = moduleTitles[attemptedModule] || attemptedModule.toUpperCase();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-[#111827] border border-red-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Shield Alert Icon */}
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto shadow-lg">
          <ShieldAlert className="w-8 h-8 text-red-400 animate-pulse" />
        </div>

        {/* Header Message */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[11px] font-bold tracking-wider uppercase">
            <Lock className="w-3.5 h-3.5" />
            <span>SECURITY CLEARANCE RESTRICTED</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Access Restricted</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            You do not have the required role-based authorization to access <span className="text-slate-200 font-semibold">{title}</span>.
          </p>
        </div>

        {/* User Role Card */}
        <div className="p-4 bg-[#0F172A] border border-[#1E293B] rounded-xl space-y-2 text-left">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">ACTIVE USER:</span>
            <span className="text-white font-bold">{currentUser.name}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">BADGE NUMBER:</span>
            <span className="text-blue-400 font-mono font-bold">{currentUser.badgeNumber}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono">CURRENT ROLE:</span>
            <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold border ${roleBadge.bg} ${roleBadge.color}`}>
              {roleBadge.badge}
            </span>
          </div>
          <div className="pt-2 border-t border-[#1E293B] text-[11px] text-slate-400 flex items-start gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>{roleBadge.description}</span>
          </div>
        </div>

        {/* Return Button */}
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => onNavigate('analytics')}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Analytics & Hotspots</span>
          </button>
        </div>
      </div>
    </div>
  );
};
