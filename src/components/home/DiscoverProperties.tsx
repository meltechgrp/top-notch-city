import { View } from "@/components/ui";
import Map from "../location/map";
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
        <Map
          markers={properties || []}
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
