import { MessageListItem } from "@/components/contents/MessageListItem";
import SmartphoneChatIcon from "@/components/icons/SmartphoneChatIcon";
import StartChatBottomSheet from "@/components/modals/StartChatBottomSheet";
import CreateButton from "@/components/custom/CreateButton";
import EmptyStateWrapper from "@/components/shared/EmptyStateWrapper";
import { Box, View } from "@/components/ui";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useStore } from "@/store";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { RefreshControl } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getChats } from "@/actions/message";

export default function MessageScreen() {
  const { me } = useStore();
  const router = useRouter();
  const [friendsModal, setFriendsModal] = React.useState(false);
  const userId = useMemo(() => me?.id, [me]);
  const {
    data,
    refetch,
    isLoading: loading,
    isFetching: refreshing,
  } = useQuery({
    queryKey: ["chats", userId],
    queryFn: getChats,
  });
  const onNewChat = () => {
    setFriendsModal(true);
  };
  const chats = useMemo(() => data?.chats || [], [data]);
  useRefreshOnFocus(refetch);
  return (
    <>
      <Box className="flex-1">
        <EmptyStateWrapper
          loading={loading}
          isEmpty={chats?.length < 1}
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
          onSelect={(member) => {
            router.push({
              pathname: "/(protected)/(tabs)/message/[chatId]",
              params: {
                chatId: `${member.id}_${me?.id}`,
              },
            });
          }}
          me={me}
        />
      )}
    </>
  );
}
