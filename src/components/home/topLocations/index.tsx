import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import { memo } from "react";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import useGetLocation from "@/hooks/useGetLocation";

const TopLocations = ({ data = [] }: { data: PropertyListItem[] }) => {
  const { location } = useGetLocation();
  return (
    <SectionHeaderWithRef
      title="Nearby"
      titleClassName="text-gray-400 text-base"
      subTitle="Explore"
      className=""
      hasData={data?.length > 1}
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
        data={data}
        isLoading={false}
        listType={["nearby"]}
        showLike
        isRefetching={false}
      />
    </SectionHeaderWithRef>
  );
};

export default memo(TopLocations);
