import {
	delFromStorage,
	getFromStorage,
	saveToStorage,
} from '@/lib/asyncStorage';
import { PersistentStorage } from 'apollo3-cache-persist';

export const persistStorage: PersistentStorage<string> = {
	getItem: (name: string): string | null => {
		return getFromStorage(name) || null;
	},
	setItem: (name: string, value: string): void => {
		saveToStorage(name, value);
	},
	removeItem: (name: string): void => {
		delFromStorage(name);
	},
};
