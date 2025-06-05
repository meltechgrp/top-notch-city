import React, { useCallback, useState } from 'react';
import Map from '../location/map';
import Layout from '@/constants/Layout';
import { Modal, Pressable, View } from 'react-native';
import { Icon, useResolvedTheme } from '../ui';
import { X } from 'lucide-react-native';
import { WebView } from 'react-native-webview';
import { usePropertyStore } from '@/store/propertyStore';
import { Colors } from '@/constants/Colors';

type CustomCenterSheetProps = {
	type?: 'map' | 'street';
};

const MapApiKey = process.env.EXPO_PUBLIC_ANDROID_MAPS_API_KEY;

export function CustomCenterSheet({ type }: CustomCenterSheetProps) {
	const [open, setOpen] = useState(false);
	const theme = useResolvedTheme();
	const { details } = usePropertyStore();
	if (!details) return null;
	function handleDismiss() {
		setOpen(false);
	}
	const { longitude, latitude } = details.address;
	const MODAL_WIDTH = Math.round(Layout.window.width * 0.85);
	const MODAL_HEIGHT = Math.round(Layout.window.height * 0.7);
	const MINI_HEIGHT = Math.round(Layout.window.height * 0.3);
	const MINI_WIDTH = Math.round(Layout.window.width);
	const streetView = `<!DOCTYPE html>
<html>
  <head>
    <title>Custom Street View</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      html, body, #map {
        height: 100%;
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
			.gmnoprint {
				display: none;
			}
			.gm-style-cc {
				display: none;
			}
    </style>
    <script
      src="https://maps.googleapis.com/maps/api/js?key=${MapApiKey}"
      defer
    ></script>
    <script>
      function initMap() {
        const location = { lat: ${latitude}, lng: ${longitude} };

        const panorama = new google.maps.StreetViewPanorama(document.getElementById("map"), {
          position: location,
          pov: {
            heading: 34,
            pitch: 10,
          },
          disableDefaultUI: true, // Hides compass, zoom, street labels, etc.
          showRoadLabels: false,
        });

        const map = new google.maps.Map(document.getElementById("map"), {
          center: location,
          zoom: 1,
          streetView: panorama,
          disableDefaultUI: true,
        });
      }

      window.initMap = initMap;
    </script>
  </head>
  <body>
    <div id="map"></div>
    <script>
      // Wait for the API script to load then run the init function
      if (typeof google !== "undefined") {
        initMap();
      } else {
        const scriptCheck = setInterval(() => {
          if (typeof google !== "undefined") {
            clearInterval(scriptCheck);
            initMap();
          }
        }, 100);
      }
    </script>
  </body>
</html>
`;
	return (
		<>
			<Pressable
				onPress={() => setOpen(true)}
				style={{ height: MINI_HEIGHT }}
				className="flex-1 bg-background-muted relative overflow-hidden">
				{type == 'map' ? (
					<Map
						height={MINI_HEIGHT}
						latitude={latitude}
						longitude={longitude}
						scrollEnabled={false}
						showRadius
						radiusInMeters={2000}
					/>
				) : (
					<WebView
						source={{ html: streetView }}
						style={{
							flex: 1,
							backgroundColor:
								theme == 'light'
									? Colors.dark.background
									: Colors.light.background,
						}}
						originWhitelist={['*']}
						javaScriptEnabled
						scrollEnabled={false}
						className="bg-background-muted"
						domStorageEnabled
						containerStyle={{
							backgroundColor:
								theme == 'light'
									? Colors.dark.background
									: Colors.light.background,
						}}
						startInLoadingState
					/>
				)}
				{type == 'street' && (
					<View className=" absolute z-10 top-0 w-full h-full bg-black/20" />
				)}
			</Pressable>

			<Modal
				animationType="fade"
				visible={open}
				transparent
				onRequestClose={handleDismiss}>
				<View
					className="flex-1 items-center justify-center bg-black/30"
					onTouchEnd={handleDismiss}>
					<View
						style={{
							width: MODAL_WIDTH,
							height: MODAL_HEIGHT,
						}}
						className="bg-background-muted rounded-2xl overflow-hidden relative"
						onTouchEnd={(ev) => ev.stopPropagation()} // prevent dismiss
					>
						{type == 'map' ? (
							<Map
								latitude={latitude}
								longitude={longitude}
								height={MODAL_HEIGHT}
								scrollEnabled={true}
								showRadius
								radiusInMeters={5000}
							/>
						) : (
							<WebView
								source={{ html: streetView }}
								style={{ flex: 1 }}
								originWhitelist={['*']}
								javaScriptEnabled
								domStorageEnabled
								startInLoadingState
							/>
						)}

						<Pressable
							onPress={handleDismiss}
							className="absolute top-3 right-3 bg-background-muted p-2 rounded-full items-center justify-center z-10">
							<Icon as={X} />
						</Pressable>
					</View>
				</View>
			</Modal>
		</>
	);
}
