import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getChats } from "@/actions/message";
import { useMe } from "@/hooks/useMe";

export function useChat() {
  // const { updateChatList, getMessages, updateChatListDetails } =
  //   useChatStore.getState();
  const { me } = useMe();
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
        messages: [],
        typing: false,
      }));
      // updateChatList(chats);
    }
  }, [chatData]);

  // const chats = useChatStore(useShallow((s) => s.getChatList()));
  return {
    chats: [],
    refetch: refetchChats,
    loading: me ? loadingChats : false,
    refreshing: refreshingChats,
    updateChatListDetails: () => {},
    me,
  };
}
