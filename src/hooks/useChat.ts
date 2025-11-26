import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useChatStore } from "@/store/chatStore";
import { getChats } from "@/actions/message";
import { useShallow } from "zustand/react/shallow";
import { useStore } from "@/store";

export function useChat() {
  const { updateChatList, getMessages, updateChatListDetails } =
    useChatStore.getState();
  const me = useStore((s) => s?.me);
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
  return {
    chats: me ? chats : [],
    refetch: refetchChats,
    loading: me ? loadingChats : false,
    refreshing: refreshingChats,
    updateChatListDetails,
    me,
  };
}
