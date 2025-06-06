import { Box, Button, ButtonText, Heading, View } from '@/components/ui';
import { useRefresh } from '@react-native-community/hooks';
import { FlashList } from '@shopify/flash-list';
import { Stack, useRouter } from 'expo-router';
import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import { hapticFeed } from '@/components/HapticTab';
import { RefreshControl } from 'react-native-gesture-handler';
import { Property } from '@/components/home/FoundProperties';
import SavedListItem from '@/components/saved/SavedListItem';

export default function WishListScreen() {
	const router = useRouter();
	const fetch = () => {
		return new Promise((resolve) => setTimeout(resolve, 5000));
	};

	const { isRefreshing, onRefresh } = useRefresh(fetch);
	const data: Property[] = [
		{
			id: 'dhghg662389kndnc',
			name: 'Wings Tower',
			location: 'Emma Estate, Trans Amadi',
			price: 2500000,
			banner: require('@/assets/images/property/property6.png'),
			images: [],
		},
		{
			id: 'dhghg6623ds66skndnc',
			name: 'Topaz Villa',
			location: 'Emma Estate, Slaughter',
			price: 1500000,
			banner: require('@/assets/images/property/property5.png'),
			images: [],
		},
		{
			id: 'dhgdsbj332389kndnc',
			name: 'Great House',
			location: 'Green Estate, Rumuomasi',
			price: 2000000,
			banner: require('@/assets/images/property/property4.png'),
			images: [],
		},
		{
			id: 'dhghg66mdm89kndnc',
			name: 'Gracie Home',
			location: 'Emma Estate, Ada George',
			price: 2500000,
			banner: require('@/assets/images/property/property2.png'),
			images: [],
		},
		{
			id: 'dhejdkd66skndnc',
			name: 'Topaz Estate',
			location: 'Topaz Estate, Abuja',
			price: 1500000,
			banner: require('@/assets/images/property/property7.png'),
			images: [],
		},
	];

	// useEffect(() => {
	// 	onRefresh();
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
	// 		<Box className=" gap-y-2 pt-4 px-4">
	// 			{[1, 2, 3, 4].map((key) => (
	// 				<PropertyOverviewSkeleton key={key} />
	// 			))}
	// 		</Box>
	// 	);
	// }
	return (
		<>
			<Box className="flex-1">
				<FlashList
					data={data}
					renderItem={({ item }) => <SavedListItem key={item.id} data={item} />}
					contentContainerStyle={{
						paddingTop: 12,
						paddingHorizontal: 16,
					}}
					refreshControl={
						<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
					}
					keyExtractor={(item) => item.id}
					estimatedItemSize={200}
					ItemSeparatorComponent={() => <View className="h-2" />}
					contentInsetAdjustmentBehavior="automatic"
					ListEmptyComponent={() => (
						<BodyScrollView
							contentContainerStyle={{
								alignItems: 'center',
								gap: 8,
								paddingTop: 100,
							}}>
							<Button
								onPress={() => {
									hapticFeed();
									// router.push(newProductHref);
								}}>
								<ButtonText>Add the first property</ButtonText>
							</Button>
						</BodyScrollView>
					)}
				/>
			</Box>
		</>
	);
}
