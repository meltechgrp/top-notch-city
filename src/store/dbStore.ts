import { create } from "zustand";

type DbStore = {
  version: number;
  bump: () => void;
};

export const useDbStore = create<DbStore>((set) => ({
  version: 0,
  bump: () => set((state) => ({ version: state.version + 1 })),
}));
