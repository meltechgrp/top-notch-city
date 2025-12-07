import { Marker } from "react-native-maps";
import { Image, View } from "@/components/ui";
import { memo, useState } from "react";

import church from "@/assets/images/clausters/church.png";
import school from "@/assets/images/clausters/school.png";
import restaurant from "@/assets/images/clausters/restaurant.png";
import hospital from "@/assets/images/clausters/hospital.png";
import fuel from "@/assets/images/clausters/gas.png";

interface Props {
  nearby: NearbyPOI;
  onPress: (data: NearbyPOI) => void;
}

function CustomNearbyMarker({ nearby, onPress }: Props) {
  const { lat: latitude, lon: longitude, category } = nearby;

  const categoryMap: Record<POICategory, any> = {
    religion: church,
    education: school,
    catering: restaurant,
    commercial: fuel,
    healthcare: hospital,
  };
  const image = categoryMap[category];
  const [track, setTrack] = useState(true);
  return (
    <>
      <Marker
        coordinate={{ latitude, longitude }}
        onPress={() => onPress(nearby)}
        anchor={{ x: 0.5, y: 1 }}
        renderToHardwareTextureAndroid
        removeClippedSubviews
        tracksViewChanges={track}
        zIndex={40}
        image={image}
      >
        <View
          style={{
            position: "relative",
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              overflow: "hidden",
            }}
          >
            <Image
              source={image}
              onLoad={() => setTrack(true)}
              onLoadEnd={() => setTimeout(() => setTrack(false), 3000)}
            />
          </View>
        </View>
      </Marker>
    </>
  );
}

export default memo(CustomNearbyMarker);
