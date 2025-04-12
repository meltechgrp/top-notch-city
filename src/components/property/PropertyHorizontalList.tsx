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

	if (isRefreshing) {
		return (
			<View className="flex-row gap-x-4 ml-4">
				{[1, 2].map((key) => (
					<PropertyOverviewSkeleton key={key} />
				))}
			</View>
		);
	}

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
					className={cn(fullWidth ? '' : 'w-[238px]')}
				/>
			))}
		</ScrollView>
	);
}
