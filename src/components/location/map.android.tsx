import React, { memo, ReactNode, useEffect, useState } from "react";
import { useResolvedTheme } from "../ui";
import { WebView } from "react-native-webview";
import { getRegionForMarkers } from "@/lib/utils";
import { generateMediaUrl } from "@/lib/api";

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
  const markerJS = markers?.map((m) => Marker({ property: m })).join("\n");

  const html = `
  <html>
    <head>
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      crossorigin=""
    />
    <script
      src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
      crossorigin=""
    ></script>
    </head>
    <body style="margin:0">
      <div id="map" style="width:100%;height:100vh"></div>
      
      <script>
      const map = L.map("map").setView([${location.latitude}, ${location.longitude}], 13);

      const tiles = L.tileLayer(
        "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }
      ).addTo(map);

        ${markerJS}
    </script>
    </body>
  </html>
`;
  useEffect(() => {
    (async () => {
      if (markers && markers.length > 0) {
        const region = getRegionForMarkers(
          markers.map((m) => ({
            latitude: m.address.latitude,
            longitude: m.address.longitude,
          }))
        );

        setLocation({
          latitude: region.latitude,
          longitude: region.longitude,
        });
      }
    })();
  }, [markers?.length]);
  return (
    <>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        onMessage={(event) => {
          const data = JSON.parse(event.nativeEvent.data);
          console.log(data, event);
          onMarkerPress?.(data);
        }}
        style={{ flex: 1 }}
      />
    </>
  );
};

export default memo(Map);

interface MarkerProps {
  property: Property;
}

function Marker({ property }: MarkerProps) {
  const { latitude, longitude } = property.address;
  const media = property.media.find((item) => item.media_type == "IMAGE")!;
  const image = generateMediaUrl(media)?.uri;
  return `
        L.marker([${latitude}, ${longitude}], {
  icon: L.divIcon({
    html: ${JSON.stringify(MarkerIcon({ url: image }))},
    className: '',
    iconSize: [80, 80],
  })
})
.on('click', () => {
  window.ReactNativeWebView.postMessage(${JSON.stringify(property)});
})
.addTo(map)`;
}

interface MarkerIconProps {
  url: string;
}

function MarkerIcon({ url }: MarkerIconProps) {
  return `
      <div style="position: relative; display: flex; justify-content: center; align-items: center;">
        <div style="
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 5px solid #F16000F0;
          overflow: hidden;
          background: white;
        ">
          <img
            src="${url}"
            style="width:100%;height:100%;object-fit:cover"
          />
        </div>
        <div style="
                width: 0;
                height: 0;
                position: absolute;
                bottom: -25;
                right: 18px;
                z-index: 0;
                border-left: 20px solid transparent;
                border-right: 20px solid transparent;
                border-top: 30px solid #F16000F0;
              "></div>
      </div>
    `;
}
