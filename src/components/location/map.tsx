import React, { ReactNode, useMemo } from 'react';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Layout from '@/constants/Layout';
import { CustomPropertyMarker } from './CustomPropertyMarker';
import Platforms from '@/constants/Plaforms';
import propertyImage from '@/assets/images/property.png';
import { useTheme } from '../layouts/ThemeProvider';
import { Colors } from '@/constants/Colors';

export type MarkerData = {
	name: string;
	latitude: number;
	longitude: number;
	image?: any;
};
interface MapProps {
	latitude?: number;
	longitude?: number;
	height?: number;
	showUserLocation?: boolean;
	scrollEnabled?: boolean;
	showsBuildings?: boolean;
	activeMarker?: MarkerData;
	children?: ReactNode;
	onMarkerPress?: (data: MarkerData) => void;
	zoomControlEnabled?: boolean;
	markers?: MarkerData[];
	marker?: LocationData;
	showRadius?: boolean;
	radiusInMeters?: number;
	customMarkerImage?: any;
}
const DEFAULT_LAT_DELTA = 0.0922;
const DEFAULT_LONG_DELTA = 0.0421;
export default function Map(props: MapProps) {
	const {
		latitude,
		longitude,
		height,
		markers,
		onMarkerPress,
		zoomControlEnabled = true,
		scrollEnabled = true,
		showUserLocation = false,
		showsBuildings = true,
		showRadius,
		radiusInMeters,
		customMarkerImage,
		marker,
	} = props;
	const { theme } = useTheme();
	const initialRegion = useMemo(
		() => ({
			latitude: latitude || 4.8156,
			longitude: longitude || 7.0498,
			latitudeDelta: DEFAULT_LONG_DELTA,
			longitudeDelta: DEFAULT_LAT_DELTA,
		}),
		[latitude, longitude]
	);

	return (
		<>
			<MapView
				style={{ width: '100%', height: height || Layout.window.height }}
				provider={Platforms.isAndroid() ? PROVIDER_GOOGLE : undefined}
				zoomEnabled
				loadingEnabled
				loadingBackgroundColor={
					theme == 'dark' ? Colors.light.background : Colors.dark.background
				}
				loadingIndicatorColor={
					theme == 'dark' ? Colors.dark.tint : Colors.light.tint
				}
				showsCompass={true}
				showsBuildings={showsBuildings}
				showsTraffic={true}
				zoomControlEnabled={zoomControlEnabled}
				followsUserLocation={showUserLocation}
				showsUserLocation={showUserLocation}
				showsMyLocationButton={showUserLocation}
				compassOffset={{ x: 10, y: 50 }}
				scrollEnabled={scrollEnabled}
				region={initialRegion}>
				{marker && (
					<Marker
						coordinate={{
							latitude: marker.latitude,
							longitude: marker.longitude,
						}}
						image={customMarkerImage || propertyImage}
						anchor={{ x: 0.5, y: 0.5 }}
					/>
				)}
				{latitude && longitude && (
					<Marker
						coordinate={{
							latitude: latitude,
							longitude: longitude,
						}}
						image={customMarkerImage || propertyImage}
						anchor={{ x: 0.5, y: 0.5 }}
					/>
				)}
				{latitude && longitude && showRadius && (
					<Circle
						center={{ latitude, longitude }}
						radius={radiusInMeters || 5000} // default 5km
						fillColor="rgba(0, 0, 0, 0.1)"
						strokeColor="rgba(241, 96, 0, 0.6)"
						strokeWidth={5}
					/>
				)}
				{markers?.map((place) => (
					<CustomPropertyMarker
						key={place.name}
						onPress={(data) => onMarkerPress && onMarkerPress(data)}
						property={place}
					/>
				))}
			</MapView>
		</>
	);
}
