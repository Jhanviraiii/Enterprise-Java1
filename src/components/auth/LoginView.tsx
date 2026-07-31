import React, { useState } from 'react';
import { User, UserRole } from '../../types';
import { INITIAL_USERS } from '../../data/seedData';
import { Shield, Lock, UserCheck, ArrowRight, Eye, EyeOff, KeyRound, Sparkles, Terminal } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin.vance@scap.gov');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [showTokenDrawer, setShowTokenDrawer] = useState(false);
  const [simulatedToken, setSimulatedToken] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedUser = INITIAL_USERS.find((u) => u.role === selectedRole) || INITIAL_USERS[0];
    
    // Simulate JWT token generation
    const mockJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI${matchedUser.badgeNumber}Iiwicm9sZSI6I${matchedUser.role}IiwiaWF0IjoxNzI4ODk5OTk5fQ.signature_scap_secure_token`;
    setSimulatedToken(mockJwt);

    onLoginSuccess(matchedUser);
  };

  const handleQuickLogin = (role: UserRole) => {
    const matchedUser = INITIAL_USERS.find((u) => u.role === role) || INITIAL_USERS[0];
    onLoginSuccess(matchedUser);
  };

  const roleInfo = [
    {
      role: 'ADMIN' as UserRole,
      title: 'Administrator',
      name: 'Director Marcus Vance',
      badge: 'BADGE-1001',
      desc: 'Full system management, user CRUD, audit log access.',
      color: 'hover:border-rose-500/50 hover:bg-rose-500/5',
      badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    },
    {
      role: 'POLICE_OFFICER' as UserRole,
      title: 'Police Patrol Officer',
      name: 'Officer Sarah Jenkins',
      badge: 'BADGE-4420',
      desc: 'Registers FIRs, logs crime scenes, victim details.',
      color: 'hover:border-emerald-500/50 hover:bg-emerald-500/5',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      role: 'INVESTIGATOR' as UserRole,
      title: 'Lead Detective',
      name: 'Det. Raymond Cooper',
      badge: 'BADGE-7809',
      desc: 'Manages pattern alerts, case status, suspect dossiers.',
      color: 'hover:border-amber-500/50 hover:bg-amber-500/5',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    {
      role: 'FORENSIC_OFFICER' as UserRole,
      title: 'Forensic Officer',
      name: 'Dr. Aris Thorne',
      badge: 'BADGE-9912',
      desc: 'Uploads evidence, verifies SHA-256 hashes, chain of custody.',
      color: 'hover:border-purple-500/50 hover:bg-purple-500/5',
      badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="p-6 flex items-center justify-between border-b border-slate-800/60 relative z-10 bg-slate-950/40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 tracking-wider font-mono">
              SCAP <span className="text-amber-400 font-sans">POLICE PORTAL</span>
            </h1>
            <p className="text-xs text-slate-400">Smart Crime Analytics & Record Management System</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            ● SYSTEM SECURE • JWT AUTH ACTIVE
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl w-full mx-auto px-4 py-8 relative z-10 my-auto">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Intro Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-xs font-mono text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLLEGE ENTERPRISE DEMO EDITION</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 leading-tight">
              Law Enforcement <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">Intelligence & Crime Analytics</span>
            </h2>

            <p className="text-sm text-slate-400 leading-relaxed">
              Centralized record management, cross-case pattern detection engine, SHA-256 evidence integrity verification, and real-time interactive crime analytics.
            </p>

            {/* Quick Demo Login Cards */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>1-Click Evaluator Role Logins:</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {roleInfo.map((item) => (
                  <button
                    key={item.role}
                    onClick={() => handleQuickLogin(item.role)}
                    className={`p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-left transition-all group ${item.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300">
                        {item.title}
                      </span>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${item.badgeBg}`}>
                        {item.role}
                      </span>
                    </div>
                    <div className="text-[11px] font-medium text-slate-300 mt-1">{item.name}</div>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-amber-400" />
                    Terminal Officer Authentication
                  </h3>
                  <span className="text-xs font-mono text-cyan-400">BCrypt / JWT</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Select your assigned badge role to authenticate session
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Role Radio Pills */}
                <div>
                  <label className="text-xs font-mono text-slate-400 mb-2 block">SELECT AUTHORIZED ROLE:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['ADMIN', 'POLICE_OFFICER', 'INVESTIGATOR', 'FORENSIC_OFFICER'] as UserRole[]).map((r) => (
                      <button
                        type="button"
                        key={r}
                        onClick={() => {
                          setSelectedRole(r);
                          const matched = INITIAL_USERS.find((u) => u.role === r);
                          if (matched) setEmail(matched.email);
                        }}
                        className={`p-2 rounded-lg text-xs font-mono font-semibold text-center border transition-all ${
                          selectedRole === r
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md'
                            : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {r.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="text-xs font-mono text-slate-400 mb-1 block">OFFICER EMAIL / BADGE ID</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-slate-200 outline-none transition-colors"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="text-xs font-mono text-slate-400 mb-1 block">PASSCODE (ENCRYPTED BCRYPT)</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-slate-200 outline-none transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Authenticate & Launch Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* JWT Info Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  Spring Security Simulation Active
                </span>
                <button
                  type="button"
                  onClick={() => setShowTokenDrawer(!showTokenDrawer)}
                  className="text-amber-400 hover:underline text-[11px] font-mono"
                >
                  [Inspect JWT Session]
                </button>
              </div>

              {/* JWT Token Drawer */}
              {showTokenDrawer && (
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1 text-left font-mono">
                  <div className="text-[10px] font-bold text-amber-400 flex items-center gap-1">
                    <Terminal className="w-3 h-3" />
                    SIMULATED JWT BEARER TOKEN:
                  </div>
                  <p className="text-[10px] text-slate-400 break-all leading-tight">
                    {simulatedToken || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCQURHRS0xMDAxIiwicm9sZSI6IkFETUlOIiwiYXR0Ijp0cnVlfQ.sample_jwt'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-slate-800/60 text-center text-xs text-slate-500 relative z-10 bg-slate-950/40">
        Smart Crime Analytics Portal (SCAP) • Enterprise Police Mini-Project • Metropolitan Law Enforcement Division
      </footer>
    </div>
  );
};
