import React, { memo } from "react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
  Icon,
  Pressable,
  Text,
  View,
} from "../ui";
import { cn, formatMessageTime, fullName } from "@/lib/utils";
import { generateMediaUrlSingle } from "@/lib/api";
import SwipeableWrapper from "@/components/shared/SwipeableWrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChat } from "@/actions/message";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { MessageStatusIcon } from "@/components/chat/MessageStatus";
import { router } from "expo-router";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { useMe } from "@/hooks/useMe";
import { ProfileImageTrigger } from "@/components/custom/ImageViewerProvider";
import { MoreHorizontal, Trash } from "lucide-react-native";

type MessageListItemProps = {
  chat: Chat;
};
function MessageListItem(props: MessageListItemProps) {
  const { chat } = props;

  const typing = false;
  const queryClient = useQueryClient();
  const { me } = useMe();
  const { mutateAsync } = useMutation({
    mutationFn: deleteChat,
  });
  const unreadCount = React.useMemo(() => {
    const c = chat?.unread_count || 0;
    return c > 99 ? "99+" : c;
  }, [chat]);

  const isMine = React.useMemo(
    () => chat?.recent_message.sender_id === me?.id,
    [me, chat]
  );
  const formatedTime = React.useMemo(
    () =>
      chat
        ? formatMessageTime(new Date(chat.recent_message.created_at), {
            hideTimeForFullDate: true,
          })
        : "",
    []
  );
  async function handleDelete() {
    await mutateAsync(chat.chat_id, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["chats"],
        });
        showErrorAlert({
          title: "Chat deleted successfully!",
          alertType: "success",
        });
      },
      onError: () => {
        showErrorAlert({
          title: "Something went wrong. Try again!",
          alertType: "error",
        });
      },
    });
  }
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
              chatId: chat.chat_id,
              userId: chat.receiver.id,
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
                  userId: chat.sender_id,
                },
              })
            }
          >
            <Avatar className="bg-gray-500 w-16 h-16">
              <AvatarFallbackText className="text-typography text-xl">
                {fullName(chat.receiver)}
              </AvatarFallbackText>
              {chat.receiver.status == "online" && <AvatarBadge />}
              {chat.receiver.profile_image && (
                <AvatarImage
                  source={{
                    uri: generateMediaUrlSingle(chat.receiver.profile_image),
                    cache: "force-cache",
                  }}
                />
              )}
            </Avatar>
          </Pressable>
          <View className="flex-1 pr-4 border-b border-outline">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1  pr-4">
                <Text numberOfLines={1} className=" text-base font-medium">
                  {fullName(chat.receiver)}
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
            {!typing && chat?.recent_message && (
              <View className="flex flex-row gap-4 w-full">
                <View className="flex-1 flex-row gap-2 items-center overflow-hidden">
                  {isMine && (
                    <MessageStatusIcon status={chat?.recent_message?.status} />
                  )}
                  <Text
                    className="text-typography/60 text-sm"
                    ellipsizeMode="tail"
                    numberOfLines={2}
                  >
                    {chat?.recent_message?.content
                      ? chat?.recent_message.content
                      : chat?.recent_message?.file_data?.length
                        ? "Media"
                        : ""}
                  </Text>
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

export default memo(MessageListItem);
