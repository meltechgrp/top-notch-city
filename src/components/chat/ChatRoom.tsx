import * as React from "react";
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
} from "react-native";
// import ChatRoomFooter from '@/components/chat/ChatRoomFooter'
// import ChatRoomMessage from '@/components/chat/ChatRoomMessage'
import { useChatStore, useStore } from "@/store";
// import { MockedMessage } from '@/components/chat/types'
import debounce from "lodash-es/debounce";
// import { MessageStatus } from '@/graphql-types/index.gql'
// import useChatMessages from '@/components/chat/useChatMessages'
// import useMakeMessageDeliveredAndRead from '@/components/chat/useMakeMessageReadAndDelivered'
import { router, useFocusEffect } from "expo-router";
// import MediaViewerScreen from '@/components/contents/MediaViewerScreen'
import useMessageActions from "@/components/chat/useMessageActions";
// import MessageActionsBottomSheet from '@/components/chat/MessageActionsBottomSheet'
import { cn } from "@/lib/utils";
// import EditOverlay from '@/components/chat/EditOverlay'
// import { EditorComponentRefHandle } from '@/components/form/Editor'
// import useClearChatPushNotification from '@/components/chat/useClearChatPushNotification'
// import useSuppressChatPushNotification from '@/components/chat/useSuppressChatPushNotification'
import eventBus from "@/lib/eventBus";
import { Text } from "../ui";
import ChatRoomMessage from "./ChatRoomMessage";
import ChatRoomFooter from "./ChatRoomFooter";
import EditOverlay from "./EditOverlay";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getChatMessages, sendMessage } from "@/actions/message";
import { ImagePickerAsset } from "expo-image-picker";

/**
 * @note
 * All offsets are relative to the bottom of the FlatList container
 * (except otherwise implied by the binding name) because the Flatlist is inverted
 */

