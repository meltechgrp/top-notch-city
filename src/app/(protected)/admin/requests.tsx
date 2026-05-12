import { useMemo, useState } from "react";
import { Box, Text, View } from "@/components/ui";
import { RefreshControl, SectionList } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAgentApplications } from "@/actions/agent";
import { format } from "date-fns";
import ApplicationBottomSheet from "@/components/modals/agent/ApplicationBottomSheet";
import { useRefresh } from "@react-native-community/hooks";
import RequestListItem from "@/components/admin/request/RequestListItem";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";

export default function Requests() {
  const [applicationBottomSheet, setApplicationBottomSheet] = useState(false);
  const [application, setApplication] = useState<AgentReview | null>(null);
  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["agent-applications"],
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
    [data],
  );
  const sections = useMemo(() => {
    if (!applications.length) return [];

    const groups: { [date: string]: AgentReview[] } = {};

    applications.forEach((item) => {
      const createdAt = item.created_at ? new Date(item.created_at) : null;
      const dateKey =
        createdAt && !Number.isNaN(createdAt.getTime())
          ? format(createdAt, "yyyy-MM-dd")
          : "Unknown date";
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(item);
    });

    return Object.entries(groups)
      .map(([dateKey, items]) => ({
        title:
          dateKey === "Unknown date"
            ? dateKey
            : format(new Date(dateKey), "MMMM d, yyyy"),
        data: items,
      }))
      .sort(
        (a, b) =>
          new Date(b.data[0]?.created_at || 0).getTime() -
          new Date(a.data[0]?.created_at || 0).getTime(),
      );
  }, [applications]);

  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center">
        <SpinningLoader />
      </Box>
    );
  }

  return (
    <Box className="flex-1 px-4 py-2">
      <SectionList
        sections={sections}
        contentContainerClassName="pb-40"
        keyExtractor={(item, index) => item.application_id || `${index}`}
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
          if (hasNextPage && !isLoading && !isRefetching) fetchNextPage?.();
        }}
        onEndReachedThreshold={0.2}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          isError ? (
            <MiniEmptyState
              title="Unable to load agent applications"
              description={error?.message || "Pull down to try again."}
            />
          ) : (
            <MiniEmptyState title="No agent applications found." />
          )
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
