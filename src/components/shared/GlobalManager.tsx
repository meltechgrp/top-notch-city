import React, { useEffect, useCallback } from "react";
import eventBus from "@/lib/eventBus";
import AuthModals from "../globals/AuthModals";
import { useAccounts } from "@/hooks/useAccounts";

export default function GlobalManager() {
  const { updateAccount } = useAccounts();

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
  }, []);

  return <AuthModals />;
}
