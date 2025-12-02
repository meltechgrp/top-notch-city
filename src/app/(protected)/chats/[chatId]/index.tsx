import * as React from "react";

import { View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import ChatRoom from "@/components/chat/ChatRoom";
import { cn, formatMessageTime, fullName } from "@/lib/utils";
import { router, Stack, useLocalSearchParams } from "expo-router";
import Platforms from "@/constants/Plaforms";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
  AvatarImage,
  Box,
  Heading,
  Icon,
  Pressable,
  Text,
} from "@/components/ui";
import { generateMediaUrlSingle } from "@/lib/api";
import BackgroundView from "@/components/layouts/BackgroundView";
import { useChatStore } from "@/store/chatStore";
import { MoreHorizontal } from "lucide-react-native";

export default function ChatRoomScreen() {
  const { chatId } = useLocalSearchParams<{
    chatId: string;
  }>();
  const { getReceiver } = useChatStore();
  const receiver = getReceiver(chatId);
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
                    userId: receiver?.id!,
                  },
                })
              }
              className="flex-1 flex-row gap-4 ml-4 justify-start items-center"
            >
              <Avatar className="bg-gray-500 w-10 h-10">
                <AvatarFallbackText className="text-typography text-xl">
                  {fullName(receiver)}
                </AvatarFallbackText>
                {receiver?.profile_image && (
                  <AvatarImage
                    source={{
                      uri: generateMediaUrlSingle(receiver.profile_image),
                    }}
                  />
                )}
                {receiver?.status == "online" && <AvatarBadge />}
              </Avatar>
              <View>
                <Heading size="lg" numberOfLines={1} className="">
                  {fullName(receiver)}
                </Heading>
                {receiver?.status == "online" ? (
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
          headerRight: () => (
            <View className="px-4 flex-row gap-6">
              <Pressable onPress={() => router.push("/(protected)/settings")}>
                <Icon as={MoreHorizontal} className="w-6 h-6" />
              </Pressable>
            </View>
          ),
        }}
      />
      <BackgroundView className="flex-1 ">
        <SafeAreaView
          edges={["bottom"]}
          className="bg-background"
          style={{ flex: 1 }}
        >
          <View className="flex-1">
            <KeyboardAvoidingView
              style={{
                flex: 1,
                // maxHeight: 600,
              }}
              behavior={"padding"}
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
