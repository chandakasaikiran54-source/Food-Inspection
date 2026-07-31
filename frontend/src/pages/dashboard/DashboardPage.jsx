/**
 * src/pages/dashboard/DashboardPage.jsx
 * Main dashboard showing KPIs and current user info.
 */

import { useAuth } from '../../context/AuthContext.jsx';

const ROLE_BADGE = {
    ADMIN: 'bg-purple-100 text-purple-800',
    COMMISSIONER: 'bg-indigo-100 text-indigo-800',
    SUPERVISOR: 'bg-yellow-100 text-yellow-800',
    INSPECTOR: 'bg-blue-100 text-blue-800',
};

const KPI_CARDS = [
    { label: 'Total Businesses', value: '—', icon: '🏢', bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Active Inspectors', value: '—', icon: '👷', bg: 'bg-green-50', text: 'text-green-600' },
    { label: 'Inspections This Month', value: '—', icon: '📋', bg: 'bg-yellow-50', text: 'text-yellow-600' },
    { label: 'Open Alerts', value: '—', icon: '🚨', bg: 'bg-red-50', text: 'text-red-600' },
];

export default function DashboardPage() {
    const { user } = useAuth();
    const lastLogin = user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'First login';

    return (
        <div className="space-y-6">
            {/* Welcome banner */}
            <div className="card p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold shrink-0">
                    {user?.fullName?.[0]?.toUpperCase() ?? '?'}
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Welcome back, {user?.fullName ?? 'User'}</h2>
                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_BADGE[user?.role] ?? 'bg-gray-100 text-gray-800'}`}>
                            {user?.role}
                        </span>
                        <span className="text-sm text-gray-500">Last login: {lastLogin}</span>
                    </div>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {KPI_CARDS.map(({ label, value, icon, bg, text }) => (
                    <div key={label} className="card p-5 flex items-center gap-4">
                        <div className={`w-13 h-13 rounded-xl ${bg} flex items-center justify-center text-2xl`}>{icon}</div>
                        <div>
                            <p className={`text-2xl font-bold ${text}`}>{value}</p>
                            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Placeholder charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {['Inspection Trends', 'Compliance Overview'].map((title) => (
                    <div key={title} className="card p-6 flex flex-col items-center justify-center h-52 text-center">
                        <div className="text-4xl mb-3">📊</div>
                        <p className="font-semibold text-gray-700">{title}</p>
                        <p className="text-sm text-gray-400 mt-1">Charts available after database integration</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
