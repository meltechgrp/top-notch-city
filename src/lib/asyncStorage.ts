import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_PREFIX = "CACHE__";

class CacheStorage {
  makeKey(key: string) {
    return `${CACHE_PREFIX}${key}`;
  }

  async set(key: string, data: any, ttl: number) {
    const value = JSON.stringify({ data, ttl: Date.now() + ttl });
    await AsyncStorage.setItem(this.makeKey(key), value);
  }

  async get(key: string) {
    const str = await AsyncStorage.getItem(this.makeKey(key));
    if (!str) return null;

    try {
      const parsed = JSON.parse(str) as { data: any; ttl: number };
      if (parsed.ttl && parsed.ttl < Date.now()) {
        await AsyncStorage.removeItem(this.makeKey(key));
        return null;
      }
      return parsed.data;
    } catch {
      return null;
    }
  }

  async remove(key: string) {
    await AsyncStorage.removeItem(this.makeKey(key));
  }

  async reset() {
    const keys = await AsyncStorage.getAllKeys();
    const cacheKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));

    if (cacheKeys.length > 0) {
      await AsyncStorage.multiRemove(cacheKeys);
    }
  }
  async resetAll() {
    await AsyncStorage.clear();
  }
}

export const cacheStorage = new CacheStorage();
