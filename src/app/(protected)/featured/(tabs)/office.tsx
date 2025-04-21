import FeaturedPropertyItem from '@/components/property/FeaturedPropertyItem';
import { Button, View } from '@/components/ui';
import { useRefresh } from '@react-native-community/hooks';
import { Skeleton } from 'moti/skeleton';
import { MotiView } from 'moti';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import { hapticFeed } from '@/components/HapticTab';
import { RefreshControl } from 'react-native-gesture-handler';
import { Property } from '@/components/home/FoundProperties';

export default function FeaturedOffices() {
	const router = useRouter();
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

	if (isRefreshing) {
		return (
			<View className=" gap-y-2 pt-4 px-4">
				{[1, 2, 3, 4].map((key) => (
					<PropertyOverviewSkeleton key={key} />
				))}
			</View>
		);
	}
	return (
		<FlashList
			data={data}
			className={'gap-4'}
			renderItem={({ item }) => (
				<FeaturedPropertyItem key={item.id} data={item} />
			)}
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
						Add the first property
					</Button>
				</BodyScrollView>
			)}
		/>
	);
}

function PropertyOverviewSkeleton() {
	return (
		<MotiView
			transition={{
				type: 'timing',
			}}
			className="relative bg-gray-200 p-2 border-2 border-gray-200 rounded-md">
			<Skeleton colorMode="light" radius="round" height={16} width={100} />

			<View className="flex-row items-center mb-4 mt-5">
				<Skeleton colorMode="light" radius="round" height={48} width={48} />
				<View className="flex-1 pl-4">
					<Skeleton colorMode="light" height={16} width="100%" />
				</View>
			</View>
			<Skeleton colorMode="light" height={32} width="100%" />
		</MotiView>
	);
}
