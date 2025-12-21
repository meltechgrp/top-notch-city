import { View } from "@/components/ui";
import Map from "../location/map";
import HomeNavigation from "./HomeNavigation";
import { router } from "expo-router";
import { memo } from "react";
import { useHomeList } from "@/hooks/useHomeList";

type Props = {
  className?: string;
  mapHeight: number;
};
const DiscoverProperties = (props: Props) => {
  const { className, mapHeight } = props;
  const { nearby } = useHomeList(50);
  return (
    <View style={{ flex: 1, height: mapHeight }} className={className}>
      <View className="overflow-hidden relative flex-1">
        <View className="  absolute top-16 w-full z-10">
          <HomeNavigation />
        </View>
        <Map
          markers={nearby}
          onDoublePress={() =>
            router.push({
              pathname: "/explore",
            })
          }
          height={mapHeight}
        />
      </View>
    </View>
  );
};

export default memo(DiscoverProperties);
