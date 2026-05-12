import { observable } from "@legendapp/state";
import { persistentObservable } from "@/store/persist";
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
  switchAccount: (userId: string) => Promise<void>;
  removeAccount: (userId: string) => Promise<void>;
  reset: () => void;
  setIsOnboarded: (state: boolean) => void;
};

export const mainStore = observable<MainStore>(
  persistentObservable({
    initial: {
      muted: false,
      isOnboarded: false,
      propertyLastSyncAt: 0,
      locationLastSyncAt: 0,
      chatsLastSyncAt: 0,
      accounts: {},
      address: {} as Address,
      activeUserId: null,

      activeAccount: (): Me | null => {
        const userId = mainStore.activeUserId.get();
        if (!userId) return null;
        const entry = mainStore.accounts[userId];
        if (!entry || entry.peek() == null) return null;
        return entry.user.get() ?? null;
      },

      setIsOnboarded(state: boolean) {
        mainStore.isOnboarded.set(state);
      },

      saveAddress(data: Partial<Address>) {
        mainStore.address.assign(data);
      },

      updateMuted(state: boolean) {
        mainStore.muted.set(state);
      },

      async addAccount(user: Me, token: string) {
        const now = Date.now();

        mainStore.accounts[user.id].set({
          user,
          lastLoginAt: now,
        });

        mainStore.activeUserId.set(user.id);

        await Promise.all([setActiveUserId(user.id), setToken(user.id, token)]);
      },

      async switchAccount(userId: string) {
        const entry = mainStore.accounts[userId].peek();
        if (!entry) return;

        mainStore.activeUserId.set(userId);
        await setActiveUserId(userId);
      },

      async removeAccount(userId: string) {
        mainStore.accounts[userId].delete();

        await removeToken(userId);

        if (mainStore.activeUserId.peek() === userId) {
          const remaining = mainStore.accounts.peek();
          const next = Object.keys(remaining)[0];
          if (next) {
            mainStore.activeUserId.set(next);
            await setActiveUserId(next);
          } else {
            mainStore.activeUserId.set(null);
            await removeActiveUser();
          }
        }
      },

      reset() {
        mainStore.accounts.set({});
        mainStore.activeUserId.set(null);
        mainStore.propertyLastSyncAt.set(0);
        mainStore.locationLastSyncAt.set(0);
        mainStore.chatsLastSyncAt.set(0);
      },
    },
    persist: {
      name: "topnotch-main",
    },
  }),
);
