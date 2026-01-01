import { getChatMessages } from "@/actions/message";
import {
  diffMessages,
  getLocalChatIndex,
  getLocalMessagesIndex,
} from "@/db/helpers";
import { syncChatsEngine } from "@/db/sync/chat";
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
  const hasAutoSynced = useRef(false);
  const { me } = useMe();
  const { isInternetReachable } = useNetworkStatus();

  const resync = useCallback(async () => {
    try {
      setSyncing(true);
      if (!me) return;
      const messageResult = await getChatMessages({
        chatId,
        pageParam: 1,
        size: 50,
      });
      if (!messageResult?.messages) return;
      const local = await getLocalMessagesIndex();
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
      setSyncing(false);
    }
  }, [me, isInternetReachable]);
  useEffect(() => {
    if (auto && me) {
      resync();
    }
  }, [me, auto]);
  useEffect(() => {
    if (!auto || !isInternetReachable || hasAutoSynced.current || me || chatId)
      return;

    hasAutoSynced.current = true;
    resync();
  }, [auto, isInternetReachable, me, chatId]);

  return {
    syncing,
    resync,
  };
}
