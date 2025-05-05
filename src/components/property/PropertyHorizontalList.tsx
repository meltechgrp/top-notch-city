import PropertyListItem from '@/components/property/PropertyListItem';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { ImageSourcePropType, ScrollView } from 'react-native';
import PropertyOverviewSkeleton from '../skeleton/PropertyOverviewSkeleton';
import { Text, View } from '@/components/ui';
import { useRefresh } from '@react-native-community/hooks';
import eventBus from '@/lib/eventBus';
import BeachPersonWaterParasolIcon from '../icons/BeachPersonWaterParasolIcon';

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
export default function PropertyHorizontalList(props: Props) {
	const { category, fullWidth = true, emptyState } = props;

	const fetch = () => {
		return new Promise((resolve) => setTimeout(resolve, 5000));
	};

	const { isRefreshing, onRefresh } = useRefresh(fetch);
	const data: Property[] = [
		{
			id: 'dhghsnknkl89kndnc',
			name: 'Karty Mansion',
			location: 'Warri, Delta State',
			price: 2500000,
			banner: require('@/assets/images/property/property7.png'),
			images: [],
		},
		{
			id: 'dhghgdwjndws66skndnc',
			name: 'Fortune Caste',
			location: 'Benin City, Edo State',
			price: 1500000,
			banner: require('@/assets/images/property/property4.png'),
			images: [],
		},
		{
			id: 'dhgasdkjfndjkfnekndnc',
			name: 'Great House',
			location: 'Green Estate, Rumuomasi',
			price: 2000000,
			banner: require('@/assets/images/property/property3.png'),
			images: [],
		},
		{
			id: 'dhjnsdjewkjfnekndnc',
			name: 'Comfort Home',
			location: 'Green Estate, Rumuomasi',
			price: 2000000,
			banner: require('@/assets/images/property/property6.png'),
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

	// if (isRefreshing) {
	// 	return (
	// 		<View className="flex-row gap-x-4 ml-4">
	// 			{[1, 2].map((key) => (
	// 				<PropertyOverviewSkeleton key={key} />
	// 			))}
	// 		</View>
	// 	);
	// }

	if (!data.length && emptyState) {
		return <View>{emptyState}</View>;
	}

	return (
		<ScrollView
			horizontal
			contentContainerClassName="gap-x-4 pl-4"
			pagingEnabled
			showsHorizontalScrollIndicator={false}
			snapToInterval={238 + 4}
			snapToAlignment="center"
			decelerationRate="fast">
			{data.map((property) => (
				<PropertyListItem
					key={property.id}
					data={property}
					isHorizantal={true}
					className={'w-[238px]'}
				/>
			))}
		</ScrollView>
	);
}
