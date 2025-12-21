import React, { useEffect, useCallback } from "react";
import eventBus from "@/lib/eventBus";
import AuthModals from "../globals/AuthModals";
import { useMultiAccount } from "@/hooks/useAccounts";
import { useBackgroundSync } from "@/hooks/useTaskManager";

export default function GlobalManager() {
  const { updateAccount } = useMultiAccount();
  const { syncNow } = useBackgroundSync();

  const updateMe = useCallback(async () => {
    await updateAccount();
  }, [updateAccount]);

  useEffect(() => {
    eventBus.addEventListener("REFRESH_PROFILE", updateMe);
    return () => {
      eventBus.removeEventListener("REFRESH_PROFILE", updateMe);
    };
  }, [updateMe]);

  useEffect(() => {
    updateMe();
    syncNow();
  }, []);

  return <AuthModals />;
}
