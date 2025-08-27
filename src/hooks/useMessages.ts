import { useEffect } from "react";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { useChatStore } from "@/store/chatStore";
import {
  getChatMessages,
  sendMessage,
  editMessage,
  makeMessageReadAndDelivered,
} from "@/actions/message";
import useSound from "@/hooks/useSound";
import { useShallow } from "zustand/react/shallow";

export function useMessages(chatId: string) {
  const { playSound } = useSound();
  const {
    updateChatMessages,
    deleteChatMessage,
    clearChatMessages,
    getReceiver,
    getSender,
    addPendingMessage,
    updateMessageStatus,
    replaceMockMessage,
    updateMessage,
  } = useChatStore();

  /** --- FETCH MESSAGES --- */
  const {
    data: messageData,
    refetch: refetchMessages,
    fetchNextPage,
    hasNextPage,
    isLoading: loadingMessages,
    isFetchingNextPage: refreshingMessages,
  } = useInfiniteQuery({
    queryKey: ["messages", chatId],
    queryFn: ({ pageParam = 1 }) => getChatMessages({ pageParam, chatId }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const {
        pagination: { total_pages, page },
      } = lastPage;
      return page < total_pages ? page + 1 : undefined;
    },
    enabled: false,
  });

  // Sync messages into Zustand
  useEffect(() => {
    if (messageData && chatId) {
      const messages = messageData?.pages.flatMap((p) => p.messages) || [];
      updateChatMessages(chatId, messages);
    }
  }, [messageData, chatId]);

  const messages = useChatStore(useShallow((s) => s.getMessages(chatId)));
  const message = useChatStore(useShallow((s) => s.getMessage(chatId)));

  /** --- MUTATIONS --- */
  const { mutateAsync: send } = useMutation({ mutationFn: sendMessage });
  const { mutateAsync: edit } = useMutation({ mutationFn: editMessage });
  const { mutate: markAsRead } = useMutation({
    mutationFn: makeMessageReadAndDelivered,
  });

  async function handleSendMessage(data: Message, isEdit: boolean) {
    if (isEdit) {
      const { message_id, content } = data;
      updateMessage(chatId, data.message_id, data.content);
      await edit(
        { message_id, content },
        {
          onError: (e) => console.log("edit error", e),
          onSuccess: (m) => {
            replaceMockMessage(chatId, data.message_id, {
              ...data,
              status: "error",
            });
            playSound("MESSAGE_SENT");
          },
        }
      );
    } else {
      const { file_data, content } = data;
      addPendingMessage(chatId, [data]);

      await send(
        { chat_id: chatId, content, files: file_data },
        {
          onError: (e) => {
            console.log("send error", e);
            updateMessageStatus(chatId, data.message_id, "error");
          },
          onSuccess: (m) => {
            replaceMockMessage(chatId, data.message_id, {
              message_id: m?.message_id!,
              created_at: m?.created_at,
              updated_at: m?.created_at,
              content: m?.content,
              sender_info: {
                id: m?.sender_id,
                first_name: "",
                last_name: "",
                profile_image: "",
                status: "offline",
              },
              status: m?.status,
              file_data: m?.media?.map((f: any) => ({
                file_id: f.id,
                file_url: f.file_url,
                file_type: f.file_type,
                file_name: f.file_name,
              })),
              read: m?.read,
            });
            playSound("MESSAGE_SENT");
          },
        }
      );
    }
  }

  return {
    message,
    messages,
    refetchMessages,
    fetchNextPage,
    hasNextPage,
    loading: loadingMessages,
    refreshing: refreshingMessages,
    handleSendMessage,
    deleteChatMessage,
    clearChatMessages,
    markAsRead,
    receiver: getReceiver(chatId),
    sender: getSender(chatId),
  };
}
