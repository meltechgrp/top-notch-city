import React, {
  forwardRef,
  memo,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import MapView, {
  Circle,
  MapViewProps,
  Marker,
  PROVIDER_GOOGLE,
  Region,
} from "react-native-maps";
import Layout from "@/constants/Layout";
import CustomPropertyMarker from "./CustomPropertyMarker";
import CustomNearbyMarker from "./CustomNearby";
import Platforms from "@/constants/Plaforms";
import PropertyMedia from "@/assets/images/property.png";
import { Colors } from "@/constants/Colors";
import { useResolvedTheme } from "../ui";
import { getRegionForMarkers } from "@/lib/utils";
import eventBus from "@/lib/eventBus";

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
  nearby?: NearbyPOI[];
  showRadius?: boolean;
  showSmallMarker?: boolean;
  radiusInMeters?: number;
  customMarkerImage?: any;
  onDoublePress?: () => void;
  delta?: number;
  initialMapType?: MapType;
  onMapTypeChange?: (type: MapType) => void;
  onRegionChange?: (lat: string, lon: string) => void;
}

export type MapType =
  | "standard"
  | "satellite"
  | "hybrid"
  | "terrain"
  | "mutedStandard"
  | "none";

export type MapController = {
  setMapType: (type: MapType) => void;
  toggleMapType: (list?: MapType[]) => void;
  animateToRegion: (region: Region, duration?: number) => void;
  fitToMarkers: (markers?: { latitude: number; longitude: number }[]) => void;
  getMapType: () => MapType;
};

const DEFAULT_LAT_DELTA = 0.1;
const DEFAULT_LONG_DELTA = 0.1;
const Map = forwardRef<MapController, MapProps>((props, ref) => {
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
    showSmallMarker = true,
    initialMapType = "standard",
    onMapTypeChange,
    onRegionChange,
    nearby,
  } = props;
  const theme = useResolvedTheme();
  const [center, setCenter] = useState({
    latitude: lat ?? 4.8156,
    longitude: long ?? 7.0498,
  });
  const mapRef = useRef<MapView>(null);
  const [mapType, setMapTypeState] = useState<MapType>(initialMapType);
  useImperativeHandle(
    ref,
    (): MapController => ({
      setMapType: (type: MapType) => {
        setMapTypeState(type);
        onMapTypeChange?.(type);
      },

      toggleMapType: (list?: MapType[]) => {
        const options =
          list && list.length > 0 ? list : ["standard", "satellite", "hybrid"];
        const currentIndex = options.indexOf(mapType);
        const next = options[(currentIndex + 1) % options.length];
        setMapTypeState(next as any);
        onMapTypeChange?.(next as any);
      },

      animateToRegion: (region: Region, duration = 1000) => {
        if (!mapRef.current) return;
        try {
          mapRef.current.animateToRegion(region, duration);
        } catch (e) {
          try {
            mapRef.current.animateCamera?.(
              {
                center: {
                  latitude: region.latitude,
                  longitude: region.longitude,
                },
                zoom: 12,
              },
              { duration }
            );
          } catch {}
        }
      },

      fitToMarkers: (markerList) => {
        const list =
          markerList ??
          markers?.map((m) => ({
            latitude: m.address.latitude,
            longitude: m.address.longitude,
          })) ??
          [];
        if (!list || list.length === 0) return;
        const region = getRegionForMarkers(list);
        setCenter({ latitude: region.latitude, longitude: region.longitude });
        mapRef.current?.animateToRegion(region, 850);
      },

      getMapType: () => mapType,
    }),
    [mapType, markers]
  );
  useEffect(() => {
    const handler = (type: MapType) => {
      setMapTypeState(type);
      onMapTypeChange?.(type);
    };
    const cb = (e: any) => handler(e);
    eventBus.addEventListener?.("MAP_SET_TYPE", cb);
    return () => {
      eventBus.removeEventListener?.("MAP_SET_TYPE", cb);
    };
  }, [onMapTypeChange]);

  useEffect(() => {
    (async () => {
      if (markers && markers.length > 0) {
        const region = getRegionForMarkers(
          markers.map((m) => ({
            latitude: m.address.latitude,
            longitude: m.address.longitude,
          }))
        );
        setCenter({ latitude: region.latitude, longitude: region.longitude });
        mapRef.current?.animateToRegion(region, 850);
      } else if (lat && long) {
        const region = {
          latitude: lat,
          longitude: long,
          latitudeDelta: delta || DEFAULT_LAT_DELTA,
          longitudeDelta: delta || DEFAULT_LONG_DELTA,
        };
        setCenter({ latitude: lat, longitude: long });
        mapRef.current?.animateToRegion(region, 850);
      }
    })();
  }, [markers?.length, lat, long, delta]);

  return (
    <>
      <MapView
        ref={mapRef}
        style={{ width: "100%", height: height || Layout.window.height }}
        provider={Platforms.isAndroid() ? PROVIDER_GOOGLE : undefined}
        mapType={mapType as MapViewProps["mapType"]}
        zoomEnabled={true}
        loadingEnabled
        onPress={onDoublePress}
        customMapStyle={
          theme === "dark" && Platforms.isAndroid() ? mapStyleDark : []
        }
        onDoublePress={onDoublePress}
        loadingBackgroundColor={
          theme == "dark" ? Colors.light.background : Colors.dark.background
        }
        loadingIndicatorColor={
          theme == "dark" ? Colors.dark.tint : Colors.light.tint
        }
        showsBuildings
        showsTraffic
        showsCompass={false}
        // onRegionChangeComplete={({ latitude, longitude }) =>
        //   onRegionChange?.(latitude.toString(), longitude.toString())
        // }
        zoomControlEnabled={zoomControlEnabled}
        compassOffset={{ x: 10, y: 50 }}
        scrollEnabled={scrollEnabled}
        initialRegion={{
          latitude: center.latitude,
          longitude: center.longitude,
          latitudeDelta: delta || DEFAULT_LAT_DELTA,
          longitudeDelta: delta || DEFAULT_LONG_DELTA,
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
        {showSmallMarker && lat && long && (
          <Marker
            coordinate={{
              latitude: lat,
              longitude: long,
            }}
            image={customMarkerImage || PropertyMedia}
            anchor={{ x: 0.5, y: 0.5 }}
          />
        )}
        {showRadius && (
          <Circle
            center={{ ...center }}
            radius={radiusInMeters || 5000}
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
        {nearby?.map((nearby, i) => (
          <CustomNearbyMarker
            key={nearby.name + i}
            onPress={(data) => {}}
            nearby={nearby}
          />
        ))}
      </MapView>
    </>
  );
});

export default memo(Map);

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
