import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "@/store/chatStore";
import { getChatMessages, getChats } from "@/actions/message";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store";

export function useChat() {
  const {
    updateChatList,
    getMessages,
    updateChatListDetails,
    updateChatMessages,
    getChatList,
  } = useChatStore.getState();
  const me = useStore((s) => s?.me);

  const queryClient = useQueryClient();
  const {
    data: chatData,
    refetch: refetchChats,
    isLoading: loadingChats,
    isFetching: refreshingChats,
  } = useQuery({
    queryKey: ["chats"],
    queryFn: getChats,
    enabled: !!me,
  });

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

  const chats = useChatStore(useShallow((s) => s.getChatList()));
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
    chats: me ? chats : [],
    refetch: refetchChats,
    loading: me ? loadingChats : false,
    refreshing: refreshingChats,
    updateChatListDetails,
    me,
  };
}
