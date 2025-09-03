import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "@/store/chatStore";
import { getChatMessages, getChats } from "@/actions/message";

export function useChat() {
  const { updateChatList, getMessages, updateChatMessages, getChatList } =
    useChatStore();

  const queryClient = useQueryClient();
  const {
    data: chatData,
    refetch: refetchChats,
    isLoading: loadingChats,
    isFetching: refreshingChats,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
    enabled: false,
  });

  // Sync chat list into Zustand
  useEffect(() => {
    if (chatData) {
      chatData?.chats?.forEach((chat) => {
        updateChatList({
          details: chat,
          messages: getMessages(chat.chat_id), // keep old messages
        });
      });
    }
  }, [chatData]);

  const chats = useMemo(
    () => chatData?.chats || getChatList(),
    [chatData, getChatList]
  );
  useEffect(() => {
    chats.forEach((chat) => {
      queryClient.prefetchInfiniteQuery({
        queryKey: ["messages", chat.chat_id],
        queryFn: async ({ pageParam = 1 }) => {
          const messagesData = await getChatMessages({
            pageParam,
            chatId: chat.chat_id,
          });
          if (messagesData?.messages) {
            updateChatMessages(chat.chat_id, messagesData.messages);
          }
          return messagesData;
        },
        initialPageParam: 1,
      });
    });
  }, [chats]);
  return {
    chats,
    refetch: refetchChats,
    loading: loadingChats,
    refreshing: refreshingChats,
  };
}
