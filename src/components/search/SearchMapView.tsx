import { memo, useEffect, useMemo, useState } from "react";
import Map from "../location/map";
import { View } from "../ui";
import PropertyBottomSheet from "../location/PropertyBottomSheet";

type Props = {
  properties: Property[];
  height: number;
  propertyId?: string;
  latitude?: number;
  longitude?: number;
};

function SearchMapView({
  properties,
  height,
  propertyId,
  latitude,
  longitude,
}: Props) {
  const [selectedItem, setSeletedItem] = useState<Property | null>(null);

  useEffect(() => {
    if (propertyId && properties.length > 0) {
      setSeletedItem(properties.find((item) => item.id == propertyId) || null);
    }
  }, [propertyId]);
  return (
    <>
      <View className="flex-1">
        <Map
          scrollEnabled={true}
          height={height}
          latitude={latitude}
          longitude={longitude}
          markers={properties}
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

export default memo(SearchMapView);
