/**
 * src/pages/profile/ProfilePage.jsx
 */
import { useAuth } from '../../context/AuthContext.jsx';

const ROLE_BADGE = {
    ADMIN: 'badge-admin', COMMISSIONER: 'badge-commissioner',
    SUPERVISOR: 'badge-supervisor', INSPECTOR: 'badge-inspector',
};

export default function ProfilePage() {
    const { user } = useAuth();
    return (
        <div className="max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-6">My Profile</h2>
            <div className="card p-6 space-y-4">
                <div className="flex items-center gap-5 pb-4 border-b">
                    <div className="w-16 h-16 rounded-full bg-primary-600 text-white flex items-center justify-center text-2xl font-bold">
                        {user?.fullName?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div>
                        <p className="font-semibold text-lg text-gray-900">{user?.fullName}</p>
                        <span className={`${ROLE_BADGE[user?.role]} text-xs`}>{user?.role}</span>
                    </div>
                </div>
                {[
                    { label: 'Email', value: user?.email },
                    { label: 'Status', value: user?.status },
                    { label: 'Last Login', value: user?.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'N/A' },
                    { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A' },
                ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-2 border-b last:border-0">
                        <span className="text-sm font-medium text-gray-500">{label}</span>
                        <span className="text-sm text-gray-900">{value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
