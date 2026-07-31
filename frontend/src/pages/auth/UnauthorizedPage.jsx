/**
 * src/pages/auth/UnauthorizedPage.jsx
 */
import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="text-6xl mb-4">🚫</div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">403</h1>
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Access Denied</h2>
                <p className="text-gray-500 mb-6">You do not have permission to access this page.</p>
                <div className="flex gap-3 justify-center">
                    <button onClick={() => navigate(-1)} className="btn-secondary">Go Back</button>
                    <button onClick={() => navigate('/')} className="btn-primary">Dashboard</button>
                </div>
            </div>
        </div>
    );
}
