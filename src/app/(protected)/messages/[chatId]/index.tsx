import * as React from "react";

import { KeyboardAvoidingView, View } from "react-native";
import ChatRoom from "@/components/chat/ChatRoom";
import { cn, formatMessageTime, fullName } from "@/lib/utils";
import { router, useLocalSearchParams } from "expo-router";
import Platforms from "@/constants/Plaforms";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomScreenHeader from "@/components/layouts/CustomScreenHeader";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Heading,
  Pressable,
  Text,
} from "@/components/ui";
import { generateMediaUrlSingle } from "@/lib/api";
import BackgroundView from "@/components/layouts/BackgroundView";
import { useChatStore } from "@/store/chatStore";

export default function ChatRoomScreen() {
  const { chatId } = useLocalSearchParams<{
    chatId: string;
  }>();
  const { getReceiver } = useChatStore();
  return (
    <>
      <BackgroundView className="flex-1 ">
        <SafeAreaView
          edges={["top", "bottom"]}
          className="bg-background"
          style={{ flex: 1 }}
        >
          <CustomScreenHeader
            headerCenterContent={
              <ScreenHeaderTitleSection receiver={getReceiver(chatId)} />
            }
          />
          <View className="flex-1">
            <KeyboardAvoidingView
              className="flex-1"
              behavior={Platforms.isIOS() ? "padding" : "padding"}
              keyboardVerticalOffset={Platforms.isIOS() ? 100 : 80}
            >
              <ChatRoom
                chatId={chatId}
                ChatRoomFooterProps={{
                  placeholder: "Write a message",
                  defaultText: "",
                }}
              />
            </KeyboardAvoidingView>
          </View>
        </SafeAreaView>
      </BackgroundView>
    </>
  );
}

interface ScreenHeaderTitleSectionProps {
  receiver?: ReceiverInfo;
}

function ScreenHeaderTitleSection({ receiver }: ScreenHeaderTitleSectionProps) {
  if (!receiver) return;
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/profile/[user]",
          params: {
            user: receiver?.id!,
          },
        })
      }
      className="flex-1 flex-row gap-4 justify-start items-center"
    >
      <Avatar className="bg-gray-500 w-10 h-10">
        <AvatarFallbackText className="text-typography text-xl">
          {fullName(receiver)}
        </AvatarFallbackText>
        {receiver?.profile_image && (
          <AvatarImage
            source={{ uri: generateMediaUrlSingle(receiver.profile_image) }}
          />
        )}
        {receiver.status == "online" && <AvatarBadge />}
      </Avatar>
      <View>
        <Heading size="lg" numberOfLines={1} className="">
          {fullName(receiver)}
        </Heading>
        {receiver?.status == "online" ? (
          <Text className=" text-xs text-gray-500">Online</Text>
        ) : (
          <Text className=" text-xs text-gray-500">
            Last seen: {formatMessageTime(new Date(receiver?.last_seen))}
          </Text>
        )}
      </View>
    </Pressable>
  );
}
