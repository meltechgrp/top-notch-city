import { getChats } from "@/actions/message";
import { diffChats, getLocalChatIndex } from "@/db/helpers";
import { syncChatsEngine } from "@/db/sync/chat";
import { useMe } from "@/hooks/useMe";
import { useCallback, useState } from "react";

export function useChatsSync() {
  const [syncing, setSyncing] = useState(false);
  const { me } = useMe();

  const resync = useCallback(async () => {
    try {
      setSyncing(true);
      if (!me) return;
      console.log("starting chats sync");
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
  }, [me]);

  return {
    syncing,
    resync,
  };
}
