import MessageListItem from "@/components/chat/MessageListItem";
import StartChatBottomSheet from "@/components/modals/StartChatBottomSheet";
import CustomerCareBottomSheet from "@/components/modals/CustomerCareBottomSheet";
import { Box, Icon, Pressable, View } from "@/components/ui";
import { FlashList } from "@shopify/flash-list";
import React, { useEffect, useMemo, useState } from "react";
import { RefreshControl } from "react-native";
import { useChat } from "@/hooks/useChat";
import { router, Tabs } from "expo-router";
import {
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Users,
} from "lucide-react-native";
import ChatsStateWrapper from "@/components/chat/ChatsStateWrapper";
import { FilterComponent } from "@/components/admin/shared/FilterComponent";
import { cn } from "@/lib/utils";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { useWebSocketHandler } from "@/hooks/useWebSocketHandler";

export default function MessagesScreen() {
  const { chats, loading, refreshing, refetch, me } = useChat();
  const { connect } = useWebSocketHandler();
  const [search, setSearch] = useState("");
  const [friendsModal, setFriendsModal] = React.useState(false);
  const [staffs, setStaffs] = React.useState(false);
  const isFetching = loading || refreshing;

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
  const headerComponent = useMemo(() => {
    return (
      <FilterComponent
        search={search}
        onSearch={setSearch}
        className={cn("mt-1 px-1 mx-2", chats?.length < 1 && " hidden")}
        searchPlaceholder="Search by name"
      />
    );
  }, [search, setSearch]);
  useEffect(() => {
    connect();
  }, []);
  return (
    <>
      <Tabs.Screen
        options={{
          headerLeft: me
            ? () => (
                <View className="px-4 flex-row gap-4">
                  <Pressable
                    className="p-2 bg-background-muted rounded-full"
                    onPress={() => setFriendsModal(true)}
                  >
                    <Icon as={Plus} className="w-6 h-6" />
                  </Pressable>
                </View>
              )
            : undefined,
          headerRight: () => (
            <View className="px-4 flex-row gap-4">
              <Pressable
                className="p-2 bg-background-muted rounded-full"
                onPress={() => router.push("/(protected)/explore")}
              >
                <Icon as={Search} className="w-6 h-6" />
              </Pressable>
              {me && (
                <Pressable
                  className="p-2 bg-background-muted rounded-full"
                  onPress={() => router.push("/(protected)/settings")}
                >
                  <Icon as={MoreHorizontal} className="w-6 h-6" />
                </Pressable>
              )}
            </View>
          ),
        }}
      />
      <Box className="flex-1">
        <ChatsStateWrapper loading={loading} isEmpty={!me}>
          <View className="flex-1">
            <FlashList
              data={filteredData}
              refreshControl={
                <RefreshControl refreshing={false} onRefresh={refetch} />
              }
              ListHeaderComponent={headerComponent}
              ListFooterComponent={<View className="h-16"></View>}
              contentContainerClassName="pt-2"
              keyExtractor={(item) => item.chat_id}
              renderItem={({ item }) => <MessageListItem chat={item} />}
              ListEmptyComponent={() => (
                <MiniEmptyState
                  icon={Users}
                  className="mt-8"
                  title="No user Found"
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
      {me && friendsModal && (
        <StartChatBottomSheet
          visible={friendsModal}
          onDismiss={() => setFriendsModal(false)}
          setStaffs={() => setStaffs(true)}
          me={me}
        />
      )}
      <CustomerCareBottomSheet
        visible={staffs}
        onDismiss={() => {
          setStaffs(false);
        }}
      />
    </>
  );
}
