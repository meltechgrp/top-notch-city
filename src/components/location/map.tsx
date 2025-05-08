import { useMemo } from 'react';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Layout from '@/constants/Layout';
import { CustomPropertyMarker } from './CustomPropertyMarker';
import Platforms from '@/constants/Plaforms';

export type MarkerData = {
	id: string;
	name: string;
	latitude: number;
	longitude: number;
	description: string;
	image: any;
};
interface MapProps {
	latitude?: number;
	longitude?: number;
	height?: number;
	showUserLocation?: boolean;
	scrollEnabled?: boolean;
	showsBuildings?: boolean;
	activeMarker?: MarkerData;
	onMarkerPress?: (data: MarkerData) => void;
	zoomControlEnabled?: boolean;
	markers?: MarkerData[];
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
		zoomControlEnabled = false,
		scrollEnabled = true,
		showUserLocation = false,
		showsBuildings = true,
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

	return (
		<>
			<MapView
				style={{ width: '100%', height: height || Layout.window.height }}
				provider={Platforms.isAndroid() ? PROVIDER_GOOGLE : undefined}
				zoomEnabled
				loadingEnabled
				showsScale={true}
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
