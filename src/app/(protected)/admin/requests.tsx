import { useMemo, useState } from "react";
import { Box, Text, View } from "@/components/ui";
import { RefreshControl, SectionList } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAgentApplications } from "@/actions/agent";
import { format } from "date-fns";
import ApplicationBottomSheet from "@/components/modals/agent/ApplicationBottomSheet";
import { useRefresh } from "@react-native-community/hooks";
import RequestListItem from "@/components/admin/request/RequestListItem";

export default function Requests() {
  const [applicationBottomSheet, setApplicationBottomSheet] = useState(false);
  const [application, setApplication] = useState<AgentReview | null>(null);
  const { data, isLoading, refetch, hasNextPage, fetchNextPage } =
    useInfiniteQuery({
      queryKey: ["applications"],
      queryFn: ({ pageParam = 1 }) => getAgentApplications({ pageParam }),
      getNextPageParam: (lastPage) => {
        const { page, total_pages } = lastPage;
        return page < total_pages ? page + 1 : undefined;
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

    const groups: { [date: string]: AgentReview[] } = {};

    applications.forEach((item) => {
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
  }, [applications]);

  return (
    <Box className="flex-1 px-4 py-2">
      <SectionList
        sections={sections}
        contentContainerClassName="pb-40"
        keyExtractor={(item) => item.application_id}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <RequestListItem
            request={item}
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
        onEndReached={() => {
          if (hasNextPage && !isLoading) fetchNextPage?.();
        }}
        onEndReachedThreshold={0.2}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          <Text className="text-center text-sm text-typography">
            No agent applications found.
          </Text>
        }
        // stickySectionHeadersEnabled={false}
      />
      <ApplicationBottomSheet
        visible={applicationBottomSheet}
        onDismiss={() => setApplicationBottomSheet(false)}
        agent={application}
      />
    </Box>
  );
}
