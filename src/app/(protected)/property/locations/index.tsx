import { Box, Button, Text, View } from '@/components/ui';
import { RefreshControl } from 'react-native';
import React, { useMemo } from 'react';
import { hapticFeed } from '@/components/HapticTab';
import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import { FlashList } from '@shopify/flash-list';
import { useRefresh } from '@react-native-community/hooks';
import TopLocationItem from '@/components/property/TopLocationItem';
import { useQuery } from '@tanstack/react-query';
import { fetchTopLocations } from '@/actions/property/locations';

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
	
	const locations = useMemo(()=> data || [], [data])
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
					// refreshControl={
					// 	<RefreshControl refreshing={isFetching} onRefresh={onRefresh} />
					// }
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
