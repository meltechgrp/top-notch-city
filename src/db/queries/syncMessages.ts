import { getChatMessages } from "@/actions/message";
import { diffMessages, getLocalMessagesIndex } from "@/db/helpers";
import { syncMessagesEngine } from "@/db/sync/message";
import { useMe } from "@/hooks/useMe";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { useCallback, useEffect, useRef, useState } from "react";

export function useMessagesSync({
  auto = true,
  chatId,
}: {
  auto: boolean;
  chatId: string;
}) {
  const [syncing, setSyncing] = useState(false);
  const syncingRef = useRef(false);
  const { me } = useMe();
  const { isInternetReachable } = useNetworkStatus();

  const resync = useCallback(async () => {
    if (!me || !chatId || syncingRef.current) return;
    try {
      syncingRef.current = true;
      setSyncing(true);

      const [messageResult, local] = await Promise.all([
        getChatMessages({ chatId, pageParam: 1, size: 50 }),
        getLocalMessagesIndex(chatId),
      ]);

      if (!messageResult?.messages) return;

      const {
        pullCreate,
        pullDelete,
        pullUpdate,
        pushCreate,
        pushDeleteAll,
        pushDeleteMe,
        pushUpdate,
      } = diffMessages({
        serverMessages: messageResult.messages,
        localMessages: local,
        mode: "full",
      });

      await syncMessagesEngine({
        chatId,
        pullCreate,
        pullDelete,
        pullUpdate,
        pushCreate,
        pushDeleteAll,
        pushDeleteMe,
        pushUpdate,
        extra: {
          you_blocked_other:
            messageResult?.block_status?.you_blocked_other || false,
          other_blocked_you:
            messageResult?.block_status?.other_blocked_you || false,
          total_messages: messageResult?.pagination?.total_messages || 0,
        },
      });
    } finally {
      syncingRef.current = false;
      setSyncing(false);
    }
  }, [me, chatId]);

  useEffect(() => {
    if (!auto || !isInternetReachable || !me || !chatId) return;
    resync();
  }, [auto, isInternetReachable, me, chatId, resync]);

  return {
    syncing,
    resync,
  };
}
