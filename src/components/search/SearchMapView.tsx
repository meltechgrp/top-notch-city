import { useState } from "react";
import Map from "../location/map";
import { View } from "../ui";
import PropertyBottomSheet from "../location/PropertyBottomSheet";
import { Property } from "@/db/models/properties";
import { withObservables } from "@nozbe/watermelondb/react";
import { database } from "@/db";
import { Q } from "@nozbe/watermelondb";
import { buildLocalQuery } from "@/store/searchStore";

type Props = {
  properties: any;
  height: number;
  filters: SearchFilters;
};

function SearchMapView({ properties, height, filters }: Props) {
  const [selectedItem, setSeletedItem] = useState<Property | null>(null);

  return (
    <>
      <View className="flex-1">
        <Map
          scrollEnabled={true}
          height={height}
          latitude={filters?.latitude}
          longitude={filters?.longitude}
          markers={properties}
          onRegionChange={(latitude, longitude) => {
            // onUpdate({ latitude, longitude });
          }}
          showSmallMarker={false}
          onMarkerPress={(marker) => setSeletedItem(marker)}
        />
      </View>
      {selectedItem && (
        <PropertyBottomSheet
          visible={!!selectedItem}
          data={selectedItem}
          onDismiss={() => setSeletedItem(null)}
        />
      )}
    </>
  );
}

const enhance = withObservables(
  ["filter"],
  ({ filter }: { filter: SearchFilters }) => ({
    properties: database
      .get("properties")
      .query(
        ...buildLocalQuery(filter),
        Q.where("status", "approved"),
        Q.sortBy("updated_at", Q.desc),
        Q.take(100)
      ),
  })
);

export default enhance(SearchMapView);
