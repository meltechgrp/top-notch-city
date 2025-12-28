import { useEffect } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  const {
    updateChatMessages,
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
    getNextPageParam: ({ pagination }) =>
      pagination.page < pagination.total_pages
        ? pagination.page + 1
        : undefined,
  });

  // Sync messages into Zustand
  useEffect(() => {
    if (messageData?.pages && chatId) {
      const messages = messageData.pages.flatMap((p) => p.messages);
      updateChatMessages(chatId, messages);
    }
  }, [messageData, chatId]);

  const messages = useChatStore(useShallow((s) => s.getMessages(chatId)));
  // const media = useChatStore(useShallow((s) => s.getMedia(chatId)));
  const typing = useChatStore(useShallow((s) => s.getTyping(chatId)));

  /** --- MUTATIONS --- */
  const { mutateAsync: send } = useMutation({ mutationFn: sendMessage });
  const { mutateAsync: edit } = useMutation({ mutationFn: editMessage });
  const { mutate: markAsRead } = useMutation({
    mutationFn: makeMessageReadAndDelivered,
  });

  const invalidateChats = () => {
    queryClient.invalidateQueries({ queryKey: ["chats"] });
  };

  async function handleSendMessage(data: Message, isEdit: boolean) {
    if (isEdit) {
      updateMessage(chatId, data.message_id, data.content);
      await edit(
        { message_id: data.message_id, content: data.content },
        {
          onSuccess: (m) => {
            replaceMockMessage(chatId, data.message_id, {
              updated_at: m?.created_at,
              content: m?.content,
              status: m?.status,
            });
            playSound("MESSAGE_SENT");
            invalidateChats();
          },
        }
      );
      return;
    }

    addPendingMessage(chatId, [data]);
    await send(
      {
        chat_id: chatId,
        content: data.content,
        files: data.file_data,
        reply_to_message_id: data.reply_to_message_id,
      },
      {
        onError: () => updateMessageStatus(chatId, data.message_id, "error"),
        onSuccess: (m) => {
          replaceMockMessage(chatId, data.message_id, {
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
              id: f.id,
              file_url: f.file_url,
              file_type: f.file_type,
            })),
            read: m?.read,
          });
          playSound("MESSAGE_SENT");
          invalidateChats();
        },
      }
    );
  }

  return {
    messages,
    refetchMessages,
    fetchNextPage,
    hasNextPage,
    loading: loadingMessages,
    refreshing: refreshingMessages,
    handleSendMessage,
    clearChatMessages,
    markAsRead,
    typing,
    receiver: getReceiver(chatId),
    sender: getSender(chatId),
    // media,
  };
}
