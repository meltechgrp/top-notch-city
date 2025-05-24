import { fetchWithAuth } from '@/lib/api';
import { storage } from '@/lib/asyncStorage';
import { useStore, useTempStore } from '@/store';
import { useCallback } from 'react';

export default function useResetAppState() {
	const resetAppState = useCallback(async () => {
		await fetchWithAuth('/logout', {
			method: 'POST',
		});
		storage.clearAll();
		useStore.getState().resetStore();
		useTempStore.getState().resetStore();
	}, []);

	return resetAppState;
}
