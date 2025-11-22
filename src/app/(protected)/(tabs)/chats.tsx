import MessageListItem from "@/components/chat/MessageListItem";
import SmartphoneChatIcon from "@/components/icons/SmartphoneChatIcon";
import StartChatBottomSheet from "@/components/modals/StartChatBottomSheet";
import CustomerCareBottomSheet from "@/components/modals/CustomerCareBottomSheet";
import { Box, Icon, Pressable, View } from "@/components/ui";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { RefreshControl } from "react-native";
import { useChat } from "@/hooks/useChat";
import { router, Tabs } from "expo-router";
import { MoreHorizontal, Plus, Search } from "lucide-react-native";
import ChatsStateWrapper from "@/components/chat/ChatsStateWrapper";

export default function MessagesScreen() {
  const { chats, loading, refreshing, refetch, me } = useChat();

  const [friendsModal, setFriendsModal] = React.useState(false);
  const [staffs, setStaffs] = React.useState(false);
  const isFetching = loading || refreshing;
  return (
    <>
      <Tabs.Screen
        options={{
          headerLeft: () => (
            <View className="px-4 flex-row gap-4">
              <Pressable
                className="p-2 bg-background-muted rounded-full"
                onPress={() => setFriendsModal(true)}
              >
                <Icon as={Plus} className="w-6 h-6" />
              </Pressable>
            </View>
          ),
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
        <ChatsStateWrapper
          loading={isFetching}
          isEmpty={!isFetching && (!chats || chats?.length < 1)}
          illustration={<SmartphoneChatIcon className="relative left-4" />}
          text={
            me
              ? "You don't have any message in your inbox"
              : "Login to enjoy our messaging feature"
          }
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
              contentContainerClassName="pt-2"
              keyExtractor={(item) => item.chat_id}
              renderItem={({ item }) => <MessageListItem chat={item} />}
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
