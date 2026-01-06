import React from "react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  Icon,
  Image,
  Pressable,
  Text,
  View,
} from "../ui";
import { cn, formatMessageTime, fullName } from "@/lib/utils";
import { generateMediaUrlSingle } from "@/lib/api";
import SwipeableWrapper from "@/components/shared/SwipeableWrapper";
import { deleteChat } from "@/components/chat";
import { MessageStatusIcon } from "@/components/chat/MessageStatus";
import { router } from "expo-router";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { useMe } from "@/hooks/useMe";
import { ImageIcon, MoreHorizontal, Trash } from "lucide-react-native";
import { Chat } from "@/db/models/messages";
import { withObservables } from "@nozbe/watermelondb/react";
import { User } from "@/db/models/users";
import { tempStore } from "@/store/tempStore";
import { use$ } from "@legendapp/state/react";
const LEAD = "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0";
type MessageListItemProps = {
  chat: Chat;
  receivers: User[];
};
function MessageListItem(props: MessageListItemProps) {
  const {
    chat,
    receivers: [user],
  } = props;

  const typing = use$(tempStore.getTyping(chat.server_chat_id));
  const { me } = useMe();
  const unreadCount = React.useMemo(() => {
    const c = chat?.unread_count || 0;
    return c > 99 ? "99+" : c;
  }, [chat]);

  const isMine = React.useMemo(
    () => chat?.recent_message_sender_id === me?.id,
    [me, chat]
  );
  const formatedTime = React.useMemo(
    () =>
      chat?.recent_message_created_at
        ? formatMessageTime(new Date(chat.recent_message_created_at), {
            hideTimeForFullDate: true,
          })
        : "",
    []
  );
  async function handleDelete() {
    console.log("base");
    await chat.softDeleteChat();
    await deleteChat(chat.server_chat_id);
  }
  const isImage = chat?.recent_message_content?.trim() == "image";
  return (
    <SwipeableWrapper
      rightActions={[
        {
          type: "danger",
          component: (
            <View className="bg-primary flex-1 items-center justify-center">
              <Icon as={Trash} className="text-white" />
              <Text className="text-white">Delete</Text>
            </View>
          ),
          onPress: handleDelete,
        },
      ]}
      leftActions={[
        {
          component: (
            <View className="bg-gray-600 flex-1 items-center justify-center">
              <Icon as={MoreHorizontal} className="text-white" />
              <Text className="text-white">More</Text>
            </View>
          ),
          onPress: () => {},
        },
      ]}
    >
      <Pressable
        onPress={() =>
          router.push({
            pathname: "/chats/[chatId]",
            params: {
              chatId: chat.server_chat_id,
            },
          })
        }
        className=" h-[70px] flex-1 bg-background"
      >
        <View className="flex-1 py-1 gap-4 pl-4 w-full flex-row">
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/agents/[userId]",
                params: {
                  userId: chat.server_user_id,
                },
              })
            }
            className="w-16 h-16 rounded-full overflow-hidden"
          >
            {user?.profile_image ? (
              <Image
                source={{
                  uri: generateMediaUrlSingle(user?.profile_image),
                  cacheKey: user?.profile_image,
                }}
                rounded
              />
            ) : (
              <Avatar className="bg-gray-500 w-16 h-16">
                <AvatarFallbackText className="text-typography text-xl">
                  {fullName(user)}
                </AvatarFallbackText>
                {user?.status == "online" ? <AvatarBadge /> : null}
              </Avatar>
            )}
          </Pressable>
          <View className="flex-1 pr-4 border-b border-outline">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1  pr-4">
                <Text numberOfLines={1} className=" text-base font-medium">
                  {fullName(user)}
                </Text>
              </View>
              <Text
                className={cn(
                  "text-typography/60 text-xs",
                  unreadCount && "text-primary"
                )}
              >
                {formatedTime}
              </Text>
            </View>
            {typing && <TypingIndicator />}
            {!typing && chat?.recent_message_content && (
              <View className="flex flex-row gap-4 w-full">
                <View className="relative flex-1 flex-row gap-1">
                  {isMine && chat?.recent_message_status && (
                    <View className="absolute left-0 top-px z-10">
                      <MessageStatusIcon status={chat.recent_message_status} />
                    </View>
                  )}

                  {isImage ? (
                    <View className="flex-row items-center gap-px">
                      <Text>{isMine ? LEAD : ""}</Text>
                      <Icon
                        size="sm"
                        as={ImageIcon}
                        className="text-gray-400"
                      />
                      <Text>Image</Text>
                    </View>
                  ) : (
                    <Text
                      className="text-typography/60 text-sm"
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {isMine && !isImage ? LEAD : ""}
                      {chat?.recent_message_content || "New message"}
                    </Text>
                  )}
                </View>
                <View className="flex-row w-8 items-center gap-1">
                  {!!unreadCount && (
                    <View
                      className={cn(
                        "flex-row items-center  h-[18px] bg-primary rounded-full justify-center ml-auto",
                        unreadCount === "99+" ? "w-[32px]" : "w-[20px]"
                      )}
                    >
                      <Text className="text-white text-xs">{unreadCount}</Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </SwipeableWrapper>
  );
}

const enhance = withObservables(["chat"], ({ chat }: { chat: Chat }) => ({
  chat: chat.observe(),
  receivers: chat.receivers,
}));

export default enhance(MessageListItem);
