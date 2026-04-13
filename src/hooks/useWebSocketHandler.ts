import { useEffect, useRef, useState } from "react";
import { getActiveToken } from "@/lib/secureStore";
import { useAccounts } from "@/hooks/useAccounts";
import { useMe } from "@/hooks/useMe";
import { tempStore } from "@/store/tempStore";
import { messagesActions } from "@/components/chat";
import {
  connectWebSocket,
  disconnectWebSocket,
  subscribeWebSocket,
  subscribeWebSocketStatus,
} from "@/lib/webSocketClient";

export function useWebSocketHandler() {
  const { me } = useMe();
  const { updateAccount } = useAccounts();
  const [isConnected, setIsConnected] = useState(false);
  const actionsRef = useRef(messagesActions());

  useEffect(() => {
    actionsRef.current = messagesActions();
  });

  useEffect(() => {
    let cancelled = false;
    if (!me) {
      disconnectWebSocket();
      return;
    }
    (async () => {
      const authToken = await getActiveToken();
      if (cancelled || !authToken) return;
      connectWebSocket(`wss://app.topnotchcity.com/ws/?token=${authToken}`);
    })();

    return () => {
      cancelled = true;
    };
  }, [me?.id]);

  useEffect(() => subscribeWebSocketStatus(setIsConnected), []);

  useEffect(() => {
    const unsubscribe = subscribeWebSocket(async (data) => {
      const {
        addIncomingMessage,
        updateMessageStatus,
        updateMessage,
        updateUserStatus,
        deleteMessage,
        updateChats,
      } = actionsRef.current;

      switch (data?.type) {
        case "new_message": {
          tempStore.setTyping(data.chat_id, false);
          await addIncomingMessage(data.chat_id, {
            message_id: data.message_id!,
            created_at: data.created_at,
            content: data.content,
            sender_info: { id: data.sender_id },
            status: data.status,
            file_data: data.media?.map((f: any) => ({
              id: f.id,
              file_url: f.file_url,
              file_type: f.file_type,
            })),
          } as any);
          return;
        }
        case "read_receipt":
          await updateMessageStatus({
            chatId: data.chat_id,
            messageId: data.message_id,
            status: "seen",
          });
          return;
        case "message_edited":
          await updateMessage({
            chatId: data.chat_id,
            message: data.content,
          });
          return;
        case "unread_count_update":
          tempStore.updatetotalUnreadChat(data.total_unread);
          return;
        case "typing":
          tempStore.setTyping(data.chat_id, data.is_typing);
          return;
        case "message_deleted":
          await deleteMessage({
            messageId: data.message_id,
            all: data.deleted_for_everyone,
          });
          return;
        case "presence":
          await updateUserStatus({
            userId: data.chat_id,
            status: data.is_online ? "online" : "offline",
          });
          return;
        case "chat_list_update":
          await updateChats(data.chats as ServerChat[]);
          return;
        case "agent_application_review":
          await updateAccount();
          return;
        default:
          return;
      }
    });

    return unsubscribe;
  }, [updateAccount]);

  return { isConnected };
}
