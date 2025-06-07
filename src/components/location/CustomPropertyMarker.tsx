import { Marker } from 'react-native-maps';
import PropertyMedia from '@/assets/images/property.png';
import { MarkerData } from './map';

interface Props {
	property: MarkerData;
	onPress: (data: MarkerData) => void;
}

export function CustomPropertyMarker({ property, onPress }: Props) {
	const { longitude, latitude } = property;
	return (
		<>
			<Marker
				coordinate={{ latitude: latitude, longitude: longitude }}
				onPress={() => onPress(property)}
				image={PropertyMedia}
				anchor={{ x: 0.5, y: 0.5 }}
			/>
		</>
	);
}
