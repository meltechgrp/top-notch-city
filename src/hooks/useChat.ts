import { useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useChatStore } from "@/store/chatStore";
import { getChatMessages, getChats } from "@/actions/message";

export function useChat() {
  const {
    updateChatList,
    getMessages,
    updateChatListDetails,
    updateChatMessages,
    getChatList,
  } = useChatStore.getState();

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
  return {
    chats,
    refetch: refetchChats,
    loading: loadingChats,
    refreshing: refreshingChats,
    updateChatListDetails,
  };
}
