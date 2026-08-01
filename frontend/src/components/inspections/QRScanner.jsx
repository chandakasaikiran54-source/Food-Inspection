import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function QRScanner({ onClose, onScanSuccess }) {

    useEffect(() => {
        const scanner = new Html5QrcodeScanner(
            "gv-inspector-qr-scanner",
            { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
            false
        );

        const internalSuccess = (decodedText, decodedResult) => {
            // Stop scanning automatically to prevent rapid multiple firings
            scanner.clear().catch(e => console.error(e));

            // Extract token from full URL if they scanned the standard URL
            let token = decodedText;
            try {
                if (decodedText.includes('/scan?q=')) {
                    const url = new URL(decodedText);
                    token = url.searchParams.get('q');
                }
            } catch (e) { }

            onScanSuccess(token);
        };

        const internalError = (err) => {
            // Silently ignore regular scanning errors while searching
        };

        scanner.render(internalSuccess, internalError);

        return () => {
            scanner.clear().catch(e => console.error("Could not clear scanner", e));
        };
    }, [onScanSuccess]);

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Scan Business QR</h2>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-rose-100 hover:text-rose-600 transition-colors">
                        <X className="w-5 h-5 cursor-pointer" />
                    </button>
                </div>

                <div className="rounded-2xl overflow-hidden border-2 border-indigo-100">
                    <div id="gv-inspector-qr-scanner"></div>
                </div>

                <p className="text-xs text-center text-slate-500 mt-4">
                    Align the official GVMC QR Code within the frame to authenticate the business and begin the inspection sequence.
                </p>
            </div>
        </div>
    );
}
