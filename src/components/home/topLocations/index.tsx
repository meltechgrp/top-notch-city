import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import { memo } from "react";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import useGetLocation from "@/hooks/useGetLocation";
import { useHomeList } from "@/hooks/useHomeList";

const TopLocations = () => {
  const { location } = useGetLocation();
  const { nearby, isLoading } = useHomeList();
  return (
    <SectionHeaderWithRef
      title="Nearby"
      titleClassName="text-gray-400 text-base"
      subTitle="Explore"
      className=""
      hasData={isLoading || nearby?.length > 1}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            latitude: location?.latitude,
            longitude: location?.longitude,
          },
        });
      }}
    >
      <HorizontalProperties
        data={nearby}
        isLoading={isLoading}
        listType={["nearby"]}
        showLike
        isRefetching={false}
      />
    </SectionHeaderWithRef>
  );
};

export default memo(TopLocations);
