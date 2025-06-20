import { Box, Button, Text, View } from '@/components/ui';
import { RefreshControl } from 'react-native';
import React from 'react';
import { hapticFeed } from '@/components/HapticTab';
import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import { FlashList } from '@shopify/flash-list';
import { useRefresh } from '@react-native-community/hooks';
import TopLocationItem from '@/components/property/TopLocationItem';

export type Locations = {
	id: string;
	name: string;
	properties: number;
	banner: any;
}[];

export default function PropertySections() {
	const fetch = () => {
		return new Promise((resolve) => setTimeout(resolve, 5000));
	};

	const { isRefreshing, onRefresh } = useRefresh(fetch);
	const data: Locations = [
		{
			id: 'dhghg662389kndnc',
			name: 'Lekki',
			properties: 55,
			banner: require('@/assets/images/locations/location6.png'),
		},
		{
			id: 'dhghg6623ds66skndnc',
			name: 'Port Harcourt',
			properties: 75,
			banner: require('@/assets/images/locations/location5.png'),
		},
		{
			id: 'dhgdsbj332389kndnc',
			name: 'Abuja',
			properties: 20,
			banner: require('@/assets/images/locations/location4.png'),
		},
		{
			id: 'dhghg66mdm89kndnc',
			name: 'Victoria Island',
			properties: 30,
			banner: require('@/assets/images/locations/location3.png'),
		},
		{
			id: 'dhejdkd66skndnc',
			name: 'Warri',
			properties: 15,
			banner: require('@/assets/images/locations/location2.png'),
		},
		{
			id: 'dhgdscxskk89kndnc',
			name: 'Enugu',
			properties: 4,
			banner: require('@/assets/images/locations/location1.png'),
		},
	];
	return (
		<>
			<Box className="flex-1 px-4">
				<FlashList
					data={data}
					renderItem={({ item }) => <TopLocationItem data={item} />}
					numColumns={2}
					horizontal={false}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						paddingTop: 8,
					}}
					refreshControl={
						<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
					}
					estimatedItemSize={200}
					ListHeaderComponent={() => (
						<View className=" my-4 items-center">
							<Text>Find the best recommended places to live</Text>
						</View>
					)}
					keyExtractor={(item) => item.id}
					ItemSeparatorComponent={() => <View className="h-4" />}
					contentInsetAdjustmentBehavior="automatic"
					ListEmptyComponent={() => (
						<BodyScrollView
							contentContainerStyle={{
								alignItems: 'flex-start',
								paddingTop: 100,
							}}>
							<Button
								onPress={() => {
									hapticFeed();
									// router.push(newProductHref);
								}}>
								Add the first property
							</Button>
						</BodyScrollView>
					)}
				/>
			</Box>
		</>
	);
}
