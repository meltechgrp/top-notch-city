import { useEffect } from 'react';
import { ImageSourcePropType, ScrollView } from 'react-native';
import { useRefresh } from '@react-native-community/hooks';
import eventBus from '@/lib/eventBus';
import TopLocation from './TopLocation';
import { useRouter } from 'expo-router';

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
export default function TopLocationsHorizontalList(props: Props) {
	const router = useRouter();
	const fetch = () => {
		return new Promise((resolve) => setTimeout(resolve, 5000));
	};

	const { isRefreshing, onRefresh } = useRefresh(fetch);
	const data = [
		{
			id: 'dhghg662389kndnc',
			name: 'Port Harcourt',
			image: require('@/assets/images/locations/location6.png'),
		},
		{
			id: 'dhghg6623ds66skndnc',
			name: 'Lekki',
			image: require('@/assets/images/locations/location5.png'),
		},
		{
			id: 'dhgdsbj332389kndnc',
			name: 'Enugu',
			image: require('@/assets/images/locations/location4.png'),
		},
		{
			id: 'dhgdsbj3589389kndnc',
			name: 'Rivers',
			image: require('@/assets/images/locations/location3.png'),
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
			horizontal
			contentContainerClassName="gap-x-4 px-4"
			pagingEnabled
			showsHorizontalScrollIndicator={false}
			snapToInterval={238 + 4}
			snapToAlignment="center"
			decelerationRate="fast">
			{data.map((location) => (
				<TopLocation
					onPress={() =>
						router.push({
							pathname: '/property/locations/[locationId]',
							params: { locationId: location.id },
						})
					}
					{...location}
					key={location.id}
				/>
			))}
		</ScrollView>
	);
}
