/**
 * src/pages/users/UserManagementPage.jsx
 * User & Role Administration module (ADMIN Restricted).
 */

import { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  ShieldCheck,
  Mail,
  UserCheck,
  UserX,
  X,
  Lock,
} from 'lucide-react';
import toast from 'react-hot-toast';

const INITIAL_USERS = [
  { id: 'USR-001', name: 'Dr. Arthur Pendelton', email: 'admin@health.gov', role: 'ADMIN', status: 'ACTIVE', lastLogin: '2026-07-31 10:15' },
  { id: 'USR-002', name: 'Commissioner Helena Vance', email: 'commissioner@health.gov', role: 'COMMISSIONER', status: 'ACTIVE', lastLogin: '2026-07-30 16:45' },
  { id: 'USR-003', name: 'Supervisor Mark Sterling', email: 'supervisor@health.gov', role: 'SUPERVISOR', status: 'ACTIVE', lastLogin: '2026-07-31 08:30' },
  { id: 'USR-004', name: 'Officer David Kim', email: 'david.kim@health.gov', role: 'INSPECTOR', status: 'ACTIVE', lastLogin: '2026-07-29 14:20' },
  { id: 'USR-005', name: 'Officer Sarah Connor', email: 'sarah.connor@health.gov', role: 'INSPECTOR', status: 'ACTIVE', lastLogin: '2026-07-28 11:00' },
];

export default function UserManagementPage() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'INSPECTOR',
  });

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleUserStatus = (id) => {
    setUsers(
      users.map((u) =>
        u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' } : u
      )
    );
    toast.success('Updated user account access status');
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      toast.error('Name and email are required');
      return;
    }

    const created = {
      id: `USR-00${users.length + 1}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'ACTIVE',
      lastLogin: 'Never',
    };

    setUsers([created, ...users]);
    setShowAddModal(false);
    toast.success(`Created new account for ${newUser.name}`);
    setNewUser({ name: '', email: '', role: 'INSPECTOR' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" /> User & Role Administration
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage system access accounts, assign role permissions, and audit user logins.
          </p>
        </div>

        <button onClick={() => setShowAddModal(true)} className="btn-primary shadow-indigo-600/30">
          <Plus className="w-4 h-4" /> Provision New User
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card-modern p-4 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search account name, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Role Tier:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="select-field text-xs py-1.5 w-40"
          >
            <option value="ALL">All Roles</option>
            <option value="ADMIN">ADMIN</option>
            <option value="COMMISSIONER">COMMISSIONER</option>
            <option value="SUPERVISOR">SUPERVISOR</option>
            <option value="INSPECTOR">INSPECTOR</option>
          </select>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="card-modern overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="table-modern">
            <thead>
              <tr>
                <th>User Account</th>
                <th>Role Rank</th>
                <th>Status</th>
                <th>Last Portal Access</th>
                <th className="text-right">Account Control</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                        {u.name[0]}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        u.role === 'ADMIN'
                          ? 'badge-purple'
                          : u.role === 'COMMISSIONER'
                          ? 'badge-info'
                          : u.role === 'SUPERVISOR'
                          ? 'badge-warning'
                          : 'badge-success'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${u.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="text-xs text-slate-600">{u.lastLogin}</td>
                  <td className="text-right">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`btn-ghost text-xs font-semibold ${
                        u.status === 'ACTIVE' ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'
                      }`}
                    >
                      {u.status === 'ACTIVE' ? 'Deactivate' : 'Reactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-900">Provision System Account</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Official Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="user@health.gov"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">RBAC Role Privilege Tier</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="select-field"
                >
                  <option value="INSPECTOR">INSPECTOR (Field Officer)</option>
                  <option value="SUPERVISOR">SUPERVISOR (District Lead)</option>
                  <option value="COMMISSIONER">COMMISSIONER (Executive Auditor)</option>
                  <option value="ADMIN">ADMIN (System Administrator)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
