import { useMemo, useState } from "react";
import { Box, Text, View } from "@/components/ui";
import { RefreshControl, SectionList } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useRefresh } from "@react-native-community/hooks";
import { getEquiries } from "@/actions/equiry";
import EnquiryListItem from "@/components/enquiry/EnquiryListItem";
import EnquiryBottomSheet from "@/components/enquiry/EnquiryBottomSheet";

export default function Reports() {
  const [applicationBottomSheet, setApplicationBottomSheet] = useState(false);
  const [application, setApplication] = useState<EnquiryList | null>(null);
  const { data, isLoading, refetch, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["reports"],
      queryFn: ({ pageParam = 1 }) => getEquiries({ pageParam }),
      getNextPageParam: (lastPage) => {
        const { page, pages } = lastPage;
        return page < pages ? page + 1 : undefined;
      },
      initialPageParam: 1,
    });
  const { onRefresh, isRefreshing } = useRefresh(refetch);
  const applications = useMemo(
    () => data?.pages.flatMap((item) => item.results) || [],
    [data]
  );
  const sections = useMemo(() => {
    if (!applications.length) return [];

    // Group by submission date
    const groups: { [date: string]: EnquiryList[] } = {};

    applications.forEach((item) => {
      const dateKey = format(new Date(item.created_at), "yyyy-MM-dd");
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(item);
    });

    // Convert to array of { title, data }
    return Object.entries(groups)
      .map(([dateKey, items]) => ({
        title: format(new Date(dateKey), "MMMM d, yyyy"),
        data: items,
      }))
      .sort(
        (a, b) => new Date(b.title).getTime() - new Date(a.title).getTime()
      );
  }, [applications]);

  return (
    <Box className="flex-1 py-4">
      <SectionList
        sections={sections}
        contentContainerClassName="pb-40 px-4"
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        onEndReached={() => {
          if (hasNextPage && !isLoading) fetchNextPage?.();
        }}
        renderItem={({ item }) => (
          <EnquiryListItem
            enquiry={item}
            onPress={() => {
              setApplication(item);
              setApplicationBottomSheet(true);
            }}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="text-sm font-semibold mb-2 mt-4 text-typography">
            {title}
          </Text>
        )}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          <Text className="text-center text-sm text-typography">
            No Enquires found.
          </Text>
        }
      />
      <EnquiryBottomSheet
        visible={applicationBottomSheet}
        onDismiss={() => setApplicationBottomSheet(false)}
        enquiry={application}
      />
    </Box>
  );
}
