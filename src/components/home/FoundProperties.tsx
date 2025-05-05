import { cn } from '@/lib/utils';
import { useEffect } from 'react';
import { ImageSourcePropType, ScrollView } from 'react-native';
import { View } from '@/components/ui';
import { useRefresh } from '@react-native-community/hooks';
import eventBus from '@/lib/eventBus';
import HorizontalListItem from '../property/HorizontalListItem';

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
export default function FoundHorizontalList(props: Props) {
	const { category, fullWidth = true, emptyState } = props;

	const fetch = () => {
		return new Promise((resolve) => setTimeout(resolve, 5000));
	};

	const { isRefreshing, onRefresh } = useRefresh(fetch);
	const data: Property[] = [
		{
			id: 'dhghdwkmkcdndnc',
			name: 'Wings Tower',
			location: 'Emma Estate, Trans Amadi',
			price: 2500000,
			banner: require('@/assets/images/property/property6.png'),
			images: [],
		},
		{
			id: 'dhgxscndddds66skndnc',
			name: 'Topaz Villa',
			location: 'Emma Estate, Slaughter',
			price: 1500000,
			banner: require('@/assets/images/property/property5.png'),
			images: [],
		},
		{
			id: 'ddmkldemklefndnc',
			name: 'Great House',
			location: 'Green Estate, Rumuomasi',
			price: 2000000,
			banner: require('@/assets/images/property/property4.png'),
			images: [],
		},
		{
			id: 'dhgdekklmeddnc',
			name: 'Gracie Home',
			location: 'Emma Estate, Ada George',
			price: 2500000,
			banner: require('@/assets/images/property/property2.png'),
			images: [],
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

	if (!data.length && emptyState) {
		return null;
	}

	return (
		<View>
			<ScrollView
				horizontal
				contentContainerClassName="gap-x-4 pl-4"
				pagingEnabled
				showsHorizontalScrollIndicator={false}
				snapToInterval={238 + 4}
				snapToAlignment="center"
				decelerationRate="fast">
				{data.map((property) => (
					<HorizontalListItem
						key={property.id}
						data={property}
						className={cn(fullWidth ? '' : 'w-[238px]')}
					/>
				))}
			</ScrollView>
		</View>
	);
}
