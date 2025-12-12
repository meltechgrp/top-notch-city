import { VisitCard } from "@/components/bookings/VisitCard";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { Box, Text, View } from "@/components/ui";
import { router } from "expo-router";
import { FolderOpen, Search } from "lucide-react-native";
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

function VisitationList({ bookings, isRefreshing, refetch }: Props) {
  return (
    <Box className="flex-1 px-4">
      <SectionList
        sections={bookings}
        contentContainerClassName="pb-20"
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refetch} />
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
