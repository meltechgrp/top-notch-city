import { create } from "zustand";

type SearchState = {
  searchProperties: ServerProperty[];
  updateSearchProperties: (data: ServerProperty[]) => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  searchProperties: [],
  updateSearchProperties: (searchProperties) => set({ searchProperties }),
}));

export const searchStore = useSearchStore;
