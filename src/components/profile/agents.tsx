import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import { memo, useMemo } from "react";
import { ScrollView } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAgents } from "@/actions/agent";
import AgentProfile from "@/components/profile/AgentProfile";
import { View } from "@/components/ui";

const AgentProfileList = () => {
  const {
    data,
    refetch,
    isLoading: loading,
    isRefetching: fetching,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["agents"],
    queryFn: ({ pageParam = 1 }) => getAgents({ pageParam }),
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage;
      return page < pages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });
  const agents = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );
  return (
    <SectionHeaderWithRef
      title="Discover agents"
      subTitle="See More"
      titleClassName="text-md"
      className="flex-1 h-80"
      onSeeAllPress={() => {
        router.push({
          pathname: "/reels",
          params: {
            agent: "true",
          },
        });
      }}
    >
      <View className="">
        <ScrollView
          horizontal
          contentContainerClassName="gap-x-4 pl-4"
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={238 + 4}
          snapToAlignment="center"
          decelerationRate="fast"
        >
          {agents?.map((data) => (
            <AgentProfile key={data.id} data={data} />
          ))}
        </ScrollView>
      </View>
    </SectionHeaderWithRef>
  );
};

export default memo(AgentProfileList);
