import MessageListItem from "@/components/chat/MessageListItem";
import { Box, View } from "@/components/ui";
import { FlashList } from "@shopify/flash-list";
import React, { memo, useEffect, useMemo, useState } from "react";
import { RefreshControl } from "react-native";
import { useChat } from "@/hooks/useChat";
import { Users } from "lucide-react-native";
import ChatsStateWrapper from "@/components/chat/ChatsStateWrapper";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { useWebSocketHandler } from "@/hooks/useWebSocketHandler";
import { useMe } from "@/hooks/useMe";
import eventBus from "@/lib/eventBus";

function ChatList() {
  const { chats, loading, refreshing, refetch } = useChat();
  const { me, isLoading } = useMe();
  const { connect } = useWebSocketHandler();
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    let filtered = chats;

    if (search.trim() !== "") {
      const regex = new RegExp(search.trim(), "i");
      filtered = filtered.filter(
        (u) =>
          regex.test(u.receiver.first_name) ||
          regex.test(u.receiver.last_name) ||
          regex.test(u.recent_message.content)
      );
    }
    return filtered;
  }, [chats, search]);
  useEffect(() => {
    connect();
  }, []);
  console.log(me);
  return (
    <>
      <Box className="flex-1 mt-2">
        <ChatsStateWrapper loading={loading || isLoading}>
          <View className="flex-1">
            <FlashList
              data={filteredData}
              refreshControl={
                <RefreshControl refreshing={false} onRefresh={refetch} />
              }
              ListFooterComponent={<View className="h-16"></View>}
              contentContainerClassName="pt-2"
              keyExtractor={(item) => item.chat_id}
              renderItem={({ item }) => <MessageListItem chat={item} />}
              onScroll={() => eventBus.dispatchEvent("SWIPEABLE_OPEN", null)}
              ListEmptyComponent={() => (
                <MiniEmptyState
                  icon={Users}
                  className="mt-8"
                  title="No message Found"
                  description="Clear search to see other messages"
                  onPress={() => {
                    setSearch("");
                    refetch();
                  }}
                  buttonLabel="Refresh"
                />
              )}
            />
          </View>
        </ChatsStateWrapper>
      </Box>
    </>
  );
}

export default memo(ChatList);
