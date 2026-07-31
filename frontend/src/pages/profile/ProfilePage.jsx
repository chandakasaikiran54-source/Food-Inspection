/**
 * src/pages/profile/ProfilePage.jsx
 * User profile management card with security preferences.
 */

import { useAuth } from '../../context/AuthContext.jsx';
import { Link } from 'react-router-dom';
import { User, ShieldCheck, Mail, Key, Calendar, Award } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-600" /> Account Profile
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Personal credentials, security role level, and authentication details.
        </p>
      </div>

      <div className="card-modern space-y-6">
        {/* Profile Card Header */}
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-2xl shadow-lg ring-4 ring-indigo-50">
            {user?.fullName?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">{user?.fullName ?? 'Government Officer'}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="badge badge-purple flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-indigo-600" /> {user?.role ?? 'OFFICER'}
              </span>
              <span className="badge badge-success">ACCOUNT ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Info Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Official Email</p>
            <p className="font-bold text-slate-800 text-sm">{user?.email || 'officer@health.gov'}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Security Clearance Level</p>
            <p className="font-bold text-indigo-600 text-sm">Level 4 — Tier 1 Auditor</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
            <p className="text-slate-400 font-semibold uppercase text-[10px]">Last Portal Login</p>
            <p className="font-bold text-slate-800 text-sm">
              {user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : '2026-07-31 10:15'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
            <p className="text-slate-400 font-semibold uppercase text-[10px]">District Jurisdiction</p>
            <p className="font-bold text-slate-800 text-sm">All Municipal Districts</p>
          </div>
        </div>

        {/* Security Action Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">Password modified 14 days ago</span>
          <Link to="/profile/password" className="btn-secondary text-xs">
            <Key className="w-4 h-4 text-indigo-600" /> Update Password
          </Link>
        </div>
      </div>
    </div>
  );
}
