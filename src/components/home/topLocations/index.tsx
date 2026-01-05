import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { nearby } from "@/store/homeFeed";
import { mainStore } from "@/store";

const NearbyProperties = () => {
  const properties = nearby.get();
  return (
    <SectionHeaderWithRef
      title="Nearby"
      titleClassName="text-gray-400 text-base"
      subTitle="Explore"
      className=""
      hasData={location && properties && properties?.length > 0}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            latitude: mainStore.address?.latitude.get(),
            longitude: mainStore.address?.longitude.get(),
          },
        });
      }}
    >
      <HorizontalProperties
        data={properties}
        isLoading={false}
        isRefetching={false}
      />
    </SectionHeaderWithRef>
  );
};

export default NearbyProperties;
