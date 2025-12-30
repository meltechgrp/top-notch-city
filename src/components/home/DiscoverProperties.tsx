import { View } from "@/components/ui";
import Map from "../location/map";
import HomeNavigation from "./HomeNavigation";
import { router } from "expo-router";
import { withObservables } from "@nozbe/watermelondb/react";
import { database } from "@/db";
import { Q } from "@nozbe/watermelondb";

type Props = {
  className?: string;
  mapHeight: number;
  properties: any;
};
const DiscoverProperties = (props: Props) => {
  const { className, mapHeight, properties } = props;
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

const enhance = withObservables(["state", "city"], ({ state, city }) => ({
  properties: database
    .get("properties")
    .query(
      Q.where("status", "approved"),
      Q.or(Q.where("state", state), Q.where("city", city))
    ),
}));

export default enhance(DiscoverProperties);
