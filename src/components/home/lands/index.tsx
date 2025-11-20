import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import { memo } from "react";
import { useHomeFeed } from "@/hooks/useHomeFeed";
import HorizontalProperties from "@/components/property/HorizontalProperties";

const Lands = () => {
  const { lands, loadingLand, refetchingLand } = useHomeFeed();

  return (
    <SectionHeaderWithRef
      title="Trending Lands"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={lands?.length > 0 || loadingLand || refetchingLand}
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
        data={lands}
        isLoading={loadingLand}
        listType="trending-lands"
        isRefetching={refetchingLand}
      />
    </SectionHeaderWithRef>
  );
};

export default memo(Lands);
