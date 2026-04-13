import { getChats } from "@/actions/message";
import { diffChats, getLocalChatIndex } from "@/db/helpers";
import { syncChatsEngine } from "@/db/sync/chat";
import { useMe } from "@/hooks/useMe";
import { useCallback, useRef, useState } from "react";

export function useChatsSync() {
  const [syncing, setSyncing] = useState(false);
  const syncingRef = useRef(false);
  const { me } = useMe();

  const resync = useCallback(async () => {
    if (!me || syncingRef.current) return;
    try {
      syncingRef.current = true;
      setSyncing(true);
      console.log("starting chats sync");

      const [res, local] = await Promise.all([
        getChats(),
        getLocalChatIndex(),
      ]);

      const serverChats = res?.chats ?? [];

      const { pullCreate, pullDelete, pullUpdate, pushDelete } = diffChats({
        localChats: local,
        serverChats,
        mode: "full",
      });

      if (
        !pullCreate.length &&
        !pullUpdate.length &&
        !pullDelete.length &&
        !pushDelete.length
      ) {
        return;
      }

      await syncChatsEngine({
        pullCreate,
        pullUpdate,
        pullDelete,
        pushDelete,
      });
    } finally {
      syncingRef.current = false;
      setSyncing(false);
    }
  }, [me]);

  return {
    syncing,
    resync,
  };
}
