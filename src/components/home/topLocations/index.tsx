import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import { memo } from "react";
import { useStore } from "@/store";
import HorizontalProperties from "@/components/property/HorizontalProperties";

const TopLocations = () => {
  const { nearbyProperties: properties } = useStore();
  return (
    <SectionHeaderWithRef
      title="Nearby"
      titleClassName="text-gray-400 text-base"
      subTitle="Explore"
      className=""
      hasData={properties && properties?.length > 1}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            locate: "true",
          },
        });
      }}
    >
      <HorizontalProperties
        data={properties || []}
        isLoading={false}
        listType={["nearby"]}
        showLike
        isRefetching={false}
      />
    </SectionHeaderWithRef>
  );
};

export default memo(TopLocations);
