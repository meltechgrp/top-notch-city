import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import { memo } from "react";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import useGetLocation from "@/hooks/useGetLocation";

const TopLocations = () => {
  const { location } = useGetLocation();
  return (
    <SectionHeaderWithRef
      title="Nearby"
      titleClassName="text-gray-400 text-base"
      subTitle="Explore"
      className=""
      hasData={false}
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
        data={[]}
        isLoading={false}
        listType={["nearby"]}
        showLike={false}
        isRefetching={false}
      />
    </SectionHeaderWithRef>
  );
};

export default memo(TopLocations);
