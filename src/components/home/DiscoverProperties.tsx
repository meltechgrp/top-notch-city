import { View } from "@/components/ui";
import Map from "../location/map";
import HomeNavigation from "./HomeNavigation";
import { router } from "expo-router";
import { withObservables } from "@nozbe/watermelondb/react";
import { Q } from "@nozbe/watermelondb";
import { propertiesCollection } from "@/db/collections";
import { Property } from "@/db/models/properties";

type Props = {
  className?: string;
  mapHeight: number;
  properties: Property[];
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

const enhance = withObservables(
  ["latitude", "longitude"],
  ({ latitude, longitude }) => ({
    properties: propertiesCollection.query(
      Q.where("status", "approved"),
      Q.or(
        Q.where("latitude", Q.gte(latitude)),
        Q.where("longitude", Q.gte(longitude))
      )
    ),
  })
);

export default enhance(DiscoverProperties);
