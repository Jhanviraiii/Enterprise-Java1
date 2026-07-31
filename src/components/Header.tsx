import React, { useState, useEffect } from 'react';
import { User, UserRole, PatternAlert } from '../types';
import { Shield, Clock, Bell, Sparkles, ChevronDown, LogOut, Check, Terminal } from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onRoleSwitch: (role: UserRole) => void;
  onLogout: () => void;
  onOpenDemoGuide: () => void;
  onNavigate: (module: string) => void;
  patternAlerts: PatternAlert[];
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleSwitch,
  onLogout,
  onOpenDemoGuide,
  onNavigate,
  patternAlerts,
}) => {
  const [timeStr, setTimeStr] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isAlertDropdownOpen, setIsAlertDropdownOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }) + ' UTC-7');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const unreviewedCount = patternAlerts.filter((a) => a.status === 'UNREVIEWED').length;

  const roleLabels: Record<UserRole, { title: string; badge: string; color: string }> = {
    ADMIN: { title: 'System Administrator', badge: 'ADMIN', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    POLICE_OFFICER: { title: 'Police Patrol Officer', badge: 'PATROL', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    INVESTIGATOR: { title: 'Lead Detective / Investigator', badge: 'DETECTIVE', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    FORENSIC_OFFICER: { title: 'Forensic Lab Analyst', badge: 'FORENSICS', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  };

  return (
    <header className="h-16 bg-[#0b0f19] border-b border-slate-800/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-40 select-none">
      {/* Brand & System Status */}
      <div className="flex items-center gap-3 md:gap-4">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('analytics')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-100 tracking-wider text-base font-mono">SCAP</span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
                ENTERPRISE v2.4
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">Smart Crime Analytics Portal</p>
          </div>
        </div>

        {/* Command Center Clock */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>{timeStr}</span>
        </div>
      </div>

      {/* Action Controls & User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Evaluator Guided Demo Walkthrough Button */}
        <button
          onClick={onOpenDemoGuide}
          className="px-3 py-1.5 bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 border border-amber-500/40 text-amber-300 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-all shadow-lg shadow-amber-500/5"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Evaluator Demo Guide</span>
        </button>

        {/* Pattern Detection Notification Icon */}
        <div className="relative">
          <button
            onClick={() => setIsAlertDropdownOpen(!isAlertDropdownOpen)}
            className="p-2 text-slate-400 hover:text-slate-100 bg-slate-900 border border-slate-800 rounded-lg transition-colors relative"
            title="Pattern Detection Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreviewedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-slate-950 text-[10px] font-bold flex items-center justify-center animate-bounce">
                {unreviewedCount}
              </span>
            )}
          </button>

          {/* Pattern Alert Quick Dropdown */}
          {isAlertDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  Pattern Detection Alerts
                </span>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {unreviewedCount} NEW
                </span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {patternAlerts.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      setIsAlertDropdownOpen(false);
                      onNavigate('pattern');
                    }}
                    className="p-2 bg-slate-950/60 hover:bg-slate-800 border border-slate-800/80 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200 truncate max-w-[180px]">
                        {alert.title}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                        {alert.similarityScore}% MATCH
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                      {alert.matchedFactors[0]}
                    </p>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setIsAlertDropdownOpen(false);
                  onNavigate('pattern');
                }}
                className="w-full mt-2 py-1.5 text-center text-xs font-semibold text-amber-400 hover:text-amber-300 bg-amber-500/10 rounded-lg transition-colors"
              >
                Launch Pattern Detection Center →
              </button>
            </div>
          )}
        </div>

        {/* Quick Role Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-7 h-7 rounded-lg object-cover border border-slate-700"
            />
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold text-slate-200 truncate max-w-[120px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400">
                {roleLabels[currentUser.role]?.title}
              </div>
            </div>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${roleLabels[currentUser.role]?.color}`}
            >
              {roleLabels[currentUser.role]?.badge}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {/* Role Dropdown Menu */}
          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 p-2">
              <div className="px-3 py-2 border-b border-slate-800 mb-1">
                <p className="text-[11px] uppercase font-mono text-slate-400 font-semibold">
                  Switch Active Role (Evaluator Mode)
                </p>
              </div>
              <div className="space-y-1">
                {(['ADMIN', 'POLICE_OFFICER', 'INVESTIGATOR', 'FORENSIC_OFFICER'] as UserRole[]).map(
                  (role) => (
                    <button
                      key={role}
                      onClick={() => {
                        onRoleSwitch(role);
                        setIsRoleDropdownOpen(false);
                      }}
                      className={`w-full p-2 rounded-lg text-left flex items-center justify-between text-xs transition-colors ${
                        currentUser.role === role
                          ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">{roleLabels[role].title}</div>
                        <div className="text-[10px] text-slate-400">Badge Role: {role}</div>
                      </div>
                      {currentUser.role === role && (
                        <Check className="w-4 h-4 text-amber-400" />
                      )}
                    </button>
                  )
                )}
              </div>

              <div className="pt-2 border-t border-slate-800 mt-2">
                <button
                  onClick={() => {
                    setIsRoleDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full p-2 text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-semibold flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
