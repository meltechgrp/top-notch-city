import { BookingCard } from "@/components/bookings/BookingCard";
import ChatsStateWrapper from "@/components/chat/ChatsStateWrapper";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { Box, View } from "@/components/ui";
import { useBooking } from "@/hooks/useBooking";
import { useMe } from "@/hooks/useMe";
import eventBus from "@/lib/eventBus";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { FolderOpen, Search } from "lucide-react-native";
import { memo } from "react";
import { RefreshControl } from "react-native";

function BookingList() {
  const { isLoading: loading, me } = useMe();
  const {
    lists,
    query: { isLoading, refetch, isRefetching, hasNextPage, fetchNextPage },
  } = useBooking();
  return (
    <Box className="flex-1 mt-2">
      <ChatsStateWrapper
        loading={loading || isLoading || isRefetching}
        isEmpty={!me}
      >
        <View className="flex-1">
          <FlashList
            data={lists.reservations}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={refetch} />
            }
            onScroll={() => eventBus.dispatchEvent("SWIPEABLE_OPEN", null)}
            ListFooterComponent={<View className="h-16"></View>}
            contentContainerClassName="pt-2 pb-20"
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <BookingCard booking={item} />}
            scrollEventThrottle={16}
            onEndReached={() => {
              if (hasNextPage && !isLoading) fetchNextPage?.();
            }}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 50,
            }}
            removeClippedSubviews={false}
            onEndReachedThreshold={0.2}
            ListEmptyComponent={() => (
              <MiniEmptyState
                title="No Bookings Yet"
                icon={FolderOpen}
                iconClassName="w-12 h-12 text-info-100"
                description="Start planning your next adventure. Browse our properties now"
                buttonLabel="Explore"
                subIcon={Search}
                className="gap-1"
                onPress={() => router.push("/explore")}
              />
            )}
          />
        </View>
      </ChatsStateWrapper>
    </Box>
  );
}
export default memo(BookingList);
