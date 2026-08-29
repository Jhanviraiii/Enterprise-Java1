import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { canAccessModule, getRoleBadge } from '../utils/rbac';
import {
  BarChart3,
  Cpu,
  FileText,
  FolderOpen,
  UserCheck,
  Lock,
  Kanban,
  Users,
  Printer,
  UserCog,
  Globe,
  Terminal,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  Shield,
  Zap,
  X,
} from 'lucide-react';

interface SidebarProps {
  activeModule: string;
  onSelectModule: (module: string) => void;
  userRole: UserRole;
  unreviewedAlertsCount: number;
  currentUser?: User;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  userRole,
  unreviewedAlertsCount,
  currentUser,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const roleBadge = getRoleBadge(currentUser?.role || userRole);

  const menuSections = [
    {
      title: 'ANALYTICS & INTEL',
      items: [
        {
          id: 'analytics',
          label: 'Analytics & Hotspots',
          icon: <BarChart3 className="w-4 h-4" />,
        },
        {
          id: 'pattern',
          label: 'Pattern Detection Engine',
          icon: <Cpu className="w-4 h-4" />,
          badge: unreviewedAlertsCount > 0 ? `${unreviewedAlertsCount} ALERT` : 'AI',
        },
        {
          id: 'iptracing',
          label: 'Location IP Tracing',
          icon: <Globe className="w-4 h-4" />,
        },
        {
          id: 'loganalysis',
          label: 'Fast Log Analysis',
          icon: <Terminal className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'CASES & DOSSIERS',
      items: [
        {
          id: 'firs',
          label: 'FIR Management',
          icon: <FileText className="w-4 h-4" />,
        },
        {
          id: 'crimes',
          label: 'Crime Records',
          icon: <FolderOpen className="w-4 h-4" />,
        },
        {
          id: 'criminals',
          label: 'Criminal Profiles',
          icon: <UserCheck className="w-4 h-4" />,
        },
        {
          id: 'evidence',
          label: 'Forensic Evidence Lab',
          icon: <Lock className="w-4 h-4" />,
        },
        {
          id: 'investigation',
          label: 'Case & Investigation Board',
          icon: <Kanban className="w-4 h-4" />,
        },
        {
          id: 'people',
          label: 'Victims & Witnesses',
          icon: <Users className="w-4 h-4" />,
        },
      ],
    },
    {
      title: 'SYSTEM & REPORTS',
      items: [
        {
          id: 'reports',
          label: 'Report Generator',
          icon: <Printer className="w-4 h-4" />,
        },
        {
          id: 'users',
          label: 'User Roster & Audit',
          icon: <UserCog className="w-4 h-4" />,
        },
      ],
    },
  ];

  const handleModuleClick = (modId: string) => {
    onSelectModule(modId);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  const renderContent = () => (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#1E293B] shrink-0">
        {!isCollapsed ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white tracking-wide block">NAVIGATION</span>
              <span className="text-[10px] font-mono text-slate-400 block">COMMAND SYSTEM</span>
            </div>
          </div>
        ) : (
          <div className="mx-auto">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Shield className="w-4 h-4" />
            </div>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 text-slate-400 hover:text-white hover:bg-[#0F172A] rounded-lg transition-colors duration-200 cursor-pointer ${
            isCollapsed ? 'mx-auto mt-1' : ''
          }`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {menuSections.map((section, sectionIdx) => {
          const allowedItems = section.items.filter((item) => canAccessModule(userRole, item.id));
          if (allowedItems.length === 0) return null;

          return (
            <div key={sectionIdx} className="space-y-2">
              {!isCollapsed ? (
                <div className="px-3 text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                  {section.title}
                </div>
              ) : (
                <div className="my-2 border-t border-[#1E293B]" />
              )}

              <nav className="space-y-1">
                {allowedItems.map((item) => {
                  const isActive = activeModule === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleModuleClick(item.id)}
                      title={isCollapsed ? item.label : undefined}
                      className={`relative w-full py-2.5 px-3 rounded-xl font-medium text-xs flex items-center justify-between transition-all duration-200 group cursor-pointer ${
                        isActive
                          ? 'bg-blue-600/10 text-blue-400 font-semibold border border-blue-500/20 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-[#0F172A] border border-transparent'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-md shadow-sm shadow-blue-500/50" />
                      )}

                      <div className={`flex items-center gap-3 min-w-0 ${isCollapsed ? 'mx-auto' : ''}`}>
                        <span
                          className={`transition-colors shrink-0 ${
                            isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'
                          }`}
                        >
                          {item.icon}
                        </span>

                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!isCollapsed && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.badge && (
                            <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {item.badge}
                            </span>
                          )}
                          {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
                        </div>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Collapsible Sidebar (Preserved) */}
      <aside
        className={`${
          isCollapsed ? 'w-20' : 'w-64'
        } bg-[#111827] border-r border-[#1E293B] flex-col justify-between shrink-0 select-none hidden lg:flex transition-all duration-300 ease-in-out shadow-sm z-30`}
      >
        {/* Top Header & Navigation Links Container */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Sidebar Header with Toggle */}
          <div className="h-16 px-4 flex items-center justify-between border-b border-[#1E293B] shrink-0">
            {!isCollapsed ? (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white tracking-wide block">NAVIGATION</span>
                  <span className="text-[10px] font-mono text-slate-400 block">COMMAND SYSTEM</span>
                </div>
              </div>
            ) : (
              <div className="mx-auto">
                <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <Shield className="w-4 h-4" />
                </div>
              </div>
            )}

            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`p-1.5 text-slate-400 hover:text-white hover:bg-[#0F172A] rounded-lg transition-colors duration-200 cursor-pointer ${
                isCollapsed ? 'mx-auto mt-1' : ''
              }`}
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>

          {/* Scrollable Navigation Items */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
            {menuSections.map((section, sectionIdx) => {
              const allowedItems = section.items.filter((item) => canAccessModule(userRole, item.id));
              if (allowedItems.length === 0) return null;

              return (
                <div key={sectionIdx} className="space-y-2">
                  {!isCollapsed ? (
                    <div className="px-3 text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                      {section.title}
                    </div>
                  ) : (
                    <div className="my-2 border-t border-[#1E293B]" />
                  )}

                  <nav className="space-y-1">
                    {allowedItems.map((item) => {
                      const isActive = activeModule === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleModuleClick(item.id)}
                          title={isCollapsed ? item.label : undefined}
                          className={`relative w-full py-2.5 px-3 rounded-xl font-medium text-xs flex items-center justify-between transition-all duration-200 group cursor-pointer ${
                            isActive
                              ? 'bg-blue-600/10 text-blue-400 font-semibold border border-blue-500/20 shadow-sm'
                              : 'text-slate-400 hover:text-white hover:bg-[#0F172A] border border-transparent'
                          }`}
                        >
                          {isActive && (
                            <span className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-md shadow-sm shadow-blue-500/50" />
                          )}

                          <div className={`flex items-center gap-3 min-w-0 ${isCollapsed ? 'mx-auto' : ''}`}>
                            <span
                              className={`transition-colors shrink-0 ${
                                isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'
                              }`}
                            >
                              {item.icon}
                            </span>

                            {!isCollapsed && <span className="truncate">{item.label}</span>}
                          </div>

                          {!isCollapsed && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              {item.badge && (
                                <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                  {item.badge}
                                </span>
                              )}
                              {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              );
            })}
          </div>
        </div>

        {/* User Profile Card at Bottom */}
        <div className="p-3 border-t border-[#1E293B] bg-[#0F172A] shrink-0">
          {!isCollapsed ? (
            <div className="p-2.5 bg-[#111827] border border-[#1E293B] rounded-xl flex items-center justify-between gap-3 group hover:border-slate-700 transition-colors duration-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative shrink-0">
                  <img
                    src={
                      currentUser?.avatarUrl ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                    }
                    alt={currentUser?.name || 'User Profile'}
                    className="w-8 h-8 rounded-lg object-cover border border-[#1E293B]"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#111827] rounded-full" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">
                    {currentUser?.name || 'Chief Commander'}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate">
                    {currentUser?.badgeNumber || 'BADGE #1001'}
                  </div>
                </div>
              </div>

              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border ${roleBadge.bg} ${roleBadge.color} shrink-0`}>
                {roleBadge.badge}
              </span>
            </div>
          ) : (
            <div className="flex justify-center p-1">
              <div className="relative shrink-0" title={`${currentUser?.name || 'Officer'} (${roleBadge.badge})`}>
                <img
                  src={
                    currentUser?.avatarUrl ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                  }
                  alt="User"
                  className="w-8 h-8 rounded-lg object-cover border border-[#1E293B]"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#111827] rounded-full" />
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Navigation Overlay (< lg) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm lg:hidden flex">
          <div className="w-72 max-w-[85vw] bg-[#111827] border-r border-[#1E293B] flex flex-col justify-between h-full shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Top Header with Close Button */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-[#1E293B] shrink-0 bg-[#0F172A]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600/15 border border-blue-500/30 text-blue-400 flex items-center justify-center">
                  <Shield className="w-4.5 h-4.5 text-blue-400" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white tracking-wide block">NAVIGATION</span>
                  <span className="text-[10px] font-mono text-slate-400 block">COMMAND SYSTEM</span>
                </div>
              </div>

              <button
                onClick={onCloseMobile}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="Close Navigation Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Navigation Links */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 custom-scrollbar">
              {menuSections.map((section, sectionIdx) => {
                const allowedItems = section.items.filter((item) => canAccessModule(userRole, item.id));
                if (allowedItems.length === 0) return null;

                return (
                  <div key={sectionIdx} className="space-y-2">
                    <div className="px-3 text-[10px] font-mono font-semibold tracking-wider text-slate-400 uppercase">
                      {section.title}
                    </div>

                    <nav className="space-y-1">
                      {allowedItems.map((item) => {
                        const isActive = activeModule === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleModuleClick(item.id)}
                            className={`relative w-full py-2.5 px-3.5 rounded-xl font-medium text-xs flex items-center justify-between transition-all duration-200 group cursor-pointer ${
                              isActive
                                ? 'bg-blue-600/10 text-blue-400 font-semibold border border-blue-500/20 shadow-sm'
                                : 'text-slate-400 hover:text-white hover:bg-[#0F172A] border border-transparent'
                            }`}
                          >
                            {isActive && (
                              <span className="absolute left-0 top-2 bottom-2 w-1 bg-blue-600 rounded-r-md shadow-sm shadow-blue-500/50" />
                            )}

                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className={`transition-colors shrink-0 ${
                                  isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-white'
                                }`}
                              >
                                {item.icon}
                              </span>

                              <span className="truncate">{item.label}</span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {item.badge && (
                                <span className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                  {item.badge}
                                </span>
                              )}
                              {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-400" />}
                            </div>
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                );
              })}
            </div>

            {/* Mobile User Profile Footer */}
            <div className="p-4 border-t border-[#1E293B] bg-[#0F172A] shrink-0">
              <div className="p-3 bg-[#111827] border border-[#1E293B] rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={
                        currentUser?.avatarUrl ||
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
                      }
                      alt={currentUser?.name || 'User Profile'}
                      className="w-9 h-9 rounded-lg object-cover border border-[#1E293B]"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#111827] rounded-full" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-white truncate">
                      {currentUser?.name || 'Chief Commander'}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400 truncate">
                      {currentUser?.badgeNumber || 'BADGE #1001'}
                    </div>
                  </div>
                </div>

                <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-md border ${roleBadge.bg} ${roleBadge.color} shrink-0`}>
                  {roleBadge.badge}
                </span>
              </div>
            </div>
          </div>

          {/* Overlay Click-to-Dismiss Area */}
          <div className="flex-1" onClick={onCloseMobile} />
        </div>
      )}
    </>
  );
};


