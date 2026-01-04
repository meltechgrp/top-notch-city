import * as React from "react";
import { Animated, View, ViewToken } from "react-native";
import useMessageActions from "@/components/chat/useMessageActions";
import { cn, formatMessageTime, fullName } from "@/lib/utils";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
  Heading,
  Image,
  Pressable,
  Text,
} from "../ui";
import ChatRoomMessage from "./ChatRoomMessage";
import ChatRoomFooter from "./ChatRoomFooter";
import { format, isToday, isYesterday } from "date-fns";
import MessageActionsBottomSheet from "@/components/chat/MessageActionsBottomSheet";
import BackgroundView from "@/components/layouts/BackgroundView";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { useMe } from "@/hooks/useMe";
import { router, Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import MessageListHeader from "@/components/chat/MessageListHeader";
import { withObservables } from "@nozbe/watermelondb/react";
import { Chat, Message } from "@/db/models/messages";
import { User } from "@/db/models/users";
import { generateMediaUrlSingle } from "@/lib/api";
import { messageCollection } from "@/db/collections";
import { Q } from "@nozbe/watermelondb";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { makeMessageReadAndDelivered } from "@/actions/message";
import { useMessagesSync } from "@/db/queries/syncMessages";
import { use$ } from "@legendapp/state/react";
import { tempStore } from "@/store/tempStore";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";

type Props = {
  chat: Chat;
  messages: Message[];
  receivers: User[];
  ChatRoomFooterProps?: any;
};
function ChatRoom(props: Props) {
  const {
    ChatRoomFooterProps = {},
    chat,
    receivers: [receiver],
    messages,
  } = props;

  useMessagesSync({
    auto: chat.unread_count > 0 || messages?.length < 1,
    chatId: chat.server_chat_id,
  });
  const { me } = useMe();
  const { isInternetReachable, isOffline } = useNetworkStatus();
  const [currentTitle, setCurrentTitle] = React.useState("");
  const listRef = React.useRef<FlashListRef<Message> | null>(null);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;
  const scrollToBottom = () => {
    listRef.current?.scrollToEnd({ animated: true });
  };

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
  } = useMessageActions({
    focusEditor,
    setEditorText,
    chatId: chat.server_chat_id,
  });
  const editorRef = React.useRef<any>(null);
  function focusEditor() {
    editorRef.current?.focus && editorRef.current?.focus();
  }
  function setEditorText(text: string) {
    editorRef.current?.setText(text);
  }
  const RenderItem = React.useCallback(
    ({ item, index }: { item: Message; index: number }) => {
      return (
        <ChatRoomMessage
          key={item.server_message_id}
          me={me!}
          message={item}
          className={cn(index === messages?.length - 1 ? "mt-4" : "")}
          onLongPress={handleMessageLongPress}
          isDeleting={isDeletingMessageId === item.server_message_id}
        />
      );
    },
    [isDeletingMessageId, me, handleMessageLongPress, messages.length]
  );
  const changeTitle = (newTitle: string) => {
    if (newTitle === currentTitle) return;
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setCurrentTitle(newTitle);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };
  const onViewableItemsChanged = React.useRef(
    ({ viewableItems }: { viewableItems: ViewToken<Message>[] }) => {
      if (viewableItems?.length > 0) {
        const createdAt = new Date(viewableItems[0].item.created_at);
        let title = format(createdAt, "MMM d, yyyy");
        if (isToday(createdAt)) title = "Today";
        else if (isYesterday(createdAt)) title = "Yesterday";
        changeTitle(title);
      }
    }
  );

  const typing = use$(tempStore.getTyping(chat.server_chat_id));
  React.useEffect(() => {
    if (me && chat?.unread_count > 0) {
      makeMessageReadAndDelivered({ chatId: chat.server_chat_id });
    }
  }, [chat?.unread_count, me]);
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "/agents/[userId]",
                  params: {
                    userId: receiver?.server_user_id!,
                  },
                })
              }
              className="flex-1 ml-4 flex-row gap-4 justify-start items-center"
            >
              {receiver?.profile_image ? (
                <View className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    source={{
                      uri: generateMediaUrlSingle(receiver?.profile_image),
                      cacheKey: receiver?.profile_image,
                    }}
                    rounded
                  />
                </View>
              ) : (
                <Avatar className="bg-gray-500 w-12 h-12">
                  <AvatarFallbackText className="text-typography text-xl">
                    {fullName(receiver)}
                  </AvatarFallbackText>
                  {receiver?.profile_image && (
                    <AvatarImage
                      source={{
                        uri: generateMediaUrlSingle(receiver?.profile_image),
                        cache: "force-cache",
                      }}
                    />
                  )}
                  {receiver?.status == "online" ? <AvatarBadge /> : null}
                </Avatar>
              )}
              <View>
                <Heading size="lg" numberOfLines={1} className="">
                  {fullName(receiver)}
                </Heading>
                {!isInternetReachable || isOffline ? (
                  <View className="flex-row items-center -mt-1 gap-2">
                    <SpinningLoader size={16} />
                    <Text className="sm">
                      {isOffline
                        ? "Waiting for network"
                        : !isInternetReachable
                          ? "Connecting..."
                          : ""}
                    </Text>
                  </View>
                ) : receiver?.status == "online" ? (
                  <Text className=" text-xs text-gray-500">Online</Text>
                ) : (
                  <Text className=" text-xs text-gray-500">
                    Last seen:{" "}
                    {receiver?.last_seen
                      ? formatMessageTime(new Date(receiver?.last_seen))
                      : ""}
                  </Text>
                )}
              </View>
            </Pressable>
          ),
        }}
      />
      <BackgroundView className="flex-1 w-full">
        <Animated.View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [10, 0],
                }),
              },
            ],
          }}
        >
          <Text className="text-center text-sm self-center mt-6 bg-background-muted p-1 px-2 rounded-full">
            {currentTitle}
          </Text>
        </Animated.View>

        <View className="flex-1 w-full">
          <FlashList
            keyboardShouldPersistTaps="handled"
            ref={listRef}
            contentInsetAdjustmentBehavior={"automatic"}
            keyExtractor={(item) => item.server_message_id}
            contentContainerStyle={{
              paddingBottom: 10,
            }}
            maintainVisibleContentPosition={{
              startRenderingFromBottom: true,
            }}
            renderItem={RenderItem}
            data={messages}
            onViewableItemsChanged={onViewableItemsChanged.current}
            scrollEventThrottle={16}
            ListHeaderComponent={() => (
              <MessageListHeader receiver={receiver} />
            )}
          />
        </View>
        {typing && (
          <View style={{ padding: 10 }}>
            <TypingIndicator />
          </View>
        )}

        <SafeAreaView edges={["bottom"]} className="bg-background">
          <ChatRoomFooter
            chatId={chat.server_chat_id}
            onPost={(isEdit) => {
              exitEditMode();
              if (!isEdit) {
                scrollToBottom();
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
            className=""
          />
        </SafeAreaView>
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
    </>
  );
}

const enhance = withObservables(["chat"], ({ chat }: { chat: Chat }) => ({
  chat: chat,
  receivers: chat.receivers.observe(),
  messages: messageCollection
    .query(Q.where("server_chat_id", chat.server_chat_id))
    .observe(),
}));

export default enhance(ChatRoom);
