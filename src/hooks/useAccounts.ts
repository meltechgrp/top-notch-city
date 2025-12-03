import { useStore } from "@/store";
import {
  addAccountToStorage,
  getAccounts,
  getActiveAccount,
  getActiveToken,
  removeAccount,
  setActiveUserId,
} from "@/lib/secureStore";
import useResetAppState from "./useResetAppState";
import config from "@/config";
import { useCallback } from "react";

export function useMultiAccount() {
  const { updateProfile } = useStore.getState();
  const resetAppState = useResetAppState();
  const handleInvalidAuth = useCallback(async () => {
    await resetAppState();
  }, [resetAppState]);
  async function addAccount(acc: StoredAccount) {
    await resetAppState({ onlyCache: true });
    await addAccountToStorage(acc);
    updateProfile(acc);
  }
  async function updateAccount() {
    try {
      const token = await getActiveToken();
      if (!token) return await handleInvalidAuth();

      const resp = await fetch(`${config.origin}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (resp.status === 401 || resp.status === 403) {
        return await handleInvalidAuth();
      }

      const me = await resp.json();

      if (me?.detail) {
        return await handleInvalidAuth();
      }
      const acc = {
        token,
        id: me.id,
        first_name: me.first_name,
        last_name: me.last_name,
        profile_image: me?.profile_image,
        role: me.role,
        email: me.email,
        verified: me.verified,
        is_superuser: me?.is_superuser,
        lastLogin: Date.now(),
      };
      await addAccountToStorage(acc);
      updateProfile(acc);
    } catch (error) {
      return await handleInvalidAuth();
    }
  }
  async function switchToAccount(id: string) {
    await setActiveUserId(id);
    await resetAppState({ onlyCache: true, withStore: true });
    const user = await getActiveAccount();
    user && updateProfile(user);
  }

  async function removeAcc() {
    await resetAppState();
    const users = await getAccounts();
    if (users) {
      await setActiveUserId(users[0].id);
      updateProfile(users[0]);
    }
  }
  async function removeAccId(id: string) {
    await removeAccount(id);
  }
  async function removeAll() {
    await resetAppState({ logoutAll: true });
  }

  async function fetchAccounts() {
    return await getAccounts();
  }

  async function getActive() {
    return await getActiveAccount();
  }

  return {
    addAccount,
    switchToAccount,
    removeAcc,
    fetchAccounts,
    getActive,
    removeAll,
    removeAccId,
    updateAccount,
  };
}
