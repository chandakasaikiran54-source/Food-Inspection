import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api.js';
import { ShieldCheck, AlertTriangle, Building2, MapPin, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ScanPage() {
    const { token } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [status, setStatus] = useState('loading');
    const [businessData, setBusinessData] = useState(null);

    useEffect(() => {
        if (!token) {
            setStatus('error');
            return;
        }

        const resolveQR = async () => {
            try {
                // If the user is an inspector, this allows them to just use their native phone camera
                // and it will auto-route them to the internal inspection flow!
                if (isAuthenticated && ['INSPECTOR', 'SUPERVISOR', 'ADMIN'].includes(user?.role)) {
                    // Start an inspection securely
                    const response = await api.get(`/qr/secure/${token}`);
                    // Usually we'd navigate into a specific inspection draft here
                    setBusinessData(response.data.data);
                    setStatus('secure_auth');
                } else {
                    // Public Citizen resolution via isolated unauthenticated business endpoint
                    const response = await api.get(`/businesses/scan/${token}`);
                    setBusinessData(response.data.data);
                    setStatus('public_success');
                }
            } catch (err) {
                console.error(err);
                setStatus('error');
            }
        };

        resolveQR();
    }, [token, isAuthenticated, user]);

    if (!token) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center">
                    <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800">Invalid QR Code</h2>
                    <p className="text-slate-500 mt-2 text-sm">Please ensure you scanned a valid GVMC official QR code.</p>
                </div>
            </div>
        );
    }

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="flex flex-col items-center">
                    <Search className="w-12 h-12 text-indigo-600 animate-pulse mb-4" />
                    <h2 className="text-xl font-bold text-slate-800">Verifying Business...</h2>
                </div>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border-t-8 border-rose-500">
                    <AlertTriangle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-slate-800">Unrecognized Code</h2>
                    <p className="text-slate-500 mt-2 text-sm">This QR code could not be verified in the GVMC registry. The establishment may be unregistered or suspended.</p>
                    <button onClick={() => navigate('/')} className="mt-6 btn-primary w-full">Return Home</button>
                </div>
            </div>
        );
    }

    // Common info rendering
    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center pt-10 px-4">
            <div className="w-full max-w-lg space-y-6">

                {/* Header Header */}
                <div className="text-center mb-10">
                    <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto mb-3" />
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">GVMC Verified</h1>
                    <p className="text-slate-500 text-sm mt-1">Official Public Health Department Record</p>
                </div>

                <div className="bg-white rounded-3xl shadow-lg border border-slate-200 overflow-hidden">
                    <div className="bg-indigo-600 p-6 flex flex-col items-center text-white text-center">
                        <Building2 className="w-10 h-10 mb-2 opacity-80" />
                        <h2 className="text-2xl font-bold">{businessData.businessName}</h2>
                        <p className="opacity-90 font-mono text-sm mt-1">{businessData.licenseNumber}</p>
                    </div>

                    <div className="p-6 sm:p-8 space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                            <span className="text-slate-500 font-semibold text-sm">Status</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${businessData.businessStatus === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                {businessData.businessStatus || 'ACTIVE'}
                            </span>
                        </div>

                        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                            <span className="text-slate-500 font-semibold text-sm">Risk Classification</span>
                            <span className="text-slate-800 font-bold text-sm">
                                {businessData.riskCategory}
                            </span>
                        </div>

                        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                            <span className="text-slate-500 font-semibold text-sm">Last Inspected</span>
                            <span className="text-slate-800 font-bold text-sm">
                                {businessData.lastInspectionDate ? new Date(businessData.lastInspectionDate).toLocaleDateString() : 'Pending New Inspection'}
                            </span>
                        </div>

                        {status === 'secure_auth' && (
                            <div className="mt-8 pt-6 border-t border-indigo-100">
                                <div className="bg-indigo-50 p-4 rounded-2xl">
                                    <h3 className="text-sm font-bold text-indigo-900 mb-2">Inspector Controls</h3>
                                    <p className="text-xs text-indigo-700 mb-4">You are logged in as {user.role}. Start a formal inspection array manually if GPS conditions are fulfilled.</p>
                                    <button className="btn-primary w-full shadow-indigo-500/20">Begin Inspection Sequence</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
