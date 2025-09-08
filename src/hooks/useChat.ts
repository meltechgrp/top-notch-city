import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "@/store/chatStore";
import { getChatMessages, getChats } from "@/actions/message";

export function useChat() {
  const { updateChatList, getMessages, updateChatMessages, getChatList } =
    useChatStore.getState();

  const queryClient = useQueryClient();
  const {
    data: chatData,
    refetch: refetchChats,
    isLoading: loadingChats,
    isFetching: refreshingChats,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
  });

  // Sync chat list into Zustand
  useEffect(() => {
    if (chatData) {
      const chats = chatData?.chats?.filter(Boolean).map((c) => ({
        details: c,
        messages: getMessages(c.chat_id),
        typing: false,
      }));
      updateChatList(chats);
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
