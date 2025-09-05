import { MessageListItem } from "@/components/contents/MessageListItem";
import SmartphoneChatIcon from "@/components/icons/SmartphoneChatIcon";
import StartChatBottomSheet from "@/components/modals/StartChatBottomSheet";
import CreateButton from "@/components/custom/CreateButton";
import EmptyStateWrapper from "@/components/shared/EmptyStateWrapper";
import { Box, View } from "@/components/ui";
import { useStore } from "@/store";
import { FlashList } from "@shopify/flash-list";
import React, { useState } from "react";
import { RefreshControl } from "react-native";
import { useChat } from "@/hooks/useChat";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import CustomerCareBottomSheet from "@/components/modals/CustomerCareBottomSheet";

export default function MessagesScreen() {
  const { me } = useStore();
  const { chats, loading, refreshing, refetch } = useChat();
  const [friendsModal, setFriendsModal] = React.useState(false);
  const [staffs, setStaffs] = useState(false);

  const onNewChat = () => {
    setFriendsModal(true);
  };
  useRefreshOnFocus(async () => {
    setTimeout(refetch, 1000);
  });
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
              estimatedItemSize={92}
            />
          </View>
        </EmptyStateWrapper>
      </Box>
      {me && <CreateButton onPress={onNewChat} />}
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
