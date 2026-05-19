import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  setActiveUserId,
  removeActiveUser,
  setToken,
  removeToken,
} from "@/lib/secureStore";

export const profileDefault = require("@/assets/images/Avatar.png");

export type AccountEntry = {
  user: Me;
  lastLoginAt: number;
};

type MainStore = {
  accounts: Record<string, AccountEntry>;
  activeUserId: string | null;
  muted: boolean;
  propertyLastSyncAt: number;
  locationLastSyncAt: number;
  chatsLastSyncAt: number;
  isOnboarded: boolean;
  address: Address;
  activeAccount: () => Me | null;
  saveAddress: (data: Partial<Address>) => void;
  updateMuted: (state: boolean) => void;
  addAccount: (user: Me, token: string) => Promise<void>;
  updateActiveAccount: (user: Me) => void;
  switchAccount: (userId: string) => Promise<void>;
  removeAccount: (userId: string) => Promise<void>;
  reset: () => void;
  setIsOnboarded: (state: boolean) => void;
  setPropertyLastSyncAt: (value: number) => void;
  setLocationLastSyncAt: (value: number) => void;
  setChatsLastSyncAt: (value: number) => void;
};

const initialState = {
  muted: false,
  isOnboarded: false,
  propertyLastSyncAt: 0,
  locationLastSyncAt: 0,
  chatsLastSyncAt: 0,
  accounts: {} as Record<string, AccountEntry>,
  address: {} as Address,
  activeUserId: null as string | null,
};

export const useMainStore = create<MainStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      activeAccount: () => {
        const userId = get().activeUserId;
        if (!userId) return null;
        return get().accounts[userId]?.user ?? null;
      },

      setIsOnboarded: (isOnboarded) => set({ isOnboarded }),

      saveAddress: (data) =>
        set((state) => ({ address: { ...state.address, ...data } })),

      updateMuted: (muted) => set({ muted }),

      addAccount: async (user, token) => {
        const now = Date.now();

        set((state) => ({
          accounts: {
            ...state.accounts,
            [user.id]: { user, lastLoginAt: now },
          },
          activeUserId: user.id,
        }));

        await Promise.all([setActiveUserId(user.id), setToken(user.id, token)]);
      },

      updateActiveAccount: (user) =>
        set((state) => ({
          accounts: {
            ...state.accounts,
            [user.id]: {
              user,
              lastLoginAt: state.accounts[user.id]?.lastLoginAt ?? Date.now(),
            },
          },
          activeUserId: user.id,
        })),

      switchAccount: async (userId) => {
        if (!get().accounts[userId]) return;
        set({ activeUserId: userId });
        await setActiveUserId(userId);
      },

      removeAccount: async (userId) => {
        const accounts = { ...get().accounts };
        delete accounts[userId];

        await removeToken(userId);

        if (get().activeUserId !== userId) {
          set({ accounts });
          return;
        }

        const next = Object.keys(accounts)[0];
        if (next) {
          set({ accounts, activeUserId: next });
          await setActiveUserId(next);
        } else {
          set({ accounts, activeUserId: null });
          await removeActiveUser();
        }
      },

      reset: () => set({ ...initialState }),

      setPropertyLastSyncAt: (propertyLastSyncAt) =>
        set({ propertyLastSyncAt }),
      setLocationLastSyncAt: (locationLastSyncAt) =>
        set({ locationLastSyncAt }),
      setChatsLastSyncAt: (chatsLastSyncAt) => set({ chatsLastSyncAt }),
    }),
    {
      name: "topnotch-main",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        accounts: state.accounts,
        activeUserId: state.activeUserId,
        muted: state.muted,
        propertyLastSyncAt: state.propertyLastSyncAt,
        locationLastSyncAt: state.locationLastSyncAt,
        chatsLastSyncAt: state.chatsLastSyncAt,
        isOnboarded: state.isOnboarded,
        address: state.address,
      }),
    },
  ),
);

export const mainStore = useMainStore;
