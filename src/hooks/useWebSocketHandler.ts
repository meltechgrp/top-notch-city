import { useEffect, useState } from "react";
import { getActiveToken } from "@/lib/secureStore";
import { useWebSocketConnection } from "@/actions/utills";
import { useAccounts } from "@/hooks/useAccounts";
import { useMe } from "@/hooks/useMe";
import { tempStore } from "@/store/tempStore";
import { messagesActions } from "@/components/chat";

export function useWebSocketHandler() {
  const { me } = useMe();
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { updateAccount } = useAccounts();

  const {
    addIncomingMessage,
    updateMessageStatus,
    updateMessage,
    updateUserStatus,
    deleteMessage,
    updateChats,
  } = messagesActions();

  const { connect, setOnMessage, ...rest } = useWebSocketConnection(url);

  useEffect(() => {
    async function fetchToken() {
      try {
        const authToken = await getActiveToken();
        setUrl(`wss://app.topnotchcity.com/ws/?token=${authToken}`);
      } catch (error) {
        console.error("❌ Failed to get WebSocket token:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchToken();
  }, [me]);
  useEffect(() => {
    if (!url || isLoading) return;

    connect();

    setOnMessage(async (data) => {
      if (data.type !== "ping") {
        console.log("📨 Message:", data);
      }

      const handlers: Record<string, () => Promise<void> | void> = {
        new_message: () => {
          tempStore.setTyping(data.chat_id, false);
          addIncomingMessage(data.chat_id, {
            message_id: data.message_id!,
            created_at: data.created_at,
            content: data.content,
            sender_info: {
              id: data.sender_id,
            },
            status: data.status,
            file_data: data.media?.map((f: any) => ({
              id: f.id,
              file_url: f.file_url,
              file_type: f.file_type,
            })),
          });
        },

        read_receipt: () =>
          updateMessageStatus({
            chatId: data.chat_id,
            messageId: data.message_id,
            status: "seen",
          }),
        message_edited: () =>
          updateMessage({ chatId: data.chat_id, message: data.content }),
        unread_count_update: () =>
          tempStore.updatetotalUnreadChat(data.total_unread),
        typing: () => tempStore.setTyping(data.chat_id, data.is_typing),
        message_deleted: () =>
          deleteMessage({
            messageId: data.message_id,
            all: data.deleted_for_everyone,
          }),
        presence: () =>
          updateUserStatus({
            userId: data.chat_id,
            status: data.is_online ? "online" : "offline",
          }),

        chat_list_update: () => {
          updateChats(data.chats as ChatList["details"][]);
        },

        agent_application_review: () => updateAccount(),
      };

      await handlers[data.type]?.();
    });
  }, [url, isLoading]);

  return { ...rest, connect };
}
