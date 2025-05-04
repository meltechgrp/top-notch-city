import { Callout, Marker } from 'react-native-maps';
import CustomMarkerPointer from './CustomMarkerPointer';
import { StyleSheet, View } from 'react-native';
import { Image, Text } from '../ui';

type Props = {
	property: {
		name: string;
		description: string;
		image: any;
		latitude: number;
		longitude: number;
	};
};

export function CustomPropertyMarker({ property }: Props) {
	const { longitude, latitude, name, image, description } = property;

	return (
		<Marker
			coordinate={{ latitude: latitude, longitude: longitude }}
			title={name}
			description={description}
			anchor={{ x: 0.5, y: 0.5 }}>
			{/* <CustomMarkerPointer image={image} /> */}
			{/* <Callout tooltip>
				<View
					style={styles.calloutContainer}
					className="w-56 rounded-xl bg-white p-2">
					<Image
						source={image}
						className="w-full h-24 rounded-lg"
						resizeMode="cover"
						alt={name}
					/>
					<View className=" mt-2">
						<Text size="lg">{name}</Text>
						<Text numberOfLines={2} size="sm" className=" mt-1 text-[#555]">
							{description}
						</Text>
						<Text size="lg">₦150,000</Text>
					</View>
				</View>
			</Callout> */}
		</Marker>
	);
}

const styles = StyleSheet.create({
	calloutContainer: {
		shadowColor: '#000',
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 4,
	},
});
