import { useEffect } from 'react';
import { ImageSourcePropType, ScrollView } from 'react-native';
import { useRefresh } from '@react-native-community/hooks';
import eventBus from '@/lib/eventBus';
import PropertyListItem from '@/components/property/PropertyListItem';

type Props = {
	category?: string;
	fullWidth?: boolean;
	emptyState?: React.ReactNode;
};

export type Property = {
	id: string;
	name: string;
	location: string;
	price: number;
	banner: ImageSourcePropType;
	images: string[];
};
export default function TopPropertiesVerticalList(props: Props) {
	const fetch = () => {
		return new Promise((resolve) => setTimeout(resolve, 5000));
	};

	const { isRefreshing, onRefresh } = useRefresh(fetch);
	const data = [
		{
			id: 'dhghg37i8jhbds2389kndnc',
			name: 'Karty Mansion',
			location: 'Warri, Delta State',
			price: 2500000,
			banner: require('@/assets/images/property/property1.png'),
		},
		{
			id: 'dhghg6dfnbsbxs66skndnc',
			name: 'Fortune Caste',
			location: 'Benin City, Edo State',
			price: 1500000,
			banner: require('@/assets/images/property/property2.png'),
		},
		{
			id: 'dhgddxcsjjkwe2389kndnc',
			name: 'Great House',
			location: 'Green Estate, Rumuomasi',
			price: 2000000,
			banner: require('@/assets/images/property/property1.png'),
		},
		{
			id: 'dhgds387iu3j29kndnc',
			name: 'Fortune Caste',
			location: 'Benin City, Edo State',
			price: 1500000,
			banner: require('@/assets/images/property/property2.png'),
		},
	];

	useEffect(() => {
		onRefresh();
		eventBus.addEventListener('PROPERTY_HORIZONTAL_LIST_REFRESH', onRefresh);

		return () => {
			eventBus.removeEventListener(
				'PROPERTY_HORIZONTAL_LIST_REFRESH',
				onRefresh
			);
		};
	}, []);

	return (
		<ScrollView
			// horizontal
			contentContainerClassName="gap-y-4 px-4"
			pagingEnabled
			showsHorizontalScrollIndicator={false}
			snapToInterval={238 + 4}
			snapToAlignment="center"
			decelerationRate="fast">
			{data.map((location) => (
				<PropertyListItem
					className="w-full"
					data={location as any}
					key={location.id}
					showFacilites={true}
				/>
			))}
		</ScrollView>
	);
}
