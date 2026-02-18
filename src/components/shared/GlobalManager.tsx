import React, { useEffect, useCallback } from "react";
import eventBus from "@/lib/eventBus";
import AuthModals from "../globals/AuthModals";
import { useAccounts } from "@/hooks/useAccounts";
import SnackBar from "@/components/shared/SnackBar";

export default function GlobalManager() {
  const { updateAccount } = useAccounts();
  const [snackBars, setSnackBars] = React.useState<Array<SnackBarOption>>([]);
  const [activeSnackBar, setActiveSnackBar] =
    React.useState<SnackBarOption | null>(null);

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

  function addSnackBar(snackBar: SnackBarOption) {
    if (activeSnackBar) {
      setSnackBars([snackBar, ...snackBars]);
    } else {
      setActiveSnackBar(snackBar);
    }
  }
  function removeSnackBar() {
    const newSnackBar = snackBars[0];
    setSnackBars((v) => (v.length > 1 ? v.slice(1) : []));
    setActiveSnackBar(null);
    if (newSnackBar) {
      setActiveSnackBar(newSnackBar);
    }
  }
  React.useEffect(() => {
    eventBus.addEventListener("addSnackBar", addSnackBar);

    return () => {
      eventBus.removeEventListener("addSnackBar", addSnackBar);
    };
  }, []);
  return (
    <>
      {!!activeSnackBar && (
        <SnackBar
          type={activeSnackBar.type}
          onClose={removeSnackBar}
          text={activeSnackBar.message}
          duration={activeSnackBar.duration}
          icon={activeSnackBar.icon}
          backdrop={activeSnackBar.backdrop}
          dark={true}
        />
      )}
      <AuthModals />
    </>
  );
}
