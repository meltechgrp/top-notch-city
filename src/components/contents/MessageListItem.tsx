import React from "react";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Icon,
  Pressable,
  Text,
  View,
} from "../ui";
import { cn, formatMessageTime, fullName } from "@/lib/utils";
import { useRouter } from "expo-router";
import { Check, CheckCheck } from "lucide-react-native";
import { generateMediaUrlSingle } from "@/lib/api";
import { useStore } from "@/store";
import SwipeableWrapper from "@/components/shared/SwipeableWrapper";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteChat } from "@/actions/message";
import { showErrorAlert } from "@/components/custom/CustomNotification";

type MessageListItemProps = {
  chat: Chat;
};
export function MessageListItem(props: MessageListItemProps) {
  const { chat } = props;
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

  const isMine = React.useMemo(() => chat.sender_id === me?.id, [me, chat]);
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
                <View className="flex flex-row gap-2 w-full">
                  <View className="flex-1 flex-row items-center overflow-hidden">
                    {!chat.recent_message.read && isMine && (
                      <Icon
                        as={Check}
                        size="2xs"
                        className="ml-1 text-primary "
                      />
                    )}
                    {chat.recent_message.read && isMine && (
                      <Icon
                        as={CheckCheck}
                        size="2xs"
                        className="ml-1 text-primary"
                      />
                    )}
                    <Text
                      className="text-typography/60 text-sm"
                      ellipsizeMode="tail"
                      numberOfLines={1}
                    >
                      {chat?.recent_message?.content
                        ? chat.recent_message.content
                        : chat?.recent_message?.file_data?.length
                          ? "Media"
                          : ""}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
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
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </SwipeableWrapper>
  );
}
