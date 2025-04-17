import { Property } from '@/components/home/FoundProperties';
import { ImageBackground, Text, View } from '@/components/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo } from 'react';

const data: Property[] = [
	{
		id: 'dhghg662389kndnc',
		name: 'Babylon House',
		location: 'Emma Estate, Slaughter',
		price: 2500000,
		banner: require('@/assets/images/property/property1.png'),
		images: [],
	},
	{
		id: 'dhghg6623ds66skndnc',
		name: 'Topaz Villa',
		location: 'Emma Estate, Slaughter',
		price: 1500000,
		banner: require('@/assets/images/property/property2.png'),
		images: [],
	},
	{
		id: 'dhgdsbj332389kndnc',
		name: 'Great House',
		location: 'Green Estate, Rumuomasi',
		price: 2000000,
		banner: require('@/assets/images/property/property1.png'),
		images: [],
	},
];

export default function PropertyItem() {
	const router = useRouter();
	const { propertyId } = useLocalSearchParams() as { propertyId: string };
	const property = useMemo(() => {
		return data.find((item) => item.id === propertyId);
	}, [propertyId]);

	if (!property) return null;

	return (
		<View>
			<ImageBackground
				source={property.banner}
				style={{ height: 374 }}
				className=" justify-end">
				<Text>{property.name}</Text>
			</ImageBackground>
		</View>
	);
}
