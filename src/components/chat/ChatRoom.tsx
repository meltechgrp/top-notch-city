import * as React from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  View,
  ViewToken,
} from "react-native";
import { useStore } from "@/store";
import debounce from "lodash-es/debounce";
import useMessageActions from "@/components/chat/useMessageActions";
import { cn } from "@/lib/utils";
import { Text } from "../ui";
import ChatRoomMessage from "./ChatRoomMessage";
import ChatRoomFooter from "./ChatRoomFooter";
import { format, isToday, isYesterday } from "date-fns";
import useSuppressChatPushNotification from "@/components/chat/useSuppressChatPushNotification";
import MessageActionsBottomSheet from "@/components/chat/MessageActionsBottomSheet";
import { useMessages } from "@/hooks/useMessages";
import BackgroundView from "@/components/layouts/BackgroundView";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { useWebSocketHandler } from "@/hooks/useWebSocketHandler";
import { useMe } from "@/hooks/useMe";

const InitialNumToRender = 30;
type Props = {
  chatId: string;
  ChatRoomFooterProps?: any;
};
export default function ChatRoom(props: Props) {
  const { ChatRoomFooterProps = {}, chatId } = props;
  const { me } = useMe();
  const { connect } = useWebSocketHandler();
  const {
    handleSendMessage,
    hasNextPage,
    fetchNextPage,
    receiver,
    sender,
    messages,
    refreshing,
    loading,
    typing,
    markAsRead,
  } = useMessages(chatId);
  const [currentTitle, setCurrentTitle] = React.useState("");
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const layouts = React.useRef<{
    [key: string]: { width: number; height: number };
  }>({});
  const listRef = React.useRef<FlatList<Message> | null>(null);

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

  // onScroll
  const onScroll = React.useMemo(
    () =>
      debounce((ev: NativeSyntheticEvent<NativeScrollEvent>) => {
        if (messages.length >= InitialNumToRender) {
          const { y } = ev.nativeEvent.contentOffset;
          const earliestMessageOffset = getOffset(messages.length - 1);
          const scrollOffsetFromTop =
            earliestMessageOffset - (y + listContainerHeight);

          if (scrollOffsetFromTop < 200 && !refreshing) {
            hasNextPage && fetchNextPage();
          }
        }
      }, 100),
    [messages.length, refreshing, listContainerHeight, getOffset]
  );

  const scrollToBottom = () => {
    listRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };
  useSuppressChatPushNotification(chatId, false);

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
    handleDeleteAll,
  } = useMessageActions({ focusEditor, setEditorText, chatId });
  const editorRef = React.useRef<any>(null);
  function focusEditor() {
    editorRef.current?.focus && editorRef.current?.focus();
  }
  function setEditorText(text: string) {
    editorRef.current?.setText(text);
  }
  const renderItem: ListRenderItem<Message> = React.useCallback(
    ({ item, index }) => {
      return (
        <ChatRoomMessage
          key={item.message_id}
          sender={sender}
          me={me!}
          message={item}
          className={cn(index === messages?.length - 1 ? "mt-4" : "")}
          onLongPress={handleMessageLongPress}
          isDeleting={isDeletingMessageId === item.message_id}
          resendMessage={(msg) => {
            handleSendMessage(msg, false);
          }}
        />
      );
    },
    [isDeletingMessageId, sender, me, handleMessageLongPress, messages.length]
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

  React.useEffect(() => {
    connect();
  }, []);
  React.useEffect(() => {
    if (chatId && messages?.length) {
      markAsRead({ chatId });
    }
  }, [messages.length, chatId, me]);
  return (
    <BackgroundView className="flex-1 w-full">
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
          ref={listRef}
          extraData={messages}
          keyExtractor={(item) => item.message_id}
          contentContainerStyle={{
            justifyContent: "flex-end",
            flexGrow: 1,
            paddingBottom: 10,
          }}
          renderItem={renderItem}
          data={messages.slice().reverse()}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged.current}
          initialNumToRender={InitialNumToRender}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: true,
              listener: (ev) => {
                ev.persist();
                onScroll(
                  ev as unknown as NativeSyntheticEvent<NativeScrollEvent>
                );
              },
            }
          )}
          inverted
          scrollEventThrottle={16}
          onLayout={(e) => {
            const { height } = e.nativeEvent.layout;
            setListContainerHeight(height);
          }}
        />
        {(loading || refreshing) && !messages?.length ? (
          <View className="h-full justify-center items-center w-full z-50">
            <ActivityIndicator size="large" className="text-primary-900" />
            <Text className="text-gray-700 text-sm mt-2">
              Loading messages...
            </Text>
          </View>
        ) : null}
        {!messages?.length && <EmptyScreen message={"This space is empty"} />}
      </View>
      {typing && (
        <View style={{ padding: 10 }}>
          <TypingIndicator />
        </View>
      )}
      <ChatRoomFooter
        chatId={chatId}
        onPost={(data, isEdit) => {
          handleSendMessage(data, isEdit);
          exitEditMode();
          if (!isEdit) {
            setTimeout(scrollToBottom, 100);
          }
        }}
        receiver={receiver}
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
        handleDelete={handleDelete}
        handleDeleteAll={handleDeleteAll}
        handleEdit={handleEdit}
        message={selectedMessage}
      />
    </BackgroundView>
  );
}

function EmptyScreen({ message }: { message?: string }) {
  return (
    <View className="flex-row justify-center items-center flex-1">
      <Text>{message ?? "Be the first to say hi!"}</Text>
    </View>
  );
}
