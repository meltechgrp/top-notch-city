import { useEffect, useState } from "react";
import { useHomeFeed } from "@/hooks/useHomeFeed";
import { getActiveToken } from "@/lib/secureStore";
import { useWebSocketConnection } from "@/actions/utills";
import { useChatStore } from "@/store/chatStore";
import { useMultiAccount } from "@/hooks/useAccounts";
import { useStore } from "@/store";

export function useWebSocketHandler() {
  const { me } = useStore();
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { updateAccount } = useMultiAccount();

  const {
    addIncomingMessage,
    updateMessageStatus,
    updateMessage,
    setTyping,
    updateUserStatus,
    deleteChatMessage,
    updateChatListDetails,
  } = useChatStore.getState();

  const { updatetotalUnreadChat } = useHomeFeed();
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
          setTyping(data.chat_id, false);
          addIncomingMessage(data.chat_id, {
            message_id: data.message_id!,
            created_at: data.created_at,
            content: data.content,
            sender_info: {
              id: data.sender_id,
              first_name: "",
              last_name: "",
              profile_image: "",
              status: "offline",
            },
            status: data.status,
            file_data: data.media?.map((f: any) => ({
              file_id: f.id,
              file_url: f.file_url,
              file_type: f.file_type,
              file_name: f.file_name,
            })),
            read: data.read,
          });
        },

        read_receipt: () =>
          updateMessageStatus(data.chat_id, data.message_id, "seen"),
        message_edited: () =>
          updateMessage(data.chat_id, data.message_id, data.content),
        unread_count_update: () => updatetotalUnreadChat(data.total_unread),
        typing: () => setTyping(data.chat_id, data.is_typing),
        message_deleted: () =>
          deleteChatMessage(
            data.chat_id,
            data.message_id,
            data.deleted_for_everyone
          ),
        presence: () =>
          updateUserStatus(data.chat_id, data.is_online ? "online" : "offline"),

        chat_list_update: () => {
          (data.chats as ChatList["details"][])?.forEach(updateChatListDetails);
        },

        agent_application_review: async () => {
          await updateAccount();
        },
      };

      await handlers[data.type]?.();
    });
  }, [url, isLoading]);

  return { ...rest, connect };
}
