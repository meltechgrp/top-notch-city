import { VisitCard } from "@/components/bookings/VisitCard";
import { Bookings } from "@/actions/bookings";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { Box, Text, View } from "@/components/ui";
import { useMe } from "@/hooks/useMe";
import { useInfiniteQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { router } from "expo-router";
import { FolderOpen, Search } from "lucide-react-native";
import { memo, useCallback, useMemo } from "react";
import { RefreshControl, SectionList } from "react-native";

function VisitationList() {
  const { isAgent } = useMe();
  const { data, isLoading, refetch, isRefetching } = useInfiniteQuery({
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

      const groups: { [date: string]: Booking[] } = {};
      bookings
        .filter((booking) => booking.booking_type == key)
        .forEach((item) => {
          const dateKey = format(new Date(item.created_at), "yyyy-MM-dd");
          if (!groups[dateKey]) groups[dateKey] = [];
          groups[dateKey].push(item);
        });

      return Object.entries(groups)
        .map(([dateKey, items]) => ({
          title: format(new Date(dateKey), "MMMM d, yyyy"),
          data: items,
        }))
        .sort(
          (a, b) => new Date(b.title).getTime() - new Date(a.title).getTime()
        );
    },
    [bookings]
  );
  return (
    <Box className="flex-1 px-4">
      <SectionList
        sections={sections("inspection")}
        contentContainerClassName="pb-20"
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        renderItem={({ item }) => <VisitCard booking={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-sm font-semibold mb-1 mt-2 text-typography/80">
            {title}
          </Text>
        )}
        ItemSeparatorComponent={() => <View className="h-1" />}
        ListEmptyComponent={
          <MiniEmptyState
            title="No Bookings Yet"
            icon={FolderOpen}
            iconClassName="w-12 h-12 text-info-100"
            description="Ready to buy/rent your next home/land?. Browse our properties now"
            buttonLabel="Explore"
            subIcon={Search}
            className="gap-1"
            onPress={() => router.push("/explore")}
          />
        }
      />
    </Box>
  );
}

export default memo(VisitationList);
