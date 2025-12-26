import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import { memo } from "react";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { useHomeFeed } from "@/hooks/useHomeFeed";
import { deduplicate } from "@/lib/utils";

const Lands = () => {
  const { lands, loadingLand, refetchingLand } = useHomeFeed();
  return (
    <SectionHeaderWithRef
      title="Lands"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={loadingLand || refetchingLand || lands?.length > 0}
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
        data={deduplicate(lands, "id")}
        isLoading={loadingLand}
        listType={["trending-lands"]}
        isRefetching={refetchingLand}
      />
    </SectionHeaderWithRef>
  );
};

export default memo(Lands);
