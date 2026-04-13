import config from "@/config";
import useResetAppState from "@/hooks/useResetAppState";
import { getActiveAccount } from "@/lib/secureStore";
import { mainStore } from "@/store";
import { useValue } from "@legendapp/state/react";
import { useCallback } from "react";

export function useAccounts() {
  const accounts = useValue(mainStore.accounts);
  const resetAppState = useResetAppState();

  const handleInvalidAuth = useCallback(async () => {
    await resetAppState();
  }, [resetAppState]);

  return {
    accounts,
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
