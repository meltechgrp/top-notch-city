import { useMemo } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Layout from '@/constants/Layout';
import { CustomPropertyMarker } from './CustomPropertyMarker';

interface MapProps {
	latitude?: number;
	longitude?: number;
	height?: number;
	showUserLocation?: boolean;
	scrollEnabled?: boolean;
	user: {
		fullName: string;
		photoPath?: string;
	};
}
const DEFAULT_LAT_DELTA = 0.0922;
const DEFAULT_LONG_DELTA = 0.0421;
export default function Map(props: MapProps) {
	const {
		latitude,
		longitude,
		height,
		scrollEnabled = true,
		showUserLocation = false,
	} = props;

	const initialRegion = useMemo(
		() => ({
			latitude: latitude || 4.8156,
			longitude: longitude || 7.0498,
			latitudeDelta: DEFAULT_LONG_DELTA,
			longitudeDelta: DEFAULT_LAT_DELTA,
		}),
		[latitude, longitude]
	);
	const portHarcourtPlaces = [
		{
			name: 'Pleasure Park',
			latitude: 4.8156,
			longitude: 7.0316,
			description:
				'A beautiful recreational park with a lake, walking trails, and family activities.',
			image: require('@/assets/images/property/property1.png'),
		},
		{
			name: 'Port Harcourt Zoo',
			latitude: 4.8592,
			longitude: 7.0609,
			description:
				'A wildlife reserve and zoo showcasing native and exotic animals.',
			image: require('@/assets/images/property/property2.png'),
		},
		{
			name: 'Isaac Boro Park',
			latitude: 4.8103,
			longitude: 7.019,
			description:
				'A historical park named after a national hero, often used for public events and relaxation.',
			image: require('@/assets/images/property/property1.png'),
		},
		{
			name: 'Port Harcourt Mall',
			latitude: 4.812,
			longitude: 7.0339,
			description:
				'A large shopping mall with restaurants, cinemas, and fashion outlets.',
			image: require('@/assets/images/property/property2.png'),
		},
		{
			name: 'Rivers State Museum',
			latitude: 4.7824,
			longitude: 7.0132,
			description:
				'A museum that preserves the cultural heritage of the Rivers people.',
			image: require('@/assets/images/property/property1.png'),
		},
		{
			name: 'Air Assault Golf Course',
			latitude: 4.8424,
			longitude: 7.0349,
			description:
				'A scenic 18-hole golf course with a clubhouse and restaurant.',
			image: require('@/assets/images/property/property2.png'),
		},
		{
			name: 'Rumuokoro Market',
			latitude: 4.8665,
			longitude: 6.9919,
			description:
				'A bustling local market where you can find fresh produce and goods.',
			image: require('@/assets/images/property/property1.png'),
		},
		{
			name: 'Genesis Deluxe Cinemas',
			latitude: 4.8106,
			longitude: 7.0337,
			description:
				'A modern cinema complex in the heart of Port Harcourt Mall.',
			image: require('@/assets/images/property/property2.png'),
		},
		{
			name: 'The Dome Church',
			latitude: 4.861,
			longitude: 7.034,
			description:
				'A large Christian worship center known for its architecture and congregation.',
			image: require('@/assets/images/property/property1.png'),
		},
		{
			name: 'GRA Phase 2 Nightlife Area',
			latitude: 4.8356,
			longitude: 7.0134,
			description:
				'Popular district with lounges, bars, and restaurants for nightlife.',
			image: require('@/assets/images/property/property2.png'),
		},
	];

	return (
		<MapView
			style={{ width: '100%', height: height || Layout.window.height }}
			provider={PROVIDER_GOOGLE}
			// onMapLoaded={() => console.log('Map loaded')}
			zoomEnabled
			loadingEnabled
			showsScale={true}
			showsCompass={true}
			zoomControlEnabled={true}
			followsUserLocation={true}
			showsUserLocation={true}
			showsMyLocationButton={true}
			compassOffset={{ x: 10, y: 50 }}
			scrollEnabled={scrollEnabled}
			region={initialRegion}>
			{portHarcourtPlaces.map((place) => (
				<CustomPropertyMarker key={place.name} property={place} />
			))}
		</MapView>
	);
}
