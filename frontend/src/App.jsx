/**
 * src/App.jsx
 * Root component – wires providers and router.
 */

import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext.jsx';
import router from './routes/index.jsx';
import './styles/global.css';

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
                <RouterProvider router={router} />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: { background: '#1f2937', color: '#f9fafb', borderRadius: '10px' },
                        success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
                        error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                    }}
                />
            </AuthProvider>
        </QueryClientProvider>
    );
}
