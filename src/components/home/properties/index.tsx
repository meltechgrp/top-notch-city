import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import VerticalProperties from "@/components/property/VerticalProperties";
import { View } from "@/components/ui";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { useMemo } from "react";

const TopProperties = () => {
  const {
    data,
    refetch,
    isRefetching: refetching,
  } = useInfinityQueries({ type: "all" });

  const properties = useMemo(
    () => data?.pages.flatMap((page) => page.results) || [],
    [data]
  );
  return (
    <SectionHeaderWithRef
      title="Top Properties"
      onSeeAllPress={() => {
        router.push({
          pathname: "/(protected)/property/section",
          params: {
            title: "Top Properties",
          },
        });
      }}
    >
      <View className="flex-1 px-4">
        <VerticalProperties
          data={properties}
          scrollEnabled={false}
          refetch={refetch}
          disableCount={true}
          isLoading={refetching}
        />
      </View>
    </SectionHeaderWithRef>
  );
};

export default TopProperties;
