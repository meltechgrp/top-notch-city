import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { useHomeFeed } from "@/hooks/useHomeFeed";
import { router } from "expo-router";
import { memo } from "react";

function ShortletProperties() {
  const { shortlets, loadingShortlet, refetchingShortlet } = useHomeFeed();
  return (
    <SectionHeaderWithRef
      title="Shortlets/Hotels"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={loadingShortlet || refetchingShortlet || shortlets?.length > 0}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            category: "Shortlet",
          },
        });
      }}
    >
      <HorizontalProperties
        data={shortlets}
        isLoading={loadingShortlet}
        listType={["shortlet"]}
        isRefetching={refetchingShortlet}
      />
    </SectionHeaderWithRef>
  );
}

export default memo(ShortletProperties);
