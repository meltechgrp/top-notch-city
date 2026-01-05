import { View } from "@/components/ui";
import Map from "../location/map";
import HomeNavigation from "./HomeNavigation";
import { router } from "expo-router";
import { withObservables } from "@nozbe/watermelondb/react";
import { Q } from "@nozbe/watermelondb";
import { propertiesCollection } from "@/db/collections";
import { nearby } from "@/store/homeFeed";

type Props = {
  className?: string;
  mapHeight: number;
};
const DiscoverProperties = (props: Props) => {
  const { className, mapHeight } = props;
  const properties = nearby.get();
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
        />
      </View>
    </View>
  );
};

export default DiscoverProperties;