const InitialNumToRender = 30;
type Props = {
  chatId: string;
  ChatRoomFooterProps?: any;
  forceUpdate?: "true";
};
export default function ChatRoom(props: Props) {
  const { ChatRoomFooterProps = {}, chatId, forceUpdate } = props;
  const queryClient = useQueryClient();
  const {
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isLoading,
    isFetchingNextPage,
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
  });
  const { mutateAsync, isPending } = useMutation({
    mutationFn: sendMessage,
  });
  const { updateReceiver, updateSender } = useChatStore();
  const [refreshing, setRefreshing] = React.useState(false);
  const me = useStore((s) => s.me);
  const messages = React.useMemo(
    () => data?.pages.flatMap((item) => item.messages) || [],
    [data?.pages]
  );
  const sender = React.useMemo(
    () => data?.pages.flatMap((item) => item.sender_info)[0] || null,
    [data?.pages]
  );
  const receiver = React.useMemo(
    () => data?.pages.flatMap((item) => item.receiver_info)[0] || null,
    [data?.pages]
  );
  const layouts = React.useRef<{
    [key: string]: { width: number; height: number };
  }>({});
  const listRef = React.useRef<FlatList<Message> | null>(null);
  React.useEffect(() => {
    if (receiver) {
      updateReceiver(receiver);
    }
    if (sender) {
      updateSender(sender);
    }
  }, [sender, receiver, me]);
  // useClearChatPushNotification(chatId)
  // useSuppressChatPushNotification(chatId)

  // React.useEffect(() => {
  //   if (isCompositeId(chatId) && chat?.id) {
  //     setChatId(chat?.id)
  //   }
  // }, [chatId, chat])

  // make last received message delivered and read in chatroom
  // React.useEffect(() => {
  //   // don't mark read if split chat tab isn't active
  //   if (inTab && !isTabActive) return

  //   if (messages?.length) {
  //     const latestMessage = messages[0]
  //     const latestMessageId = latestMessage.id

  //     if (
  //       latestMessage.status === MessageStatus.Sent &&
  //       latestMessage.sender?.id !== me?.id
  //     ) {
  //       makeMessageReadAndDelivered({
  //         messageId: latestMessageId,
  //         chatId,
  //       })
  //     }
  //   }
  // }, [messages, chatId, inTab, isTabActive])

  const [listContainerHeight, setListContainerHeight] = React.useState(0);

  const getOffset = React.useCallback(
    (index: number) => {
      return Object.keys(layouts.current).reduce((acc, cur) => {
        if (+cur <= index) {
          return acc + layouts.current[cur].height;
        }
        return acc;
      }, 0);
    },
    [layouts]
  );

  function watchScroll(ev: NativeSyntheticEvent<NativeScrollEvent>) {
    if (messages.length >= InitialNumToRender) {
      const { y } = ev.nativeEvent.contentOffset;
      const earliestMessageOffset = getOffset(messages.length - 1);
      const scrollOffsetFromTop =
        earliestMessageOffset - (y + listContainerHeight);

      if (scrollOffsetFromTop < 200 && !refreshing) {
        // ! This causes the component to freeze until the refresh is complete.
        // ! This is because we are updating the `refreshing` state in the `onRefresh` function and also accessing it here (afaik)
      }
    }
  }

  // onScroll
  const onScroll = React.useCallback(debounce(watchScroll, 100), [
    messages,
    refreshing,
    listContainerHeight,
  ]);

  const scrollToBottom = () => {
    listRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  function onRefreshChat() {
    refetch();
  }

  const {
    activeQuoteMessage,
    handleMessageLongPress,
    selectedMessage,
    setActiveQuoteMessage,
    showMessageActionsModal,
    handleReply,
    setShowMessageActionsModal,
    handleDelete,
    isDeletingMessageId,
    isEditing,
    exitEditMode,
    handleEdit,
  } = useMessageActions({ focusEditor, setEditorText });
  const editorRef = React.useRef<any>(null);
  function focusEditor() {
    editorRef.current?.focus && editorRef.current?.focus();
  }
  function setEditorText(text: string) {
    editorRef.current?.setText(text);
  }
  const renderItem: ListRenderItem<any> = React.useCallback(
    ({ item, index }) => {
      return (
        <ChatRoomMessage
          key={item.id}
          sender={sender}
          me={me!}
          message={item}
          className={cn(index === messages.length - 1 ? "mt-4" : "")}
          onLongPress={handleMessageLongPress}
          isDeleting={isDeletingMessageId === item.id}
        />
      );
    },
    [messages, isDeletingMessageId]
  );
  async function handleSendMessage({
    text,
    files,
  }: {
    text: string;
    files: ImagePickerAsset[];
  }) {
    await mutateAsync(
      {
        chat_id: chatId,
        content: text,
        files,
      },
      {
        onError: (e) => {
          console.log("err", e);
        },
        onSuccess: (d) => {
          console.log("msg", d);
          queryClient.invalidateQueries({
            queryKey: ["messages", chatId],
          });
        },
      }
    );
  }

  React.useEffect(() => {
    console.log("refreshing chat");
    eventBus.addEventListener("REFRESH_CHAT", refetch);

    return () => {
      eventBus.removeEventListener("REFRESH_CHAT", refetch);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (forceUpdate) {
        refetch();
      }
    }, [])
  );

  return (
    <View className="flex-1 w-full">
      <View className="flex-1 w-full">
        <FlatList
          scrollEnabled={refreshing ? false : true}
          keyboardShouldPersistTaps="handled"
          ref={(r) => (listRef.current = r)}
          keyExtractor={(item) => item.message_id}
          contentContainerStyle={{
            justifyContent: "flex-end",
            flexGrow: 1,
            paddingBottom: 10,
          }}
          renderItem={renderItem}
          data={messages}
          initialNumToRender={InitialNumToRender}
          onScroll={(ev) => {
            ev.persist();
            onScroll(ev);
          }}
          inverted
          ListFooterComponent={
            <View className="w-full">
              {refreshing && (
                <View className="  justify-center items-center w-full z-50">
                  <ActivityIndicator
                    size="large"
                    className="text-primary-900"
                  />
                </View>
              )}
            </View>
          }
          onLayout={(e) => {
            const { height } = e.nativeEvent.layout;
            setListContainerHeight(height);
          }}
        />
        {(isLoading || isFetching) && !messages.length ? (
          <View className="h-full justify-center items-center w-full z-50">
            <ActivityIndicator size="large" className="text-primary-900" />
            <Text className="text-gray-700 text-sm mt-2">
              Loading messages...
            </Text>
          </View>
        ) : null}
        {!messages.length && <EmptyScreen message={"This space is empty"} />}
        {/* <EditOverlay
          visible={isEditing}
          onDismiss={() => exitEditMode()}
          activeMessage={selectedMessage}
        /> */}
      </View>
      <ChatRoomFooter
        onUpdate={onRefreshChat}
        chatId={chatId}
        onPost={(data, isEdit) => {
          handleSendMessage(data);
          // exitEditMode();
          // if (!isEdit) {
          //   scrollToBottom();
          // }
        }}
        activeQuoteMsg={activeQuoteMessage}
        clearActiveQuoteMsg={() => {
          setActiveQuoteMessage(undefined);
        }}
        ref={editorRef}
        isEditing={isEditing}
        selectedMessage={selectedMessage}
        {...ChatRoomFooterProps}
        className="pb-0 bg-background-info border-t border-outline"
      />
      {/* <MessageActionsBottomSheet
        visible={showMessageActionsModal}
        onDismiss={() => setShowMessageActionsModal(false)}
        handleReply={handleReply}
        handleDelete={() =>
          handleDelete((message) => {
            updateStoreAndCacheAfterDelete({
              chatId: message.chat?.id!,
              messageId: message.id,
            })
          })
        }
        handleEdit={handleEdit}
        message={selectedMessage}
      /> */}
      {/* <MediaViewerScreen /> */}
    </View>
  );
}

function EmptyScreen({ message }: { message?: string }) {
  return (
    <View className="flex-row justify-center items-center flex-1">
      <Text>{message ?? "Be the first to say hi!"}</Text>
    </View>
  );
}
