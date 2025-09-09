import eventBus from "@/lib/eventBus";
import { getAuthToken, removeAuthToken } from "@/lib/secureStore";
import { getUniqueIdSync } from "react-native-device-info";
import { useStore, useTempStore } from "@/store";
import React, { useEffect } from "react";
import AuthModals from "../globals/AuthModals";
import config from "@/config";

export default function GlobalManager() {
  const setMe = useStore((s) => s.updateProfile);
  const hasAuth = useStore((s) => s.hasAuth);
  async function unsetAuthToken() {
    useStore.setState((s) => ({ me: undefined, hasAuth: false }));
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

  React.useEffect(() => {
    eventBus.addEventListener("REFRESH_PROFILE", updateMe);

    return () => {
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
      <AuthModals />
    </>
  );
}
