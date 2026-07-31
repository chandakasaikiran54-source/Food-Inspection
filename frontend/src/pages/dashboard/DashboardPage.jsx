/**
 * src/pages/dashboard/DashboardPage.jsx
 * Role-Tailored Executive Dashboard.
 * Delivers unique KPIs, graphs, metrics, and workflows tailored for:
 * - ADMIN (System Command & Server Health)
 * - INSPECTOR (Field Dispatch & Daily Route)
 * - SUPERVISOR (District Oversight & Officer Workload)
 * - COMMISSIONER (Citywide Surveillance & Executive Reports)
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Building2,
  ClipboardCheck,
  ShieldAlert,
  UserCheck,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Server,
  Users,
  Award,
  Activity,
  MapPin,
  Clock,
  Navigation,
  CheckSquare,
  BarChart2,
  Sliders,
  Download,
  Shield,
  Zap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  INITIAL_BUSINESSES,
  INITIAL_INSPECTIONS,
  INITIAL_ALERTS,
  INITIAL_INSPECTORS,
  MONTHLY_TREND_DATA,
  COMPLIANCE_DISTRIBUTION,
  VIOLATION_CATEGORIES,
} from '../../services/mockData.js';

// Admin System Usage Data
const SYSTEM_TRAFFIC_DATA = [
  { time: '08:00', requests: 1200, dbQueries: 3400, activeSessions: 42 },
  { time: '10:00', requests: 3800, dbQueries: 9100, activeSessions: 118 },
  { time: '12:00', requests: 4500, dbQueries: 11200, activeSessions: 145 },
  { time: '14:00', requests: 3200, dbQueries: 8400, activeSessions: 98 },
  { time: '16:00', requests: 2900, dbQueries: 7200, activeSessions: 84 },
  { time: '18:00', requests: 1500, dbQueries: 4100, activeSessions: 52 },
];

const USER_ROLE_DISTRIBUTION = [
  { name: 'Field Officers', value: 18, color: '#3b82f6' },
  { name: 'District Supervisors', value: 6, color: '#f59e0b' },
  { name: 'Commissioners', value: 3, color: '#6366f1' },
  { name: 'System Administrators', value: 2, color: '#a855f7' },
];

// Inspector Personal Route & Performance Data
const INSPECTOR_ROUTE_DATA = [
  { day: 'Mon', completed: 4, passed: 4, failed: 0 },
  { day: 'Tue', completed: 5, passed: 4, failed: 1 },
  { day: 'Wed', completed: 3, passed: 3, failed: 0 },
  { day: 'Thu', completed: 4, passed: 3, failed: 1 },
  { day: 'Fri', completed: 2, passed: 2, failed: 0 },
];

// Supervisor Officer Workload Comparison Data
const OFFICER_WORKLOAD_DATA = [
  { name: 'Officer D. Kim', active: 5, completed: 18, avgScore: 86.4 },
  { name: 'Officer S. Connor', active: 4, completed: 22, avgScore: 91.2 },
  { name: 'Officer R. Vance', active: 3, completed: 14, avgScore: 84.0 },
  { name: 'Officer E. Rostova', active: 2, completed: 16, avgScore: 89.5 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const role = user?.role || 'ADMIN';

  return (
    <div className="space-y-6">
      {/* Role Banner Badge */}
      <div className="flex items-center justify-between bg-slate-900 text-white px-4 py-2.5 rounded-2xl border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-indigo-400" />
          <span className="font-bold">Active Privilege View:</span>
          <span className="bg-indigo-500/20 text-indigo-300 font-extrabold px-2.5 py-0.5 rounded-md border border-indigo-500/30">
            {role} DASHBOARD
          </span>
        </div>
        <span className="text-slate-400 text-[11px]">
          Tailored analytics & controls for <strong className="text-slate-200">{user?.fullName || 'User'}</strong>
        </span>
      </div>

      {/* Render Role-Specific Views */}
      {role === 'ADMIN' && <AdminDashboard navigate={navigate} />}
      {role === 'INSPECTOR' && <InspectorDashboard navigate={navigate} user={user} />}
      {role === 'SUPERVISOR' && <SupervisorDashboard navigate={navigate} />}
      {role === 'COMMISSIONER' && <CommissionerDashboard navigate={navigate} />}
    </div>
  );
}

/* ==========================================================================
   1. ADMIN DASHBOARD (System Command & IT Infrastructure Focus)
   ========================================================================== */
