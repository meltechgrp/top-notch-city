import config from "@/config";
import useResetAppState from "@/hooks/useResetAppState";
import { getActiveAccount } from "@/lib/secureStore";
import { mainStore } from "@/store";
import { useCallback } from "react";

export function useAccounts() {
  const resetAppState = useResetAppState();
  const handleInvalidAuth = useCallback(async () => {
    await resetAppState();
  }, [resetAppState]);

  return {
    accounts: mainStore.accounts.get(),
    activeAccount: mainStore.activeAccount,
    addAccount: mainStore.addAccount,
    switchAccount: mainStore.switchAccount,
    removeAccount: mainStore.removeAccount,
    updateAccount: useCallback(async () => {
      try {
        const active = await getActiveAccount();
        if (!active?.token || !active?.userId) {
          return handleInvalidAuth();
        }

        const resp = await fetch(
          `${config.origin}/api/users/${active.userId}`,
          {
            headers: {
              Authorization: `Bearer ${active.token}`,
            },
          }
        );

        if (!resp.ok) {
          return handleInvalidAuth();
        }

        const me = await resp.json();
        if (!me || me?.detail) {
          return handleInvalidAuth();
        }

        await mainStore.addAccount(me, active.token);
      } catch {}
    }, [handleInvalidAuth]),
  };
}
