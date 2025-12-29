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
  isOnboarded: boolean;
  addAccount: (user: Me, token: string) => Promise<void>;
  activeAccount: Me | null;
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
      accounts: {},
      activeUserId: null,
      setIsOnboarded: (state: boolean) => {
        mainStore.isOnboarded.set(state);
      },
      activeAccount: () => {
        const userId = mainStore.activeUserId.get();
        if (!userId) return null;
        return mainStore.accounts[userId].user;
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
        if (!mainStore.accounts[userId]) return;

        mainStore.activeUserId.set(userId);
        await setActiveUserId(userId);
      },

      async removeAccount(userId: string) {
        delete mainStore.accounts[userId];

        await removeToken(userId);

        if (mainStore.activeUserId.peek() === userId) {
          const next = Object.keys(mainStore.accounts.peek())[0];
          if (next) {
            await mainStore.switchAccount(next);
          } else {
            mainStore.activeUserId.set(null);
            await removeActiveUser();
          }
        }
      },

      reset() {
        mainStore.accounts.set({});
        mainStore.activeUserId.set(null);
      },
    },
    persist: {
      name: "topnotch",
    },
  })
);
