import { useState } from "react";
import Map from "../location/map";
import { View } from "../ui";
import PropertyBottomSheet from "../location/PropertyBottomSheet";
import { Property } from "@/db/models/properties";

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

export default SearchMapView;
