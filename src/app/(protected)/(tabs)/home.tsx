import DiscoverProperties from '@/components/home/DiscoverProperties';
import FeaturedProperties from '@/components/home/featured';
import TopProperties from '@/components/home/properties';
import TopLocations from '@/components/home/topLocations';
import BeachPersonWaterParasolIcon from '@/components/icons/BeachPersonWaterParasolIcon';
import { Box, Text, View } from '@/components/ui';
import eventBus from '@/lib/eventBus';
import { useRefresh } from '@react-native-community/hooks';
import { ListRenderItem } from '@shopify/flash-list';
import React from 'react';
import { FlatList, RefreshControl } from 'react-native';

export default function HomeScreen() {
	const fetch = () => {
		return new Promise((resolve) => setTimeout(resolve, 2000));
	};

	const { isRefreshing, onRefresh } = useRefresh(fetch);
	const feedList = React.useMemo(() => {
		const topLocations = {
			id: 'locations',
			_typename: 'Locations',
		} as any;
		const populerCommunities = {
			id: 'featured',
			__typename: 'Featured',
		} as any;
		const properties = {
			id: 'properties',
			_typename: 'Properties',
		} as any;
		const bottomPlaceHolder = {
			id: 'bottomPlaceHolder',
			__typename: 'bottomPlaceHolder',
		} as any;
		return [topLocations, populerCommunities, properties, bottomPlaceHolder];
	}, []);
	type FeedList = any;
	const renderItem: ListRenderItem<FeedList> = ({ item }) => {
		if (item.id === 'locations') {
			return <TopLocations />;
		}
		if (item.id === 'featured') {
			return <FeaturedProperties />;
		}
		if (item.id === 'properties') {
			return <TopProperties />;
		}
		if (item.id === 'bottomPlaceHolder') {
			return <View className="h-24" />;
		}
		return <View></View>;
	};
	return (
		<Box className="flex-1 ">
			<FlatList
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
				showsVerticalScrollIndicator={false}
				data={feedList}
				keyExtractor={(item) => item.id}
				renderItem={renderItem as any}
				ItemSeparatorComponent={() => (
					<View style={[{ height: 1 }]} className="bg-background-500" />
				)}
				ListEmptyComponent={isRefreshing ? null : EmptyFeed}
			/>
		</Box>
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