function AdminDashboard({ navigate }) {
  const KPI_CARDS = [
    { label: 'Active System Users', value: '29 Users', trend: '100% Online', isPositive: true, icon: Users, color: 'bg-purple-50 text-purple-600 border-purple-200' },
    { label: 'Server System Health', value: '99.99%', trend: 'Operational', isPositive: true, icon: Server, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { label: 'Registered Venues', value: INITIAL_BUSINESSES.length, trend: '+8 New', isPositive: true, icon: Building2, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    { label: 'Daily API Request Load', value: '14.2k', trend: 'Normal Load', isPositive: true, icon: Activity, color: 'bg-sky-50 text-sky-600 border-sky-200' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="card-modern bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge badge-purple mb-2">SYSTEM ADMINISTRATOR COMMAND</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Technical Infrastructure & Security Center</h1>
            <p className="text-slate-300 text-sm mt-1">
              Surveillance API status: <span className="text-emerald-400 font-bold">Healthy (0 Latency Spikes)</span>. Database replication active across 3 nodes.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/users')} className="btn-primary">
              <Users className="w-4 h-4" /> Manage Users
            </button>
            <button onClick={() => navigate('/settings')} className="btn-secondary bg-white/10 text-white border-white/20">
              <Sliders className="w-4 h-4" /> System Settings
            </button>
          </div>
        </div>
      </div>

      {/* Admin KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_CARDS.map(({ label, value, trend, icon: Icon, color }) => (
          <div key={label} className="card-modern p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl border ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{trend}</span>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Admin Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System API Load Chart */}
        <div className="card-modern lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">API Throughput & Database Query Load</h2>
              <p className="text-xs text-slate-500">Real-time HTTP requests processed per hour across inspection endpoints</p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg">
              Live Monitor
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={SYSTEM_TRAFFIC_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="requests" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#colorRequests)" name="API Requests/hr" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Role Distribution */}
        <div className="card-modern space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Role Privilege Distribution</h2>
            <p className="text-xs text-slate-500">Provisioned accounts by RBAC access tier</p>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={USER_ROLE_DISTRIBUTION} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                  {USER_ROLE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {USER_ROLE_DISTRIBUTION.map((r) => (
              <div key={r.name} className="flex justify-between font-semibold">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="text-slate-700">{r.name}</span>
                </span>
                <span className="font-bold text-slate-900">{r.value} Accounts</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. INSPECTOR DASHBOARD (Field Workload & Daily Route Focus)
   ========================================================================== */
function InspectorDashboard({ navigate, user }) {
  const KPI_CARDS = [
    { label: 'My Pending Audits Today', value: '5 Venues', trend: '2 Urgent', isPositive: false, icon: Calendar, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    { label: 'Completed This Month', value: '18 Audits', trend: '+4 vs Goal', isPositive: true, icon: CheckSquare, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { label: 'My Audit Approval Rate', value: '94.2%', trend: 'Grade A Avg', isPositive: true, icon: Award, color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { label: 'Re-inspections Due', value: '2 Venues', trend: 'High Priority', isPositive: false, icon: AlertTriangle, color: 'bg-rose-50 text-rose-600 border-rose-200' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="card-modern bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge badge-info mb-2">FIELD OFFICER DISPATCH HUB</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Good day, Officer {user?.fullName || 'David Kim'}</h1>
            <p className="text-slate-300 text-sm mt-1">
              Assigned District: <strong className="text-indigo-300">Downtown & Harbor District</strong>. You have 5 scheduled inspections queued today.
            </p>
          </div>
          <button onClick={() => navigate('/inspections?action=new')} className="btn-primary">
            <Plus className="w-4 h-4" /> Start Field Audit
          </button>
        </div>
      </div>

      {/* Inspector KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_CARDS.map(({ label, value, trend, icon: Icon, color }) => (
          <div key={label} className="card-modern p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl border ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">{trend}</span>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Inspector Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Inspection Output Bar Chart */}
        <div className="card-modern space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">My Weekly Audit Completion Rate</h2>
            <p className="text-xs text-slate-500">Field audits completed vs non-compliance findings this week</p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INSPECTOR_ROUTE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="completed" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Audits Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* My Daily Inspection Schedule List */}
        <div className="card-modern space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">My Assigned Inspection Queue</h2>
            <span className="text-xs font-bold text-indigo-600">Today's Route</span>
          </div>

          <div className="space-y-3">
            {INITIAL_BUSINESSES.slice(0, 3).map((b, index) => (
              <div key={b.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-600">#{index + 1}</span>
                    <p className="text-xs font-bold text-slate-900">{b.name}</p>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{b.address} &bull; {b.riskLevel} RISK</p>
                </div>
                <button onClick={() => navigate('/inspections')} className="btn-ghost text-xs text-indigo-600 font-semibold">
                  Launch Audit &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. SUPERVISOR DASHBOARD (District Oversight & Workload Balancer)
   ========================================================================== */
function SupervisorDashboard({ navigate }) {
  const KPI_CARDS = [
    { label: 'District Venues Managed', value: '452 Venues', trend: 'District 1', isPositive: true, icon: Building2, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    { label: 'Active Field Officers', value: '4 Officers', trend: '100% Active', isPositive: true, icon: UserCheck, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { label: 'District Avg Score', value: '86.4 / 100', trend: 'Grade A Target', isPositive: true, icon: Award, color: 'bg-amber-50 text-amber-600 border-amber-200' },
    { label: 'Overdue Re-inspections', value: '3 Backlogged', trend: 'Needs Assign', isPositive: false, icon: AlertCircle, color: 'bg-rose-50 text-rose-600 border-rose-200' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="card-modern bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge badge-warning mb-2">DISTRICT SUPERVISOR COMMAND</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">District Operations & Officer Workload</h1>
            <p className="text-slate-300 text-sm mt-1">
              Surveillance area: <strong className="text-amber-300">Central Municipal District 1 & 2</strong>. 4 active officers dispatched.
            </p>
          </div>
          <button onClick={() => navigate('/inspectors')} className="btn-primary">
            <UserCheck className="w-4 h-4" /> Manage Inspectors
          </button>
        </div>
      </div>

      {/* Supervisor KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_CARDS.map(({ label, value, trend, icon: Icon, color }) => (
          <div key={label} className="card-modern p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl border ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">{trend}</span>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Supervisor Workload Comparison Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card-modern lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Officer Workload & Monthly Completion Comparison</h2>
            <p className="text-xs text-slate-500">Total audits completed this month by lead field inspector</p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={OFFICER_WORKLOAD_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                <Bar dataKey="completed" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Completed Audits" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hazard Risk Distribution */}
        <div className="card-modern space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">District Venue Risk Tiers</h2>
            <p className="text-xs text-slate-500">Breakdown of high vs low risk venues in District 1</p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <p className="text-xs font-bold text-rose-700">High Risk Food Prep (HACCP Required)</p>
              <p className="text-lg font-extrabold text-rose-900 mt-0.5">142 Establishments (31%)</p>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
              <p className="text-xs font-bold text-amber-700">Medium Risk Deli & Grocery</p>
              <p className="text-lg font-extrabold text-amber-900 mt-0.5">210 Establishments (46%)</p>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <p className="text-xs font-bold text-emerald-700">Low Risk Bakeries & Cafes</p>
              <p className="text-lg font-extrabold text-emerald-900 mt-0.5">100 Establishments (23%)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. COMMISSIONER DASHBOARD (Citywide Health & Executive Macro Metrics)
   ========================================================================== */
function CommissionerDashboard({ navigate }) {
  const KPI_CARDS = [
    { label: 'Citywide Compliance Index', value: '98.4%', trend: '+1.2% YoY', isPositive: true, icon: ShieldAlert, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
    { label: 'Emergency License Holds', value: '2 Venues', trend: 'Enforced', isPositive: false, icon: AlertTriangle, color: 'bg-rose-50 text-rose-600 border-rose-200' },
    { label: 'Grade A Quality Ratio', value: '58.0%', trend: 'Top Tier', isPositive: true, icon: Award, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    { label: 'Public Outbreak Hazard Risk', value: 'LEVEL 0', trend: 'Safe', isPositive: true, icon: CheckCircle2, color: 'bg-sky-50 text-sky-600 border-sky-200' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero */}
      <div className="card-modern bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-950 text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="badge badge-info mb-2">PUBLIC HEALTH COMMISSIONER COMMAND</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold">Executive Citywide Health Surveillance</h1>
            <p className="text-slate-300 text-sm mt-1">
              Macro Overview: <strong className="text-emerald-400">98.4% Public Compliance Index</strong> across all 4 municipal health sectors.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/reports')} className="btn-primary shadow-indigo-600/40">
              <Download className="w-4 h-4" /> Download Executive Report
            </button>
          </div>
        </div>
      </div>

      {/* Commissioner KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {KPI_CARDS.map(({ label, value, trend, icon: Icon, color }) => (
          <div key={label} className="card-modern p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-2xl border ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{trend}</span>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-slate-900">{value}</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Commissioner Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Citywide Monthly Hygiene Trend Area Chart */}
        <div className="card-modern lg:col-span-2 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Citywide Monthly Hygiene Trend & Audit Success</h2>
            <p className="text-xs text-slate-500">Longitudinal evaluation of monthly inspections and passed sanitation audits</p>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_TREND_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorComm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
                <Area type="monotone" dataKey="inspections" stroke="#4f46e5" strokeWidth={2.5} fill="url(#colorComm)" name="Total Audits" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Grade Share Donut Chart */}
        <div className="card-modern space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Hygiene Grade Ratio</h2>
            <p className="text-xs text-slate-500">Percentage distribution of Grade A to F venues</p>
          </div>

          <div className="h-56 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={COMPLIANCE_DISTRIBUTION} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={5} dataKey="value">
                  {COMPLIANCE_DISTRIBUTION.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
            {COMPLIANCE_DISTRIBUTION.map((item) => (
              <div key={item.name} className="flex justify-between font-semibold">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700">{item.name}</span>
                </span>
                <span className="font-bold text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
