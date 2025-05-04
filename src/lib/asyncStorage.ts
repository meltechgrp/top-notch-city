import AsyncStorage from '@react-native-async-storage/async-storage';
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
