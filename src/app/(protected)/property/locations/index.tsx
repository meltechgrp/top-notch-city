import { Box, Button, Text, View } from '@/components/ui';
import React, { useMemo } from 'react';
import { FlashList } from '@shopify/flash-list';
import TopLocationItem from '@/components/property/TopLocationItem';
import { useQuery } from '@tanstack/react-query';
import { fetchTopLocations } from '@/actions/property/locations';
import { useRefresh } from '@react-native-community/hooks';
import { RefreshControl } from 'react-native';

export type Locations = {
	id: string;
	name: string;
	properties: number;
	banner: any;
}[];

export default function PropertySections() {
	const {data, refetch, isFetching} = useQuery({
		queryKey: ['locations'],
		queryFn: fetchTopLocations
	})
	
		const { onRefresh } = useRefresh(refetch);
	const locations = useMemo(()=> data || [], [data])
	return (
		<>
			<Box className="flex-1 px-4">
				<FlashList
					data={locations}
					renderItem={({ item }) => <TopLocationItem data={item} />}
					numColumns={2}
					horizontal={false}
					showsVerticalScrollIndicator={false}
					contentContainerStyle={{
						paddingTop: 8,
					}}
					refreshControl={
						<RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
					}
					estimatedItemSize={200}
					ListHeaderComponent={() => (
						<View className=" my-4 items-center">
							<Text>Find the best recommended places to live</Text>
						</View>
					)}
					keyExtractor={(item) => item.state}
					ItemSeparatorComponent={() => <View className="h-4" />}
					contentInsetAdjustmentBehavior="automatic"
					// ListEmptyComponent={() => (
					// 	<BodyScrollView
					// 		contentContainerStyle={{
					// 			alignItems: 'flex-start',
					// 			paddingTop: 100,
					// 		}}>
					// 		<Button
					// 			onPress={() => {
					// 				hapticFeed();
					// 				// router.push(newProductHref);
					// 			}}>
					// 			Add the first property
					// 		</Button>
					// 	</BodyScrollView>
					// )}
				/>
			</Box>
		</>
	);
}
