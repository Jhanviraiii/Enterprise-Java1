import React from 'react';
import { UserRole } from '../types';
import {
  BarChart3,
  Cpu,
  FileText,
  Shield,
  FolderOpen,
  UserCheck,
  Lock,
  Kanban,
  Users,
  Printer,
  UserCog,
  Sparkles,
  ChevronRight,
  Globe,
  Terminal,
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onSelectModule: (module: string) => void;
  userRole: UserRole;
  unreviewedAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  userRole,
  unreviewedAlertsCount,
}) => {
  const menuItems = [
    {
      id: 'analytics',
      label: 'Analytics & Hotspots',
      icon: <BarChart3 className="w-4 h-4" />,
      roles: ['ADMIN', 'POLICE_OFFICER', 'INVESTIGATOR', 'FORENSIC_OFFICER'],
      highlight: false,
    },
    {
      id: 'pattern',
      label: 'Pattern Detection Engine',
      icon: <Cpu className="w-4 h-4" />,
      roles: ['ADMIN', 'POLICE_OFFICER', 'INVESTIGATOR', 'FORENSIC_OFFICER'],
      badge: unreviewedAlertsCount > 0 ? `${unreviewedAlertsCount} MATCH` : 'AI',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      highlight: true,
    },
    {
      id: 'iptracing',
      label: 'Location IP Tracing',
      icon: <Globe className="w-4 h-4" />,
      roles: ['ADMIN', 'POLICE_OFFICER', 'INVESTIGATOR', 'FORENSIC_OFFICER'],
      badge: 'GPS',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40',
    },
    {
      id: 'loganalysis',
      label: 'Fast Log Analysis',
      icon: <Terminal className="w-4 h-4" />,
      roles: ['ADMIN', 'POLICE_OFFICER', 'INVESTIGATOR', 'FORENSIC_OFFICER'],
      badge: 'PARSER',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    },
    {
      id: 'firs',
      label: 'FIR Management',
      icon: <FileText className="w-4 h-4" />,
      roles: ['ADMIN', 'POLICE_OFFICER', 'INVESTIGATOR'],
    },
    {
      id: 'crimes',
      label: 'Crime Records',
      icon: <FolderOpen className="w-4 h-4" />,
      roles: ['ADMIN', 'POLICE_OFFICER', 'INVESTIGATOR', 'FORENSIC_OFFICER'],
    },
    {
      id: 'criminals',
      label: 'Criminal Profiles',
      icon: <UserCheck className="w-4 h-4" />,
      roles: ['ADMIN', 'POLICE_OFFICER', 'INVESTIGATOR'],
    },
    {
      id: 'evidence',
      label: 'Forensic Evidence Lab',
      icon: <Lock className="w-4 h-4" />,
      roles: ['ADMIN', 'FORENSIC_OFFICER', 'INVESTIGATOR'],
      badge: 'SHA-256',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
    },
    {
      id: 'investigation',
      label: 'Case & Investigation Board',
      icon: <Kanban className="w-4 h-4" />,
      roles: ['ADMIN', 'INVESTIGATOR', 'POLICE_OFFICER'],
    },
    {
      id: 'people',
      label: 'Victims & Witnesses',
      icon: <Users className="w-4 h-4" />,
      roles: ['ADMIN', 'POLICE_OFFICER', 'INVESTIGATOR'],
    },
    {
      id: 'reports',
      label: 'Report Generator & PDF',
      icon: <Printer className="w-4 h-4" />,
      roles: ['ADMIN', 'POLICE_OFFICER', 'INVESTIGATOR', 'FORENSIC_OFFICER'],
    },
    {
      id: 'users',
      label: 'User Mgmt & Audit Logs',
      icon: <UserCog className="w-4 h-4" />,
      roles: ['ADMIN'],
    },
  ];

  const filteredItems = menuItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-[#080c14] border-r border-slate-800/80 flex flex-col justify-between shrink-0 select-none hidden md:flex">
      <div className="p-3 space-y-4">
        {/* Navigation Category Label */}
        <div className="px-3 pt-2 flex items-center justify-between text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500">
          <span>Command Modules</span>
          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
            {userRole}
          </span>
        </div>

        {/* Menu Links */}
        <nav className="space-y-1">
          {filteredItems.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                className={`w-full px-3 py-2.5 rounded-xl font-medium text-xs flex items-center justify-between transition-all group ${
                  isActive
                    ? item.highlight
                      ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 text-amber-300 font-bold border border-amber-500/40 shadow-lg shadow-amber-500/5'
                      : 'bg-slate-800/90 text-slate-100 font-semibold border border-slate-700 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`transition-colors ${
                      isActive ? (item.highlight ? 'text-amber-400' : 'text-cyan-400') : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                        item.badgeColor || 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Box */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Pattern Sentinel</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-normal">
            Automated cross-case correlation engine running background analysis.
          </p>
        </div>
      </div>
    </aside>
  );
};
