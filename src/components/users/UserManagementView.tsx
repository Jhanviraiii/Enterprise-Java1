import React, { useState } from 'react';
import { User, UserRole, AuditLog } from '../../types';
import { generateUUID } from '../../utils/crypto';
import {
  UserCog,
  Shield,
  Search,
  Plus,
  Lock,
  Terminal,
  Clock,
  CheckCircle,
  X,
} from 'lucide-react';

interface UserManagementViewProps {
  users: User[];
  auditLogs: AuditLog[];
  currentUser: User;
  onAddUser: (user: User) => void;
  onToggleUserStatus: (userId: string) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  auditLogs,
  currentUser,
  onAddUser,
  onToggleUserStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'USERS' | 'AUDIT_LOGS'>('USERS');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // New User Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('POLICE_OFFICER');
  const [department, setDepartment] = useState('Central Patrol Unit');

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.badgeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLogs = auditLogs.filter((l) =>
    l.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: User = {
      id: generateUUID(),
      badgeNumber: `BADGE-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      role,
      department,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    onAddUser(newUser);
    setIsAddUserModalOpen(false);
    setName('');
    setEmail('');
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-[#111827] border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[10px] font-bold tracking-wider uppercase">
            <UserCog className="w-3.5 h-3.5" />
            <span>RBAC SYSTEM ADMINISTRATION</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            Administrator Control & System Audit Center
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Role-Based Access Control (RBAC), officer account provisioning, and system audit logs.
          </p>
        </div>

        {activeTab === 'USERS' && (
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="h-11 px-5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all duration-200 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Provision Officer Account</span>
          </button>
        )}
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#111827] border border-[#1E293B] rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('USERS')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 ${
              activeTab === 'USERS'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Personnel User Roster ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('AUDIT_LOGS')}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all duration-200 ${
              activeTab === 'AUDIT_LOGS'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            System Audit Logs ({auditLogs.length})
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0F172A] border border-[#1E293B] focus:border-blue-500/60 rounded-xl text-xs text-white outline-none transition-colors"
          />
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-[#111827] border border-[#1E293B] rounded-[14px] overflow-hidden shadow-sm">
        {activeTab === 'USERS' ? (
          <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-[#0F172A] border-b border-[#1E293B] shadow-sm">
                <tr className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Badge ID</th>
                  <th className="px-5 py-3.5">Officer Name</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Department</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B] text-xs">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#0F172A]/80 transition-colors duration-150 group">
                    <td className="px-5 py-4 font-mono font-bold text-blue-400 whitespace-nowrap tracking-wide">{u.badgeNumber}</td>
                    <td className="px-5 py-4 font-semibold text-white flex items-center gap-2.5">
                      <img src={u.avatarUrl} alt={u.name} className="w-7 h-7 rounded-full object-cover border border-[#1E293B]" />
                      <span className="group-hover:text-blue-400 transition-colors duration-150">{u.name}</span>
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-300">{u.role}</td>
                    <td className="px-5 py-4 text-slate-400">{u.department}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border ${
                          u.status === 'ACTIVE'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onToggleUserStatus(u.id)}
                        className="px-3.5 py-1.5 bg-[#0F172A] hover:bg-slate-800 border border-[#1E293B] text-slate-300 font-semibold text-xs rounded-xl transition-colors duration-150 cursor-pointer"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10 bg-[#0F172A] border-b border-[#1E293B] shadow-sm">
                <tr className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Timestamp</th>
                  <th className="px-5 py-3.5">User & Badge</th>
                  <th className="px-5 py-3.5">Action</th>
                  <th className="px-5 py-3.5">Module</th>
                  <th className="px-5 py-3.5">Audit Details</th>
                  <th className="px-5 py-3.5 font-mono">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B] text-xs">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#0F172A]/80 transition-colors duration-150">
                    <td className="px-5 py-4 font-mono text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-5 py-4 font-semibold text-white">
                      <div className="font-medium text-white">{log.userName}</div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{log.badgeNumber}</div>
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-blue-400">{log.action}</td>
                    <td className="px-5 py-4 font-mono text-slate-300">{log.module}</td>
                    <td className="px-5 py-4 text-slate-300 max-w-sm leading-relaxed">{log.details}</td>
                    <td className="px-5 py-4 font-mono text-slate-400">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Provision User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#111827] border border-[#1E293B] rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-5">
            <h3 className="text-base font-bold text-white tracking-tight">Provision New Officer Account</h3>
            <form onSubmit={handleAddUserSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">OFFICER FULL NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Officer James Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#0F172A] border border-[#1E293B] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white outline-none transition-all duration-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">DEPARTMENT EMAIL *</label>
                <input
                  type="email"
                  required
                  placeholder="j.miller@metropolice.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#0F172A] border border-[#1E293B] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white outline-none transition-all duration-200 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">SYSTEM ROLE *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full h-11 px-3.5 bg-[#0F172A] border border-[#1E293B] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white outline-none cursor-pointer transition-all duration-200"
                >
                  <option value="ADMIN">Administrator</option>
                  <option value="POLICE_OFFICER">Police Officer</option>
                  <option value="INVESTIGATOR">Investigator</option>
                  <option value="FORENSIC_OFFICER">Forensic Officer</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">ASSIGNED DIVISION *</label>
                <input
                  type="text"
                  required
                  placeholder="Central Patrol Division"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full h-11 px-3.5 bg-[#0F172A] border border-[#1E293B] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-xl text-white outline-none transition-all duration-200"
                />
              </div>

              <div className="pt-3 border-t border-[#1E293B] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="h-11 px-5 bg-[#0F172A] hover:bg-slate-800 border border-[#1E293B] text-slate-300 font-semibold rounded-xl transition-all duration-200 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 px-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-sm transition-all duration-200 cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

