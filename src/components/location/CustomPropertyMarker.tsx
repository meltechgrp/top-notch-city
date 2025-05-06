import { Callout, Marker } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import { Button, ButtonText, Image, Text } from '../ui';
import propertyImage from '@/assets/images/property.png';
import { formatMoney } from '@/lib/utils';

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
			style={{ height: 40, width: 30 }}
			image={propertyImage}
			anchor={{ x: 0.5, y: 0.5 }}>
			<Callout tooltip>
				<View
					style={styles.calloutContainer}
					className="w-48 rounded-xl bg-background-muted p-2">
					<Image
						source={image}
						className="w-full h-24 rounded-lg"
						resizeMode="cover"
						alt={name}
					/>
					<View className=" mt-2 items-center">
						<Text size="lg">{name}</Text>
						<Text size="sm" className=" ">
							Property type: Duplex
						</Text>
						<Text size="md">{formatMoney(150000, 'NGN')}</Text>
						<Button className=" bg-primary">
							<ButtonText>View Property</ButtonText>
						</Button>
					</View>
				</View>
			</Callout>
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
