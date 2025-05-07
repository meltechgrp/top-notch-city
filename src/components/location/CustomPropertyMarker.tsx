import { Marker } from 'react-native-maps';
import propertyImage from '@/assets/images/property.png';
import { useState } from 'react';
import PropertyBottomSheet from './PropertyBottomSheet';
import { Image, View } from '../ui';

interface Props {
	property: {
		name: string;
		description: string;
		image: any;
		latitude: number;
		longitude: number;
	};
}

export function CustomPropertyMarker({ property }: Props) {
	const { longitude, latitude } = property;
	const [selectedMarker, setSelectedMarker] = useState<
		Props['property'] | null
	>(null);

	return (
		<>
			<Marker
				coordinate={{ latitude: latitude, longitude: longitude }}
				onPress={() => setSelectedMarker(property)}
				// style={{ height: 50, width: 38 }}
				image={propertyImage}
				anchor={{ x: 0.5, y: 0.5 }}
			/>
			{selectedMarker && (
				<PropertyBottomSheet
					visible={!!selectedMarker}
					data={selectedMarker}
					onDismiss={() => setSelectedMarker(null)}
				/>
			)}
		</>
	);
}
