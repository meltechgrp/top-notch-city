import config from "@/config";
import useResetAppState from "@/hooks/useResetAppState";
import { getActiveAccount } from "@/lib/secureStore";
import { useMainStore } from "@/store";
import { useCallback } from "react";

export function useAccounts() {
  const accounts = useMainStore((state) => state.accounts);
  const activeAccount = useMainStore((state) => state.activeAccount);
  const addAccount = useMainStore((state) => state.addAccount);
  const switchAccount = useMainStore((state) => state.switchAccount);
  const removeAccount = useMainStore((state) => state.removeAccount);
  const resetAppState = useResetAppState();

  const handleInvalidAuth = useCallback(async () => {
    await resetAppState();
  }, [resetAppState]);

  return {
    accounts,
    activeAccount,
    addAccount,
    switchAccount,
    removeAccount,
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
          },
        );

        if (!resp.ok) {
          return handleInvalidAuth();
        }

        const me = await resp.json();
        if (!me || me?.detail) {
          return handleInvalidAuth();
        }

        await addAccount(me, active.token);
      } catch {}
    }, [addAccount, handleInvalidAuth]),
  };
}
