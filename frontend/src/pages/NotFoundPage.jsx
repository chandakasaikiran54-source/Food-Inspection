/**
 * src/pages/NotFoundPage.jsx
 */
import { useNavigate } from 'react-router-dom';
import { Compass, LayoutDashboard } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="card-modern max-w-md w-full text-center space-y-5 p-8 bg-white/95 backdrop-blur-md shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-200">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
            Error Code 404
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-3">Page Not Found</h1>
          <p className="text-slate-500 text-sm mt-2">
            The requested address or food surveillance route could not be found.
          </p>
        </div>
        <div className="pt-2">
          <button onClick={() => navigate('/')} className="btn-primary w-full">
            <LayoutDashboard className="w-4 h-4" /> Return to Dashboard Overview
          </button>
        </div>
      </div>
    </div>
  );
}
