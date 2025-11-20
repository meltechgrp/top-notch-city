import { View } from "@/components/ui";
import Map from "../location/map";
import FoundHorizontalList from "./FoundProperties";
import HomeNavigation from "./HomeNavigation";
import { router } from "expo-router";
import { memo } from "react";
import { useStore } from "@/store";

type Props = {
  className?: string;
  mapHeight: number;
};
const DiscoverProperties = (props: Props) => {
  const { className, mapHeight } = props;
  const { nearbyProperties: properties } = useStore();

  return (
    <View style={{ flex: 1, height: mapHeight }} className={className}>
      <View className="overflow-hidden relative flex-1">
        <View className="  absolute top-16 w-full z-10">
          <HomeNavigation />
        </View>
        <View className="absolute bottom-8 z-10">
          <FoundHorizontalList data={properties} refetch={async () => {}} />
        </View>
        <Map
          markers={properties || []}
          // scrollEnabled={false}
          onDoublePress={() =>
            router.push({
              pathname: "/explore",
            })
          }
          height={mapHeight}
          onMarkerPress={(data) =>
            router.push({
              pathname: "/explore",
              params: {
                propertyId: data.id,
              },
            })
          }
        />
      </View>
    </View>
  );
};

export default memo(DiscoverProperties);
