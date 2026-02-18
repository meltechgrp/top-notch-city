import MessageListItem from "@/components/chat/MessageListItem";
import { Box, View } from "@/components/ui";
import { FlashList } from "@shopify/flash-list";
import { RefreshControl } from "react-native";
import { MessageSquare, Plus } from "lucide-react-native";
import ChatsStateWrapper from "@/components/chat/ChatsStateWrapper";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import eventBus from "@/lib/eventBus";
import { withObservables } from "@nozbe/watermelondb/react";
import { chatCollection } from "@/db/collections";
import { Q } from "@nozbe/watermelondb";
import { Chat } from "@/db/models/messages";
import { useChatsSync } from "@/db/queries/syncChats";
import { router } from "expo-router";
import { useEffect } from "react";
import { useWebSocketHandler } from "@/hooks/useWebSocketHandler";

interface ChatListProps {
  chats: Chat[];
}

function ChatList({ chats }: ChatListProps) {
  const { resync, syncing } = useChatsSync();
  const { connect } = useWebSocketHandler();
  useEffect(() => {
    resync();
    connect();
  }, []);
  return (
    <>
      <Box className="flex-1 mt-2">
        <ChatsStateWrapper loading={!chats}>
          <View className="flex-1">
            <FlashList
              data={chats}
              refreshControl={
                <RefreshControl refreshing={false} onRefresh={resync} />
              }
              ListFooterComponent={<View className="h-16"></View>}
              contentContainerClassName="pt-2"
              keyExtractor={(item) => item.server_chat_id}
              renderItem={({ item }) => <MessageListItem chat={item} />}
              onScroll={() => eventBus.dispatchEvent("SWIPEABLE_OPEN", null)}
              ListEmptyComponent={() => (
                <MiniEmptyState
                  icon={MessageSquare}
                  className="mt-8"
                  title="No chat Found"
                  description="chats will be displayed here when available!"
                  onPress={() => router.push("/start")}
                  subIcon={Plus}
                  buttonLabel="Start a Chat"
                />
              )}
            />
          </View>
        </ChatsStateWrapper>
      </Box>
    </>
  );
}

const enhance = withObservables([], () => ({
  chats: chatCollection
    .query(
      Q.where("deleted_at", Q.eq(null)),
      Q.sortBy("recent_message_created_at", Q.desc),
    )
    .observe(),
}));

export default enhance(ChatList);
