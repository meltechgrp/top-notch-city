import { resetDatabase } from "@/db/helpers";
import { useChatsSync } from "@/db/queries/syncChats";
import { usePropertyFeedSync } from "@/db/queries/syncPropertyFeed";
import { useMe } from "@/hooks/useMe";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useCallback, useEffect, useRef } from "react";

type SyncerOptions = {
  auto?: boolean;
  reset?: boolean;
};

export function useSyncer({ auto = true, reset = false }: SyncerOptions) {
  const { isInternetReachable } = useNetworkStatus();
  const { me } = useMe();

  const { resync: syncProperties } = usePropertyFeedSync();
  const { resync: syncChats } = useChatsSync();

  const lastUserIdRef = useRef<string | null>(null);
  const syncingRef = useRef(false);
  const lastNetworkRef = useRef<boolean>(false);

  const runSync = useCallback(async () => {
    if (!isInternetReachable || syncingRef.current) return;

    try {
      syncingRef.current = true;
      console.log("🔄 Starting sync");

      // await syncProperties();
      // await syncChats();

      console.log("✅ Sync completed");
    } finally {
      syncingRef.current = false;
    }
  }, [isInternetReachable, me, syncProperties, syncChats]);

  // Handle reset safely
  useEffect(() => {
    if (!reset) return;

    (async () => {
      await resetDatabase();
      lastUserIdRef.current = null;
    })();
  }, [reset]);

  useEffect(() => {
    if (!auto || !isInternetReachable) return;

    const networkReconnected =
      lastNetworkRef.current === false && isInternetReachable === true;

    const userChanged = me?.id !== lastUserIdRef.current;

    if (networkReconnected || userChanged || lastUserIdRef.current === null) {
      lastUserIdRef.current = me?.id ?? null;
      runSync();
    }

    lastNetworkRef.current = isInternetReachable;
  }, [auto, isInternetReachable, me, runSync]);

  return {
    sync: runSync,
    isSyncing: syncingRef.current,
  };
}
