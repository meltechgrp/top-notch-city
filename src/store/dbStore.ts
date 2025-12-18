import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "last_home_sync";

export const useDbStore = create<{
  version: number;
  lastSync: number | null;
  bump: () => void;
  load: () => Promise<void>;
  update: () => Promise<void>;
}>((set) => ({
  version: 0,
  lastSync: null,
  bump: () => set((s) => ({ version: s.version + 1 })),
  load: async () => {
    const v = await AsyncStorage.getItem(KEY);
    set({ lastSync: v ? Number(v) : null });
  },

  update: async () => {
    const now = Date.now();
    await AsyncStorage.setItem(KEY, String(now));
    set({ lastSync: now });
  },
}));
