import AsyncStorage from '@react-native-async-storage/async-storage';
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({ id: 'hYID2vXzDQBdh2EqJEpQ' });

export function saveToStorage(key: string, data: any) {
  data = JSON.stringify(data)
  storage.set(key, data)
}

export function getFromStorage(key: string) {
  let d = storage.getString(key)
  try {
    // @ts-ignore
    return JSON.parse(d)
  } catch (error) {
    return d
  }
}

export function delFromStorage(key: string) {
  storage.delete(key)
}

class CacheStorage {
	set(key: string, data: any, ttl: number) {
		data = JSON.stringify({ data, ttl: Date.now() + ttl });
		AsyncStorage.setItem(key, data);
	}

	async get(key: string) {
		let str = await AsyncStorage.getItem(key);
		if (!str) {
			return null;
		}
		try {
			const d = JSON.parse(str) as { data: any; ttl: number };
			if (d.ttl && d.ttl < Date.now()) {
				AsyncStorage.removeItem(key);
				return null;
			}
			return d.data;
		} catch (error) {
			return null;
		}
	}
}

export const cacheStorage = new CacheStorage();
