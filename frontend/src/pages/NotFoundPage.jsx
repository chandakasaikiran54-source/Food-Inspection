/**
 * src/pages/NotFoundPage.jsx
 */
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h1 className="text-6xl font-bold text-gray-200">404</h1>
                <h2 className="text-xl font-semibold text-gray-700 mt-2 mb-2">Page Not Found</h2>
                <p className="text-gray-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
                <button onClick={() => navigate('/')} className="btn-primary">Go to Dashboard</button>
            </div>
        </div>
    );
}
