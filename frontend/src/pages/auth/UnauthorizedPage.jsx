/**
 * src/pages/auth/UnauthorizedPage.jsx
 */
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LayoutDashboard } from 'lucide-react';

export default function UnauthorizedPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="card-modern max-w-md w-full text-center space-y-5 p-8 bg-white/95 backdrop-blur-md shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            HTTP 403 Access Forbidden
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-3">Permission Restricted</h1>
          <p className="text-slate-500 text-sm mt-2">
            Your user account role does not have authorization to view this surveillance module.
          </p>
        </div>
        <div className="flex gap-3 justify-center pt-2">
          <button onClick={() => navigate(-1)} className="btn-secondary">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <button onClick={() => navigate('/')} className="btn-primary">
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
