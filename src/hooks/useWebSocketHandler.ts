import { useEffect } from "react";
import { useHomeFeed } from "@/hooks/useHomeFeed";
import { getAuthToken } from "@/lib/secureStore";
import { useWebSocketConnection } from "@/actions/utills";
import { useChatStore } from "@/store/chatStore";

export function useWebSocketHandler() {
  const authToken = getAuthToken();
  const url = authToken
    ? `wss://app.topnotchcity.com/ws/?token=${authToken}`
    : null;

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
    if (!url) return;

    connect();

    setOnMessage((data) => {
      console.log("📨 Message:", data, data?.type);

      switch (data.type) {
        case "new_message":
          setTyping(data.chat_id, false);
          addIncomingMessage(data.chat_id, {
            message_id: data?.message_id!,
            created_at: data?.created_at,
            content: data?.content,
            sender_info: {
              id: data?.sender_id,
              first_name: "",
              last_name: "",
              profile_image: "",
              status: "offline",
            },
            status: data?.status,
            file_data: data?.media?.map((f: any) => ({
              file_id: f.id,
              file_url: f.file_url,
              file_type: f.file_type,
              file_name: f.file_name,
            })),
            read: data?.read,
          });
          break;

        case "read_receipt":
          updateMessageStatus(data.chat_id, data.message_id, "seen");
          break;

        case "message_edited":
          updateMessage(data.chat_id, data.message_id, data.content);
          break;

        case "unread_count_update":
          updatetotalUnreadChat(data?.total_unread);
          break;
        case "typing":
          setTyping(data.chat_id, data.is_typing);
          break;
        case "message_deleted":
          deleteChatMessage(
            data.chat_id,
            data?.message_id,
            data.deleted_for_everyone
          );
          break;
        case "presence":
          updateUserStatus(
            data.chat_id,
            data?.is_online ? "online" : "offline"
          );
          break;
        case "chat_list_update":
          const chats = data?.chats as ChatList["details"][];
          chats?.forEach((c) => {
            updateChatListDetails(c);
          });
          break;
      }
    });
  }, [url]);

  return { ...rest };
}
