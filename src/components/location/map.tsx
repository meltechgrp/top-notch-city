import React, { memo, ReactNode, useEffect, useRef, useState } from "react";
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Layout from "@/constants/Layout";
import { CustomPropertyMarker } from "./CustomPropertyMarker";
import Platforms from "@/constants/Plaforms";
import PropertyMedia from "@/assets/images/property.png";
import { Colors } from "@/constants/Colors";
import { useResolvedTheme } from "../ui";
import { getRegionForMarkers } from "@/lib/utils";

interface MapProps {
  latitude?: number;
  longitude?: number;
  height?: number;
  showUserLocation?: boolean;
  scrollEnabled?: boolean;
  showsBuildings?: boolean;
  activeMarker?: Property[];
  children?: ReactNode;
  onMarkerPress?: (data: Property) => void;
  zoomControlEnabled?: boolean;
  markers?: Property[];
  marker?: LocationData;
  showRadius?: boolean;
  radiusInMeters?: number;
  customMarkerImage?: any;
  onDoublePress?: () => void;
  delta?: number;
}

const DEFAULT_LAT_DELTA = 0.1;
const DEFAULT_LONG_DELTA = 0.1;
const Map = (props: MapProps) => {
  const {
    latitude: lat,
    longitude: long,
    height,
    markers,
    onMarkerPress,
    scrollEnabled = true,
    showRadius,
    radiusInMeters,
    customMarkerImage,
    marker,
    onDoublePress,
    zoomControlEnabled,
    delta,
  } = props;
  const theme = useResolvedTheme();
  const [location, setLocation] = useState({
    latitude: lat || 4.8156,
    longitude: long || 7.0498,
  });

  const mapRef = useRef<MapView>(null);
  useEffect(() => {
    (async () => {
      if (markers && markers.length > 0) {
        const region = getRegionForMarkers(
          markers.map((m) => ({
            latitude: m.address.latitude,
            longitude: m.address.longitude,
          }))
        );

        mapRef.current?.animateToRegion(region, 2000);
        setLocation({
          latitude: region.latitude,
          longitude: region.longitude,
        });
      }
    })();
  }, [markers?.length]);
  return (
    <>
      <MapView
        ref={mapRef}
        style={{ width: "100%", height: height || Layout.window.height }}
        provider={Platforms.isAndroid() ? PROVIDER_GOOGLE : undefined}
        zoomEnabled={true}
        loadingEnabled
        onDoublePress={onDoublePress}
        loadingBackgroundColor={
          theme == "dark" ? Colors.light.background : Colors.dark.background
        }
        loadingIndicatorColor={
          theme == "dark" ? Colors.dark.tint : Colors.light.tint
        }
        showsCompass={false}
        customMapStyle={
          theme === "dark" && Platforms.isAndroid() ? mapStyleDark : []
        }
        zoomControlEnabled={zoomControlEnabled}
        compassOffset={{ x: 10, y: 50 }}
        scrollEnabled={scrollEnabled}
        region={{
          latitudeDelta: delta || DEFAULT_LAT_DELTA,
          longitudeDelta: delta || DEFAULT_LONG_DELTA,
          ...location,
        }}
      >
        {marker && (
          <Marker
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            image={customMarkerImage || PropertyMedia}
            anchor={{ x: 0.5, y: 0.5 }}
          />
        )}
        {lat && long && (
          <Marker
            coordinate={{
              latitude: lat,
              longitude: long,
            }}
            image={customMarkerImage || PropertyMedia}
            anchor={{ x: 0.5, y: 0.5 }}
          />
        )}
        {location && showRadius && (
          <Circle
            center={{ ...location }}
            radius={radiusInMeters || 5000} // default 5km
            fillColor="rgba(0, 0, 0, 0.1)"
            strokeColor="rgba(241, 96, 0, 0.6)"
            strokeWidth={5}
          />
        )}
        {markers?.map((place, i) => (
          <CustomPropertyMarker
            key={place.id + i}
            onPress={(data) => onMarkerPress && onMarkerPress(data)}
            property={place}
          />
        ))}
      </MapView>
    </>
  );
};

export default memo(Map);

// constants/mapStyleDark.ts
export const mapStyleDark = [
  {
    elementType: "geometry",
    stylers: [{ color: "#1d1d1d" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#d5d5d5" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1d1d1d" }],
  },
  {
    featureType: "administrative",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }],
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#2b2b2b" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#a5a5a5" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#383838" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a8a8a" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#454545" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3c3c3c" }],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [{ color: "#4e4e4e" }],
  },
  {
    featureType: "road.local",
    elementType: "geometry",
    stylers: [{ color: "#2e2e2e" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f2f2f" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: Colors.light.background }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3d3d3d" }],
  },
];
