import * as React from "react";

import { KeyboardAvoidingView, View } from "react-native";

import ChatRoom from "@/components/chat/ChatRoom";
import { fullName } from "@/lib/utils";
import { useLocalSearchParams } from "expo-router";
import Platforms from "@/constants/Plaforms";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomScreenHeader from "@/components/layouts/CustomScreenHeader";
import { useChatStore } from "@/store";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Heading,
} from "@/components/ui";
import { generateMediaUrlSingle } from "@/lib/api";

export default function ChatRoomScreen() {
  const { chatId } = useLocalSearchParams<{
    chatId: string;
  }>();
  const { receiver } = useChatStore();

  return (
    <>
      <Box className="flex-1 ">
        <SafeAreaView
          edges={["top", "bottom"]}
          className="bg-background"
          style={{ flex: 1 }}
        >
          <CustomScreenHeader
            headerCenterContent={
              <ScreenHeaderTitleSection receiver={receiver} />
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
      </Box>
    </>
  );
}

interface ScreenHeaderTitleSectionProps {
  receiver?: ChatMessages["receiver_info"];
}

function ScreenHeaderTitleSection({ receiver }: ScreenHeaderTitleSectionProps) {
  return (
    <View className="flex-1 flex-row gap-4 justify-start items-center">
      <Avatar className="bg-gray-500 w-10 h-10">
        <AvatarFallbackText className="text-typography text-xl">
          {fullName(receiver)}
        </AvatarFallbackText>
        {receiver?.profile_image && (
          <AvatarImage
            source={{ uri: generateMediaUrlSingle(receiver.profile_image) }}
          />
        )}
        <AvatarBadge />
      </Avatar>
      <Heading size="lg" numberOfLines={1} className="">
        {fullName(receiver)}
      </Heading>
    </View>
  );
}
