import React, { ReactNode, useEffect, useMemo, useRef } from 'react';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Layout from '@/constants/Layout';
import { CustomPropertyMarker } from './CustomPropertyMarker';
import Platforms from '@/constants/Plaforms';
import PropertyMedia from '@/assets/images/property.png';
import { Colors } from '@/constants/Colors';
import { useResolvedTheme } from '../ui';
import useGetLocation from '@/hooks/useGetLocation';

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
}

const DEFAULT_LAT_DELTA = 0.2;
const DEFAULT_LONG_DELTA = 0.1;
export default function Map(props: MapProps) {
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
	} = props;
	const theme = useResolvedTheme();
	const mapRef = useRef<MapView>(null);
	const current = markers ? markers[1] : null;
	const { latitude, longitude } = useMemo(
		() => ({
			latitude: current?.address?.latitude || lat || 4.8156,
			longitude: current?.address?.longitude || long || 7.0498,
		}),
		[lat, long, current]
	);

	return (
		<>
			<MapView
				ref={mapRef}
				style={{ width: '100%', height: height || Layout.window.height }}
				provider={Platforms.isAndroid() ? PROVIDER_GOOGLE : undefined}
				zoomEnabled
				loadingEnabled
				onDoublePress={onDoublePress}
				loadingBackgroundColor={
					theme == 'dark' ? Colors.light.background : Colors.dark.background
				}
				loadingIndicatorColor={
					theme == 'dark' ? Colors.dark.tint : Colors.light.tint
				}
				showsCompass={false}
				customMapStyle={
					theme === 'dark' && Platforms.isAndroid() ? mapStyleDark : []
				}
				zoomControlEnabled={zoomControlEnabled}
				compassOffset={{ x: 10, y: 50 }}
				scrollEnabled={scrollEnabled}
				region={{
					latitudeDelta: DEFAULT_LAT_DELTA,
					longitudeDelta: DEFAULT_LONG_DELTA,
					latitude,
					longitude,
				}}>
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
				{!current && latitude && longitude && (
					<Marker
						coordinate={{
							latitude: latitude,
							longitude: longitude,
						}}
						// image={customMarkerImage || PropertyMedia}
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
}

// constants/mapStyleDark.ts
export const mapStyleDark = [
	{
		elementType: 'geometry',
		stylers: [{ color: '#1d1d1d' }],
	},
	{
		elementType: 'labels.text.fill',
		stylers: [{ color: '#d5d5d5' }],
	},
	{
		elementType: 'labels.text.stroke',
		stylers: [{ color: '#1d1d1d' }],
	},
	{
		featureType: 'administrative',
		elementType: 'labels.text.fill',
		stylers: [{ color: '#9e9e9e' }],
	},
	{
		featureType: 'poi',
		elementType: 'geometry',
		stylers: [{ color: '#2b2b2b' }],
	},
	{
		featureType: 'poi',
		elementType: 'labels.text.fill',
		stylers: [{ color: '#a5a5a5' }],
	},
	{
		featureType: 'poi.park',
		elementType: 'geometry',
		stylers: [{ color: '#263c3f' }],
	},
	{
		featureType: 'poi.park',
		elementType: 'labels.text.fill',
		stylers: [{ color: '#6b9a76' }],
	},
	{
		featureType: 'road',
		elementType: 'geometry.fill',
		stylers: [{ color: '#2c2c2c' }],
	},
	{
		featureType: 'road',
		elementType: 'geometry',
		stylers: [{ color: '#383838' }],
	},
	{
		featureType: 'road',
		elementType: 'labels.text.fill',
		stylers: [{ color: '#8a8a8a' }],
	},
	{
		featureType: 'road.arterial',
		elementType: 'geometry',
		stylers: [{ color: '#454545' }],
	},
	{
		featureType: 'road.highway',
		elementType: 'geometry',
		stylers: [{ color: '#3c3c3c' }],
	},
	{
		featureType: 'road.highway.controlled_access',
		elementType: 'geometry',
		stylers: [{ color: '#4e4e4e' }],
	},
	{
		featureType: 'road.local',
		elementType: 'geometry',
		stylers: [{ color: '#2e2e2e' }],
	},
	{
		featureType: 'transit',
		elementType: 'geometry',
		stylers: [{ color: '#2f2f2f' }],
	},
	{
		featureType: 'transit.station',
		elementType: 'labels.text.fill',
		stylers: [{ color: '#d59563' }],
	},
	{
		featureType: 'water',
		elementType: 'geometry',
		stylers: [{ color: Colors.light.background }],
	},
	{
		featureType: 'water',
		elementType: 'labels.text.fill',
		stylers: [{ color: '#3d3d3d' }],
	},
];
