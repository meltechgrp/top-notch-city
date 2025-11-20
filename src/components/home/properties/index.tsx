import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import { memo } from "react";
import { useHomeFeed } from "@/hooks/useHomeFeed";
import HorizontalProperties from "@/components/property/HorizontalProperties";

const TopProperties = () => {
  const { trending, loadingTrending, refetchingTrending } = useHomeFeed();

  return (
    <SectionHeaderWithRef
      title="Trending Properties"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={trending?.length > 0 || loadingTrending || refetchingTrending}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            list: "true",
          },
        });
      }}
    >
      <HorizontalProperties
        data={trending}
        isLoading={loadingTrending}
        isRefetching={refetchingTrending}
        listType="trending"
      />
    </SectionHeaderWithRef>
  );
};

export default memo(TopProperties);
