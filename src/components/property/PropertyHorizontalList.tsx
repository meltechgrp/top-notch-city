import PropertyListItem from '@/components/property/PropertyListItem';
import { useEffect, useState } from 'react';
import { ImageSourcePropType, ScrollView } from 'react-native';
import { View } from '@/components/ui';
import { useRefresh } from '@react-native-community/hooks';
import eventBus from '@/lib/eventBus';

type Props = {
	category?: string;
	fullWidth?: boolean;
	emptyState?: React.ReactNode;
};

export default function PropertyHorizontalList(props: Props) {
	const { category, fullWidth = true, emptyState } = props;
	const [refreshing, setRefreshing] = useState(false);

	// async function onRefresh() {
	// 	try {
	// 		setRefreshing(true);
	// 		refetch && (await refetch());
	// 	} catch (error) {
	// 	} finally {
	// 		setRefreshing(false);
	// 	}
	// }
	// useEffect(() => {
	// 	eventBus.addEventListener('PROPERTY_HORIZONTAL_LIST_REFRESH', onRefresh);

	// 	return () => {
	// 		eventBus.removeEventListener(
	// 			'PROPERTY_HORIZONTAL_LIST_REFRESH',
	// 			onRefresh
	// 		);
	// 	};
	// }, []);

	// if (isRefreshing) {
	// 	return (
	// 		<View className="flex-row gap-x-4 ml-4">
	// 			{[1, 2].map((key) => (
	// 				<PropertyOverviewSkeleton key={key} />
	// 			))}
	// 		</View>
	// 	);
	// }

	return (
		<ScrollView
			horizontal
			contentContainerClassName="gap-x-4 pl-4"
			pagingEnabled
			showsHorizontalScrollIndicator={false}
			snapToInterval={238 + 4}
			snapToAlignment="center"
			decelerationRate="fast">
			{/* {data.map((property) => (
				<PropertyListItem
					key={property.id}
					data={property}
					isHorizantal={true}
					className={'w-[238px]'}
				/>
			))} */}
		</ScrollView>
	);
}
