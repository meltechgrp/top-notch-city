import { observable } from "@legendapp/state";
import { syncObservable } from "@legendapp/state/sync";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";

import {
  getActiveAccount,
  setActiveUserId,
  removeActiveUser,
  setToken,
  removeToken,
} from "@/lib/secureStore";

export type AccountEntry = {
  user: Me;
  token: string;
  lastLoginAt: number;
};

type AccountStore = {
  accounts: Record<string, AccountEntry>;
  activeUserId: string | null;
  hydrate: () => Promise<void>;
  addAccount: (user: Me, token: string) => Promise<void>;
  activeAccount: Me | null;
  switchAccount: (userId: string) => Promise<void>;
  removeAccount: (userId: string) => Promise<void>;
  reset: () => void;
};

export const accountStore = observable<AccountStore>({
  accounts: {},
  activeUserId: null,

  activeAccount: () => {
    const userId = accountStore.activeUserId.get();
    if (!userId) return null;
    return accountStore.accounts[userId].user;
  },

  async hydrate() {
    const activeId = await getActiveAccount();
    if (activeId?.userId) {
      accountStore.activeUserId.set(activeId.userId);
    }
  },

  async addAccount(user: Me, token: string) {
    const now = Date.now();

    accountStore.accounts[user.id].set({
      user,
      token,
      lastLoginAt: now,
    });

    accountStore.activeUserId.set(user.id);

    await Promise.all([setActiveUserId(user.id), setToken(user.id, token)]);
  },

  async switchAccount(userId: string) {
    if (!accountStore.accounts[userId]) return;

    accountStore.activeUserId.set(userId);
    await setActiveUserId(userId);
  },

  async removeAccount(userId: string) {
    delete accountStore.accounts[userId];

    await removeToken(userId);

    if (accountStore.activeUserId.peek() === userId) {
      const next = Object.keys(accountStore.accounts.peek())[0];
      if (next) {
        await accountStore.switchAccount(next);
      } else {
        accountStore.activeUserId.set(null);
        await removeActiveUser();
      }
    }
  },

  reset() {
    accountStore.accounts.set({});
    accountStore.activeUserId.set(null);
  },
});

syncObservable(accountStore, {
  persist: {
    name: "accountStore",
    plugin: ObservablePersistMMKV,
  },
});
