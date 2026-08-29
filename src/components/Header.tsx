import React, { useState, useEffect } from 'react';
import { User, UserRole, PatternAlert } from '../types';
import { getRoleBadge } from '../utils/rbac';
import {
  Shield,
  Bell,
  Sparkles,
  ChevronDown,
  ChevronRight,
  LogOut,
  Check,
  Search,
  Activity,
  X,
  Home,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onRoleSwitch: (role: UserRole) => void;
  onLogout: () => void;
  onOpenDemoGuide: () => void;
  onNavigate: (module: string) => void;
  patternAlerts: PatternAlert[];
  activeModule?: string;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onRoleSwitch,
  onLogout,
  onOpenDemoGuide,
  onNavigate,
  patternAlerts,
  activeModule = 'analytics',
  onToggleMobileMenu,
}) => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isAlertDropdownOpen, setIsAlertDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const unreviewedCount = patternAlerts.filter((a) => a.status === 'UNREVIEWED').length;

  const moduleMetadata: Record<string, { category: string; title: string }> = {
    analytics: { category: 'Analytics', title: 'Analytics & Hotspots' },
    pattern: { category: 'AI Intelligence', title: 'Pattern Detection Engine' },
    iptracing: { category: 'Cyber Intel', title: 'Location IP Tracing' },
    loganalysis: { category: 'Cyber Intel', title: 'Fast Log Analysis' },
    firs: { category: 'Cases & Records', title: 'FIR Management' },
    crimes: { category: 'Cases & Records', title: 'Crime Records Master' },
    criminals: { category: 'Cases & Records', title: 'Criminal Profiles Dossiers' },
    evidence: { category: 'Forensics', title: 'Digital Evidence Vault' },
    investigation: { category: 'Forensics', title: 'Case Investigation Board' },
    people: { category: 'People Protection', title: 'Victims & Witnesses' },
    reports: { category: 'Reports', title: 'Official PDF Report Builder' },
    users: { category: 'Administration', title: 'User Management & Audit' },
  };

  const currentMeta = moduleMetadata[activeModule] || {
    category: 'Dashboard',
    title: 'Smart Crime Analytics',
  };

  const currentRoleBadge = getRoleBadge(currentUser.role);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    onNavigate('crimes');
  };

  return (
    <header className="h-16 bg-[#0F172A]/80 backdrop-blur-md border-b border-[#1E293B] px-4 sm:px-6 md:px-8 flex items-center justify-between sticky top-0 z-40 select-none shadow-sm transition-all">
      {/* Left: Brand Logo, Mobile Menu Button, Breadcrumbs & Dynamic Page Title */}
      <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 min-w-0">
        {/* Mobile Hamburger Trigger */}
        <button
          onClick={onToggleMobileMenu}
          className="p-2 text-slate-400 hover:text-white hover:bg-[#1E293B] rounded-xl lg:hidden transition-colors cursor-pointer shrink-0"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5 text-blue-400" />
        </button>

        <div
          onClick={() => onNavigate('analytics')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center group-hover:bg-blue-600/25 group-hover:border-blue-500/50 transition-all shadow-sm">
            <Shield className="w-4.5 h-4.5 text-blue-400" />
          </div>
          <span className="font-bold text-white tracking-tight text-sm sm:text-base font-sans hidden sm:inline-block">
            SCAP
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-[#1E293B] hidden sm:block shrink-0" />

        {/* Breadcrumb & Page Title Container */}
        <div className="min-w-0 flex flex-col justify-center">
          <nav className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400 truncate">
            <Home className="w-3 h-3 text-slate-400 shrink-0" />
            <span>Portal</span>
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="text-slate-400">{currentMeta.category}</span>
          </nav>
          <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
            {currentMeta.title}
          </h1>
        </div>
      </div>

      {/* Center: Global Search Bar */}
      <div className="hidden md:flex items-center justify-center flex-1 max-w-md mx-6">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases, FIRs, suspects, evidence..."
            className="w-full bg-[#111827]/80 border border-[#1E293B] focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/60 rounded-xl pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-400 outline-none transition-all duration-200"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-[#0F172A] border border-[#1E293B] rounded pointer-events-none">
              /
            </kbd>
          )}
        </form>
      </div>

      {/* Right: Actions, Notifications & User Avatar */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Mobile Search Toggle */}
        <button
          onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
          className="p-2 md:hidden text-slate-400 hover:text-white bg-[#111827] border border-[#1E293B] rounded-xl transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Demo Guide Action Button */}
        <button
          onClick={onOpenDemoGuide}
          className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all duration-200 shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden lg:inline">Demo Guide</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setIsAlertDropdownOpen(!isAlertDropdownOpen)}
            className="p-2 text-slate-400 hover:text-white bg-[#111827] border border-[#1E293B] hover:border-slate-700 rounded-xl transition-all duration-200 relative shadow-sm cursor-pointer"
            title="Notifications & Pattern Alerts"
          >
            <Bell className="w-4 h-4" />
            {unreviewedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center shadow-sm animate-pulse">
                {unreviewedCount}
              </span>
            )}
          </button>

          {/* Pattern Alert Dropdown Drawer */}
          {isAlertDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111827] border border-[#1E293B] rounded-2xl shadow-2xl z-50 p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1E293B]">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Pattern Detection Alerts
                </span>
                <span className="text-[10px] font-mono font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                  {unreviewedCount} NEW
                </span>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {patternAlerts.length > 0 ? (
                  patternAlerts.slice(0, 3).map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setIsAlertDropdownOpen(false);
                        onNavigate('pattern');
                      }}
                      className="p-3 bg-[#0F172A] hover:bg-slate-800/80 border border-[#1E293B] rounded-xl cursor-pointer transition-all duration-200 space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-white truncate max-w-[170px]">
                          {alert.title}
                        </span>
                        <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                          {alert.similarityScore}% MATCH
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {alert.matchedFactors[0]}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400 text-center py-4">No unreviewed pattern alerts</div>
                )}
              </div>

              <button
                onClick={() => {
                  setIsAlertDropdownOpen(false);
                  onNavigate('pattern');
                }}
                className="w-full py-2 text-center text-xs font-semibold text-blue-400 hover:text-blue-300 bg-blue-500/10 rounded-xl transition-colors border border-blue-500/20 cursor-pointer"
              >
                Launch Pattern Engine →
              </button>
            </div>
          )}
        </div>

        {/* User Profile Avatar & Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 bg-[#111827] border border-[#1E293B] hover:border-slate-700 rounded-xl transition-all duration-200 shadow-sm cursor-pointer"
          >
            <div className="relative shrink-0">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover border border-[#1E293B]"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-[#111827]" />
            </div>

            <div className="text-left hidden sm:block">
              <div className="text-xs font-bold text-white truncate max-w-[110px]">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {currentRoleBadge.badge}
              </div>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* Role & Profile Dropdown Menu */}
          {isRoleDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-[#111827] border border-[#1E293B] rounded-2xl shadow-2xl z-50 p-3 space-y-2">
              <div className="px-2 pb-2 border-b border-[#1E293B]">
                <div className="text-xs font-bold text-white">{currentUser.name}</div>
                <div className="text-[10px] font-mono text-slate-400">Badge: {currentUser.badgeNumber}</div>
              </div>

              <div className="text-[10px] uppercase font-mono text-slate-400 font-semibold tracking-wider px-2 pt-1">
                Switch Security Role
              </div>

              <div className="space-y-1">
                {(['ADMIN', 'INVESTIGATOR', 'POLICE', 'FORENSICS', 'ANALYST'] as UserRole[]).map(
                  (role) => {
                    const badgeInfo = getRoleBadge(role);
                    const isCurrent = getRoleBadge(currentUser.role).badge === badgeInfo.badge;

                    return (
                      <button
                        key={role}
                        onClick={() => {
                          onRoleSwitch(role);
                          setIsRoleDropdownOpen(false);
                        }}
                        className={`w-full p-2 rounded-xl text-left flex items-center justify-between text-xs transition-colors duration-200 cursor-pointer ${
                          isCurrent
                            ? 'bg-blue-600/10 text-blue-400 font-semibold border border-blue-500/20'
                            : 'text-slate-300 hover:bg-[#0F172A]'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{badgeInfo.title}</div>
                          <div className="text-[10px] font-mono text-slate-400">{badgeInfo.badge}</div>
                        </div>
                        {isCurrent && (
                          <Check className="w-4 h-4 text-blue-400" />
                        )}
                      </button>
                    );
                  }
                )}
              </div>

              <div className="pt-2 border-t border-[#1E293B]">
                <button
                  onClick={() => {
                    setIsRoleDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full p-2 text-slate-400 hover:text-white hover:bg-[#0F172A] rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors duration-200 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-slate-400" />
                  Logout Session
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay Bar */}
      {isMobileSearchOpen && (
        <div className="absolute top-16 left-0 right-0 p-3 bg-[#0F172A] border-b border-[#1E293B] md:hidden shadow-lg z-50">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cases, FIRs, suspects..."
              className="w-full bg-[#111827] border border-[#1E293B] rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none"
            />
          </form>
        </div>
      )}
    </header>
  );
};


