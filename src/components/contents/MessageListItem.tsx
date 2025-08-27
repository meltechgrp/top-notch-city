import React from "react";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
  Pressable,
  Text,
  View,
} from "../ui";
import { cn, formatMessageTime, fullName } from "@/lib/utils";
import { useRouter } from "expo-router";
import { generateMediaUrlSingle } from "@/lib/api";
import { useStore } from "@/store";
import SwipeableWrapper from "@/components/shared/SwipeableWrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChat } from "@/actions/message";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { MessageStatusIcon } from "@/components/chat/MessageStatus";
import { useMessages } from "@/hooks/useMessages";

type MessageListItemProps = {
  chat: Chat;
};
export function MessageListItem(props: MessageListItemProps) {
  const { chat } = props;
  const { message } = useMessages(chat.chat_id);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { me } = useStore();
  const { mutateAsync } = useMutation({
    mutationFn: deleteChat,
  });
  const unreadCount = React.useMemo(() => {
    const c = chat?.unread_count || 0;
    return c > 99 ? "99+" : c;
  }, [chat]);

  const isMine = React.useMemo(
    () => message?.sender_info.id === me?.id,
    [me, message]
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
    <SwipeableWrapper leftAction={handleDelete}>
      <Pressable
        onPress={() => {
          router.push({
            pathname: "/(protected)/messages/[chatId]",
            params: {
              chatId: chat.chat_id,
            },
          });
        }}
        className=" h-[70px] flex-1 bg-background"
        android_ripple={{ color: "#d5d4d5" }}
      >
        <View className=" h-full w-full px-4">
          <View className="w-full h-full border-b border-outline  flex-row items-center">
            <View className="h-[60px] gap-4 w-full flex-row items-center">
              <Avatar className="bg-gray-500 w-12 h-12">
                <AvatarFallbackText className="text-typography text-xl">
                  {fullName(chat.receiver)}
                </AvatarFallbackText>
                {chat.receiver.status == "online" && <AvatarBadge />}
                {chat.receiver.profile_image && (
                  <AvatarImage
                    source={{
                      uri: generateMediaUrlSingle(chat.receiver.profile_image),
                    }}
                  />
                )}
              </Avatar>
              <View className="flex-1 gap-1">
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1  pr-4">
                    <Text numberOfLines={1} className=" text-base">
                      {fullName(chat.receiver)}
                    </Text>
                  </View>
                  <Text className="text-typography/60 text-xs">
                    {formatedTime}
                  </Text>
                </View>
                {message && (
                  <View className="flex flex-row gap-4 w-full">
                    <View className="flex-1 flex-row gap-2 items-center overflow-hidden">
                      {isMine && <MessageStatusIcon status={message?.status} />}
                      <Text
                        className="text-typography/60 text-sm"
                        ellipsizeMode="tail"
                        numberOfLines={1}
                      >
                        {message?.content
                          ? message.content
                          : message?.file_data?.length
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
                          <Text className="text-white text-xs">
                            {unreadCount}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </SwipeableWrapper>
  );
}
