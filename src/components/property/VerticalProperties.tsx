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
import DisplayStyle from '../layouts/DisplayStyle';
import { Animated } from 'react-native';
import { useState } from 'react';
import PropertyListItem from './PropertyListItem';

interface Props {
	category: string;
	className?: string;
	scrollY?: any;
}
const GAP = 16;
const SIDE_PADDING = 16;

export default function VerticalProperties({ category, scrollY }: Props) {
	const router = useRouter();
	const [numColumns, setNumColumns] = useState(2);
	const layoutAnim = new Animated.Value(0);
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
		{
			id: 'dhghg66mdm89kndnc',
			name: 'Babylon House',
			location: 'Emma Estate, Slaughter',
			price: 2500000,
			banner: require('@/assets/images/property/property1.png'),
			images: [],
		},
		{
			id: 'dhejdkd66skndnc',
			name: 'Topaz Villa',
			location: 'Emma Estate, Slaughter',
			price: 1500000,
			banner: require('@/assets/images/property/property2.png'),
			images: [],
		},
		{
			id: 'dhgdscxskk89kndnc',
			name: 'Great House',
			location: 'Green Estate, Rumuomasi',
			price: 2000000,
			banner: require('@/assets/images/property/property1.png'),
			images: [],
		},
	];

	if (isRefreshing) {
		return (
			<View className=" gap-y-2 pt-4 px-4">
				{[1, 2, 3, 4].map((key) => (
					<PropertyOverviewSkeleton key={key} />
				))}
			</View>
		);
	}

	const toggleView = () => {
		Animated.timing(layoutAnim, {
			toValue: numColumns === 1 ? 1 : 0,
			duration: 300,
			useNativeDriver: false,
		}).start(() => {
			setNumColumns(numColumns === 1 ? 2 : 1);
		});
	};
	return (
		<Animated.FlatList
			style={{ flex: 1 }}
			refreshing={isRefreshing}
			data={data}
			key={`flatlist-${numColumns}`}
			columnWrapperStyle={numColumns > 1 ? { gap: GAP } : undefined}
			renderItem={({ item }) => (
				<PropertyListItem className="mb-4" columns={numColumns} data={item} />
			)}
			numColumns={numColumns}
			horizontal={false}
			showsVerticalScrollIndicator={false}
			contentContainerStyle={{
				alignItems: 'center',
				paddingHorizontal: SIDE_PADDING,
			}}
			onScroll={
				scrollY &&
				Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
					useNativeDriver: false,
				})
			}
			scrollEventThrottle={16}
			refreshControl={
				<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
			}
			ListHeaderComponent={() => (
				<DisplayStyle
					toggleView={toggleView}
					numColumns={numColumns}
					total={data.length}
				/>
			)}
			keyExtractor={(item) => item.id}
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
