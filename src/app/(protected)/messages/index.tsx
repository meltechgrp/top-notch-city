import MessageListItem from "@/components/contents/MessageListItem";
import SmartphoneChatIcon from "@/components/icons/SmartphoneChatIcon";
import EmptyStateWrapper from "@/components/shared/EmptyStateWrapper";
import { Box, View } from "@/components/ui";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect } from "react";
import { RefreshControl } from "react-native";
import { useChat } from "@/hooks/useChat";
import { AppState } from "react-native";

export default function MessagesScreen() {
  const { chats, loading, refreshing, refetch } = useChat();

  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      refetch();
    });
    return () => sub.remove();
  }, []);
  return (
    <>
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
