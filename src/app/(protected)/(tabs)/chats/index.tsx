import MessageListItem from "@/components/contents/MessageListItem";
import SmartphoneChatIcon from "@/components/icons/SmartphoneChatIcon";
import EmptyStateWrapper from "@/components/shared/EmptyStateWrapper";
import { Box, Icon, Pressable, View } from "@/components/ui";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useEffect } from "react";
import { RefreshControl } from "react-native";
import { useChat } from "@/hooks/useChat";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useIsFocused } from "@react-navigation/native";
import { router, Stack } from "expo-router";
import { MoreHorizontal, Plus, Search } from "lucide-react-native";

export default function MessagesScreen() {
  const isFocused = useIsFocused();
  const { chats, loading, refreshing, refetch } = useChat();

  useRefreshOnFocus(refetch);
  useEffect(() => {
    if (isFocused) {
      setTimeout(refetch, 500);
    }
  }, [isFocused]);
  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () => (
            <View className="px-4 flex-row gap-6">
              <Pressable onPress={() => {}}>
                <Icon as={Plus} className="w-6 h-6" />
              </Pressable>
            </View>
          ),
          headerRight: () => (
            <View className="px-4 flex-row gap-6">
              <Pressable onPress={() => router.push("/(protected)/explore")}>
                <Icon as={Search} className="w-6 h-6" />
              </Pressable>
              <Pressable onPress={() => router.push("/(protected)/settings")}>
                <Icon as={MoreHorizontal} className="w-6 h-6" />
              </Pressable>
            </View>
          ),
        }}
      />
      <Box className="flex-1">
        <EmptyStateWrapper
          loading={loading}
          isEmpty={!chats || chats?.length < 1}
          illustration={<SmartphoneChatIcon className="relative left-4" />}
          text="You don't have any message in your inbox"
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={refetch} />
          }
        >
          <View className="flex-1">
            <FlashList
              data={chats}
              refreshControl={
                <RefreshControl refreshing={false} onRefresh={refetch} />
              }
              ListFooterComponent={<View className="h-16"></View>}
              contentContainerClassName="pt-4"
              keyExtractor={(item) => item.chat_id}
              renderItem={({ item }) => <MessageListItem chat={item} />}
            />
          </View>
        </EmptyStateWrapper>
      </Box>
    </>
  );
}
