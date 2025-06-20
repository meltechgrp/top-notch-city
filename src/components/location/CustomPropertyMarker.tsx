import { Marker } from 'react-native-maps';
import PropertyMedia from '@/assets/images/property.png';

interface Props {
	property: Property;
	onPress: (data: Property) => void;
}

export function CustomPropertyMarker({ property, onPress }: Props) {
	const { address } = property;
	return (
		<>
			<Marker
				coordinate={{
					latitude: address?.latitude,
					longitude: address?.longitude,
				}}
				onPress={() => onPress(property)}
				image={PropertyMedia}
				anchor={{ x: 0.5, y: 0.5 }}
			/>
		</>
	);
}
