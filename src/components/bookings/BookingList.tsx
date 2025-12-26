import { Bookings } from "@/actions/bookings";
import { BookingCard } from "@/components/bookings/BookingCard";
import ChatsStateWrapper from "@/components/chat/ChatsStateWrapper";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { Box, Text, View } from "@/components/ui";
import { useMe } from "@/hooks/useMe";
import eventBus from "@/lib/eventBus";
import { FlashList } from "@shopify/flash-list";
import { useInfiniteQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { FolderOpen, Search } from "lucide-react-native";
import { memo, useCallback, useMemo } from "react";
import { RefreshControl } from "react-native";

function BookingList() {
  const { isAgent, isLoading: loading, me } = useMe();
  const { data, isLoading, refetch, isRefetching, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["bookings"],
      queryFn: ({}) => Bookings(isAgent),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => {
        const { page, pages } = lastPage;
        return page < pages ? page + 1 : undefined;
      },
    });
  const bookings = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );
  const sections = useCallback(
    (key: string) => {
      if (!bookings.length) return [];

      return bookings.filter((booking) => booking.booking_type == key);
    },
    [bookings]
  );
  return (
    <Box className="flex-1 mt-2">
      <ChatsStateWrapper loading={loading || isLoading} isEmpty={!me}>
        <View className="flex-1">
          <FlashList
            data={sections("reservation")}
            refreshControl={
              <RefreshControl refreshing={false} onRefresh={refetch} />
            }
            onScroll={() => eventBus.dispatchEvent("SWIPEABLE_OPEN", null)}
            ListFooterComponent={<View className="h-16"></View>}
            contentContainerClassName="pt-2"
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
