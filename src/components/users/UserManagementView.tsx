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
  const [avatarUrl, setAvatarUrl] = useState('');

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
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      status: 'ACTIVE',
      lastLogin: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    onAddUser(newUser);
    setIsAddUserModalOpen(false);
    setName('');
    setEmail('');
    setAvatarUrl('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div>
          <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
            <UserCog className="w-6 h-6 text-rose-400" />
            Administrator Control & System Audit Center
          </h2>
          <p className="text-xs text-slate-400">
            Role-Based Access Control (RBAC), officer account provisioning, and system audit logs
          </p>
        </div>

        {activeTab === 'USERS' && (
          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Provision Officer Account</span>
          </button>
        )}
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('USERS')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'USERS'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Personnel User Roster ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('AUDIT_LOGS')}
            className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'AUDIT_LOGS'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            System Audit Logs ({auditLogs.length})
          </button>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl text-xs text-slate-200 outline-none"
          />
        </div>
      </div>

      {/* Main Table Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {activeTab === 'USERS' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                  <th className="p-4">Badge ID</th>
                  <th className="p-4">Officer Name</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-400">{u.badgeNumber}</td>
                    <td className="p-4 font-semibold text-slate-100 flex items-center gap-3">
                      <img
                        src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                        alt={u.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                        }}
                        className="w-9 h-9 rounded-xl object-cover border-2 border-slate-700 shadow-md shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-100">{u.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{u.email}</div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-slate-300">{u.role}</td>
                    <td className="p-4 text-slate-400">{u.department}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => onToggleUserStatus(u.id)}
                        className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-lg transition-colors"
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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">User & Badge</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Module</th>
                  <th className="p-4">Audit Details</th>
                  <th className="p-4 font-mono">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-xs">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-4 font-mono text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="p-4 font-semibold text-slate-200">
                      <div>{log.userName}</div>
                      <div className="text-[10px] font-mono text-slate-500">{log.badgeNumber}</div>
                    </td>
                    <td className="p-4 font-mono font-bold text-amber-400">{log.action}</td>
                    <td className="p-4 font-mono text-slate-300">{log.module}</td>
                    <td className="p-4 text-slate-300 max-w-sm">{log.details}</td>
                    <td className="p-4 font-mono text-slate-500">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Provision User Modal */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-100">Provision New Officer Account</h3>
            <form onSubmit={handleAddUserSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-mono mb-1 block">OFFICER FULL NAME</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Officer James Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-mono mb-1 block">DEPARTMENT EMAIL</label>
                <input
                  type="email"
                  required
                  placeholder="j.miller@metropolice.gov"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-mono mb-1 block">SYSTEM ROLE</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none cursor-pointer"
                >
                  <option value="ADMIN">Administrator</option>
                  <option value="POLICE_OFFICER">Police Officer</option>
                  <option value="INVESTIGATOR">Investigator</option>
                  <option value="FORENSIC_OFFICER">Forensic Officer</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 font-mono mb-1 block">ASSIGNED DIVISION</label>
                <input
                  type="text"
                  required
                  placeholder="Central Patrol Division"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 font-mono mb-1 block">OFFICER PROFILE PHOTO URL</label>
                <div className="flex items-center gap-3">
                  <img
                    src={avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/officer/150/150';
                    }}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-amber-500/60 shrink-0 shadow"
                  />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... or leave empty for auto photo"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-800 text-slate-300 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-lg"
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
