/**
 * src/App.jsx
 * Root component – wires providers and router.
 */

import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import { AuthProvider } from './context/AuthContext.jsx';
import router from './routes/index.jsx';
import './styles/global.css';
import { useOfflineSync } from './hooks/useOfflineSync.js';

// Internal App wrapper to consume hooks securely
function InnerApp() {
    useOfflineSync();
    return <RouterProvider router={router} />;
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 30_000,
            refetchOnWindowFocus: false,
        },
    },
});

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <InnerApp />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: { background: '#1f2937', color: '#f9fafb', borderRadius: '10px' },
                        success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
                        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                    }}
                >
                    {(t) => (
                        <ToastBar toast={t}>
                            {({ icon, message }) => (
                                <>
                                    {icon}
                                    {message}
                                    {t.type !== 'loading' && (
                                        <button
                                            type="button"
                                            onClick={() => toast.dismiss(t.id)}
                                            aria-label="Close notification"
                                            className="ml-2 flex items-center justify-center p-1 rounded hover:bg-gray-700 transition-colors duration-200 cursor-pointer text-gray-400 hover:text-white"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </>
                            )}
                        </ToastBar>
                    )}
                </Toaster>
            </AuthProvider>
        </QueryClientProvider>
    );
}
