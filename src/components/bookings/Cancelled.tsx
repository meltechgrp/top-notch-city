import { BookingCard } from "@/components/bookings/BookingCard";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { Box, Text, View } from "@/components/ui";
import { Files } from "lucide-react-native";
import { memo } from "react";
import { RefreshControl, SectionList } from "react-native";

interface Props {
  bookings: {
    title: string;
    data: Booking[];
  }[];
  isRefreshing: boolean;
  isLoading: boolean;
  refetch: () => Promise<any>;
}

function Cancelled({ bookings, isLoading, isRefreshing, refetch }: Props) {
  return (
    <Box className="flex-1">
      <SectionList
        sections={bookings}
        contentContainerClassName="pb-40"
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refetch} />
        }
        renderItem={({ item }) => <BookingCard booking={item} />}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-sm font-semibold mb-2 mt-4 text-typography">
            {title}
          </Text>
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          <MiniEmptyState
            title="No Bookings Yet"
            icon={Files}
            description="Start planning your next adventure. Browse our properties now"
          />
        }
      />
    </Box>
  );
}

export default memo(Cancelled);
