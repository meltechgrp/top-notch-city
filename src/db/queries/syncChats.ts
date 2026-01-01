import { getChats } from "@/actions/message";
import { diffChats, getLocalChatIndex } from "@/db/helpers";
import { syncChatsEngine } from "@/db/sync/chat";
import { useMe } from "@/hooks/useMe";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { mainStore } from "@/store";
import { useCallback, useEffect, useRef, useState } from "react";

export function useChatsSync({ auto = true } = {}) {
  const [syncing, setSyncing] = useState(false);
  const hasAutoSynced = useRef(false);
  const { me } = useMe();
  const { isInternetReachable } = useNetworkStatus();

  const resync = useCallback(async () => {
    try {
      setSyncing(true);
      if (!me) return;
      const lastSyncAt = mainStore.chatsLastSyncAt.get() || 0;
      const res = await getChats();
      if (!res?.total || res?.total == 0) return;
      const local = await getLocalChatIndex();
      const { pullCreate, pullDelete, pullUpdate, pushDelete } = diffChats({
        localChats: local,
        serverChats: res.chats,
        mode: "full",
      });
      await syncChatsEngine({
        pullCreate,
        pullUpdate,
        pullDelete,
        pushDelete,
      });
    } finally {
      setSyncing(false);
    }
  }, [me, isInternetReachable]);
  useEffect(() => {
    if (auto && me) {
      resync();
    }
  }, [me, auto]);
  useEffect(() => {
    if (!auto || !isInternetReachable || hasAutoSynced.current || me) return;

    hasAutoSynced.current = true;
    resync();
  }, [auto, isInternetReachable, me]);

  return {
    syncing,
    resync,
  };
}
