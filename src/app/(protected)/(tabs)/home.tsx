import DiscoverProperties from '@/components/home/DiscoverProperties';
import PopulerProperties from '@/components/home/PopularProperties';
import BeachPersonWaterParasolIcon from '@/components/icons/BeachPersonWaterParasolIcon';
import { TrackingFlashlist } from '@/components/TrackingFlatlist';
import { RefreshControl, Text, View } from '@/components/ui';
import eventBus from '@/lib/eventBus';
import { useRefresh } from '@react-native-community/hooks';
import { ListRenderItem } from '@shopify/flash-list';
import { usePathname } from 'expo-router';
import React from 'react';

export default function HomeScreen() {
	const pathname = usePathname();

	const fetch = () => {
		return new Promise((resolve) => setTimeout(resolve, 2000));
	};

	const { isRefreshing, onRefresh } = useRefresh(fetch);
	const feedList = React.useMemo(() => {
		const populerCommunities = {
			id: 'featured',
			__typename: 'Featured',
		} as any;
		const bottomPlaceHolder = {
			id: 'bottomPlaceHolder',
			__typename: 'bottomPlaceHolder',
		} as any;
		return [populerCommunities, bottomPlaceHolder];
	}, []);
	type FeedList = any;
	const renderItem: ListRenderItem<FeedList> = ({ item }) => {
		if (item.id === 'featured') {
			return <PopulerProperties />;
		}
		if (item.id === 'bottomPlaceHolder') {
			return <View className="h-24" />;
		}
		return <View></View>;
	};
	return (
		<View className="flex-1">
			<TrackingFlashlist
				listSource={pathname}
				onEngagementUpdate={() => {}}
				refreshControl={
					<RefreshControl
						refreshing={isRefreshing}
						onRefresh={() => {
							onRefresh();
							eventBus.dispatchEvent('PROPERTY_HORIZONTAL_LIST_REFRESH', null);
						}}
					/>
				}
				ListHeaderComponent={<DiscoverProperties />}
				data={feedList}
				keyExtractor={(item) => item.id}
				renderItem={renderItem as any}
				estimatedItemSize={350}
				ItemSeparatorComponent={() => (
					<View style={[{ height: 1 }]} className="bg-gray-200" />
				)}
				ListEmptyComponent={isRefreshing ? null : EmptyFeed}
			/>
		</View>
	);
}

function EmptyFeed() {
	return (
		<View className="flex-1 items-center justify-center pt-16">
			<BeachPersonWaterParasolIcon width={64} height={64} />
			<Text className="text-black-900 pt-4">Wow, it's lonely here</Text>
			<Text className="text-gray-600 text-sm text-center w-11/12 mx-auto mt-1">
				Try creating a Property to feature them here.
			</Text>
		</View>
	);
}
