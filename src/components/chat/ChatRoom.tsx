import * as React from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SectionList,
  View,
  ViewToken,
} from "react-native";
import { useChatStore, useStore } from "@/store";
import debounce from "lodash-es/debounce";
import { router, useFocusEffect } from "expo-router";
// import MediaViewerScreen from "@/components/contents/MediaViewerScreen";
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
import {
  editMessage,
  getChatMessages,
  makeMessageReadAndDelivered,
  sendMessage,
} from "@/actions/message";
import { ImagePickerAsset } from "expo-image-picker";
import { format, isToday, isYesterday } from "date-fns";
import useSound from "@/hooks/useSound";
import useSuppressChatPushNotification from "@/components/chat/useSuppressChatPushNotification";
import MessageActionsBottomSheet from "@/components/chat/MessageActionsBottomSheet";

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
  const { playSound } = useSound();
  const queryClient = useQueryClient();
  const [currentTitle, setCurrentTitle] = React.useState("");
  const scrollY = React.useRef(new Animated.Value(0)).current;
  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: ["messages", chatId],
    });
  }
  const {
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetching: refreshing,
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
    networkMode: "online",
  });
  const messages = React.useMemo(
    () => data?.pages.flatMap((item) => item.messages) || [],
    [data?.pages]
  );
  const { mutateAsync } = useMutation({
    mutationFn: sendMessage,
  });
  const { mutateAsync: edit } = useMutation({
    mutationFn: editMessage,
  });
  const { mutate: markAsRead } = useMutation({
    mutationFn: makeMessageReadAndDelivered,
  });
  const { updateReceiver, updateSender } = useChatStore();

  const me = useStore((s) => s.me);
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

  React.useEffect(() => {
    if (messages?.length) {
      const latestMessage = messages[0];
      // if (!latestMessage.read) {
      markAsRead(
        {
          chatId,
        },
        {
          onSuccess: invalidate,
        }
      );
      // }
    }
  }, [messages, chatId]);

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
        hasNextPage && fetchNextPage();
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
  useSuppressChatPushNotification(chatId, false);
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
  } = useMessageActions({ focusEditor, setEditorText, chatId });
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
  async function handleSendMessage(
    {
      text,
      files,
      id,
    }: {
      text: string;
      files: ImagePickerAsset[];
      id?: string;
    },
    isEdit: boolean
  ) {
    if (isEdit) {
      await edit(
        {
          message_id: id!,
          content: text,
        },
        {
          onError: (e) => {
            console.log("err", e);
          },
          onSuccess: (d) => {
            invalidate();
            playSound("MESSAGE_SENT");
          },
        }
      );
    } else {
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
            invalidate();
            playSound("MESSAGE_SENT");
          },
        }
      );
    }
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

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const onViewableItemsChanged = React.useRef(
    ({ viewableItems }: { viewableItems: ViewToken<Message>[] }) => {
      if (viewableItems.length > 0) {
        const createdAt = new Date(viewableItems[0].item.created_at);
        let sectionTitle = format(createdAt, "MMM d, yyyy");
        if (isToday(createdAt)) {
          sectionTitle = "Today";
        } else if (isYesterday(createdAt)) {
          sectionTitle = "Yesterday";
        }

        setCurrentTitle(sectionTitle);
      }
    }
  );

  return (
    <View className="flex-1 w-full">
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          opacity: scrollY.interpolate({
            inputRange: [0, 50],
            outputRange: [0, 1],
            extrapolate: "clamp",
          }),
        }}
      >
        <Text className="text-center text-sm self-center mt-6 bg-background-muted p-1 px-2 rounded-full">
          {currentTitle}
        </Text>
      </Animated.View>

      <View className="flex-1 w-full">
        <Animated.FlatList
          scrollEnabled={refreshing ? false : true}
          keyboardShouldPersistTaps="handled"
          // ref={(r) => (listRef.current = r)}
          keyExtractor={(item) => item.message_id}
          contentContainerStyle={{
            justifyContent: "flex-end",
            flexGrow: 1,
            paddingBottom: 10,
          }}
          renderItem={renderItem}
          data={messages}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged.current}
          initialNumToRender={InitialNumToRender}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: true,
              listener: (ev) => {
                onScroll(
                  ev as unknown as NativeSyntheticEvent<NativeScrollEvent>
                );
              },
            }
          )}
          inverted
          scrollEventThrottle={16}
          // ListFooterComponent={
          //   <View className="w-full">
          //     {refreshing && (
          //       <View className="  justify-center items-center w-full z-50">
          //         <ActivityIndicator
          //           size="large"
          //           className="text-primary-900"
          //         />
          //       </View>
          //     )}
          //   </View>
          // }
          onLayout={(e) => {
            const { height } = e.nativeEvent.layout;
            setListContainerHeight(height);
          }}
        />
        {(isLoading || refreshing) && !messages.length ? (
          <View className="h-full justify-center items-center w-full z-50">
            <ActivityIndicator size="large" className="text-primary-900" />
            <Text className="text-gray-700 text-sm mt-2">
              Loading messages...
            </Text>
          </View>
        ) : null}
        {!messages.length && <EmptyScreen message={"This space is empty"} />}
      </View>
      <ChatRoomFooter
        onUpdate={onRefreshChat}
        chatId={chatId}
        onPost={(data, isEdit) => {
          handleSendMessage(data, isEdit);
          exitEditMode();
          if (!isEdit) {
            scrollToBottom();
          }
        }}
        activeQuoteMsg={activeQuoteMessage}
        clearActiveQuoteMsg={() => {
          setActiveQuoteMessage(undefined);
        }}
        ref={editorRef}
        isEditing={isEditing}
        selectedMessage={selectedMessage}
        {...ChatRoomFooterProps}
        className="pb-0 bg-background border-t border-outline"
      />
      <MessageActionsBottomSheet
        visible={showMessageActionsModal}
        onDismiss={() => setShowMessageActionsModal(false)}
        handleReply={handleReply}
        handleDelete={() => {
          handleDelete((message) => {
            // updateStoreAndCacheAfterDelete({
            //   chatId: message.chat?.id!,
            //   messageId: message.id,
            // });
          });
        }}
        handleEdit={handleEdit}
        message={selectedMessage}
      />
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
