import GlobalFullScreenLoader from "@/components/loaders/GlobalFullScreenLoader";
import SnackBar from "@/components/shared/SnackBar";
import eventBus from "@/lib/eventBus";
import { getAuthToken, removeAuthToken } from "@/lib/secureStore";
import { getUniqueIdSync } from "react-native-device-info";
import { useStore, useTempStore } from "@/store";
import React, { useEffect } from "react";
import AuthModals from "../globals/AuthModals";
import config from "@/config";

export default function GlobalManager() {
  const fullScreenLoading = useTempStore((s) => s.fullScreenLoading);
  const setMe = useStore((s) => s.updateProfile);
  const updateFullScreenLoading = useTempStore(
    (s) => s.updateFullScreenLoading
  );
  const hasAuth = useStore((s) => s.hasAuth);
  const [snackBars, setSnackBars] = React.useState<Array<SnackBarOption>>([]);
  const [activeSnackBar, setActiveSnackBar] =
    React.useState<SnackBarOption | null>(null);

  async function unsetAuthToken() {
    useStore.getState().resetStore();
    useTempStore.getState().resetStore();
    removeAuthToken();
  }
  async function updateMe() {
    try {
      const authToken = getAuthToken();
      const deviceId = getUniqueIdSync();
      const resp = await fetch(`${config.origin}/api/users/me`, {
        headers: {
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
          "X-DID": deviceId,
        },
      });
      if (resp.status >= 400) {
        return await unsetAuthToken();
      }
      const res = await resp.json();
      if (
        res?.detail?.includes("expired") ||
        res?.detail?.includes("Not authenticated")
      ) {
        return await unsetAuthToken();
      }
      if (!res?.detail) {
        setMe(res);
      }
    } catch (err: any) {
      if (
        err?.detail?.includes("expired") ||
        err?.detail?.includes("Not authenticated")
      ) {
        return await unsetAuthToken();
      }
    }
  }

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
    eventBus.addEventListener("REFRESH_PROFILE", updateMe);

    return () => {
      eventBus.removeEventListener("addSnackBar", addSnackBar);
      eventBus.removeEventListener("REFRESH_PROFILE", updateMe);
    };
  }, []);
  useEffect(() => {
    if (hasAuth && !getAuthToken()) {
      unsetAuthToken();
    }
  }, [hasAuth]);
  useEffect(() => {
    updateMe();
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
        />
      )}
      <GlobalFullScreenLoader
        visible={fullScreenLoading}
        onDismiss={() => updateFullScreenLoading(false)}
        dismissOnBack={false}
      />
      <AuthModals />
    </>
  );
}
