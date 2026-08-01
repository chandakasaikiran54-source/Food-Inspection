import { useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from '../services/api.js';

const OFFLINE_STORAGE_KEY = 'gvmc_offline_inspections';

export function useOfflineSync() {

    // Save an inspection locally when offline
    const saveOffline = (inspectionData) => {
        try {
            const existing = JSON.parse(localStorage.getItem(OFFLINE_STORAGE_KEY) || '[]');
            existing.push({
                ...inspectionData,
                _offlineId: Date.now().toString(),
                _savedAt: new Date().toISOString()
            });
            localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(existing));
            toast.success('Saved to device storage. Will sync when online.', { icon: '💾' });
            return true;
        } catch (e) {
            console.error('Failed to save offline', e);
            toast.error('Local storage full or inaccessible');
            return false;
        }
    };

    // Push archived inspections to the massive backbone API
    const syncArchived = useCallback(async () => {
        try {
            const existing = JSON.parse(localStorage.getItem(OFFLINE_STORAGE_KEY) || '[]');
            if (existing.length === 0) return;

            toast.loading(`Syncing ${existing.length} offline inspections...`, { id: 'offline_sync' });

            const successIds = [];

            // In a real app we'd dispatch these batch wise or via a specific batch API
            for (const insp of existing) {
                try {
                    // Filter out local bookkeeping metadata before uploading
                    const { _offlineId, _savedAt, ...payload } = insp;
                    await api.post('/inspections', payload);
                    successIds.push(_offlineId);
                } catch (apiErr) {
                    console.error(`Failed to sync inspection ${_offlineId}`, apiErr);
                }
            }

            // Clean up successfully synced records
            const remaining = existing.filter(insp => !successIds.includes(insp._offlineId));
            localStorage.setItem(OFFLINE_STORAGE_KEY, JSON.stringify(remaining));

            if (successIds.length > 0) {
                toast.success(`Successfully synchronized ${successIds.length} inspections!`, { id: 'offline_sync' });
            } else {
                toast.dismiss('offline_sync');
            }

            if (remaining.length > 0) {
                toast.error(`${remaining.length} inspections failed to sync. Will retry later.`, { duration: 5000 });
            }
        } catch (err) {
            console.error('Sync process failed completely', err);
        }
    }, []);

    // Listen to network status
    useEffect(() => {
        const handleOnline = () => {
            toast.success('Internet connection restored');
            syncArchived();
        };

        const handleOffline = () => {
            toast.error('You are offline. Active inspections will be saved to device memory.', {
                icon: '📵',
                duration: 5000
            });
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Initial check on mount if they have backups to send right away
        if (navigator.onLine) {
            syncArchived();
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [syncArchived]);

    return {
        saveOffline,
        isOnline: navigator.onLine,
        pendingSyncCount: JSON.parse(window.localStorage.getItem(OFFLINE_STORAGE_KEY) || '[]').length
    };
}
