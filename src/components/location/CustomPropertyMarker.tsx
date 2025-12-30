import { Marker } from "react-native-maps";
import PropertyMedia from "@/assets/images/property.png";
import { generateMediaUrlSingle } from "@/lib/api";
import { Image, View } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { memo, useState } from "react";
import { Property } from "@/db/models/properties";

interface Props {
  property: Property;
  onPress: (data: Property) => void;
}
function CustomPropertyMarker({ property, onPress }: Props) {
  const { latitude, longitude } = property;
  const image = property?.thumbnail
    ? generateMediaUrlSingle(property.thumbnail)
    : null;
  const [track, setTrack] = useState(true);

  return (
    <Marker
      coordinate={{ latitude, longitude }}
      onPress={() => onPress(property)}
      anchor={{ x: 0.5, y: 1 }}
      renderToHardwareTextureAndroid
      removeClippedSubviews
      tracksViewChanges={track}
      zIndex={40}
    >
      <View
        style={{
          position: "relative",
        }}
      >
        <View
          style={{
            width: 28,
            height: image ? 28 : 34,
            borderRadius: image ? 22 : 0,
            borderWidth: image ? 2 : 0,
            borderColor: image ? Colors.primary : undefined,
            overflow: "hidden",
          }}
        >
          <Image
            source={image ? { uri: image } : PropertyMedia}
            className="border-2 border-primary"
            onLoad={() => setTrack(true)}
            onLoadEnd={() => setTimeout(() => setTrack(false), 2000)}
            style={{
              width: "100%",
              height: "100%",
              resizeMode: image ? "cover" : "contain",
            }}
          />
        </View>
        {image && (
          <View
            style={{
              width: 0,
              height: 0,
              position: "absolute",
              bottom: -9,
              right: 5,
              borderLeftWidth: 9,
              borderRightWidth: 9,
              borderTopWidth: 12,
              zIndex: 100,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderTopColor: Colors.primary,
            }}
          />
        )}
      </View>
    </Marker>
  );
}

export default memo(CustomPropertyMarker);
