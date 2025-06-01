import { View } from '@/components/ui';
import { Skeleton } from 'moti/skeleton';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { RefreshControl } from 'react-native-gesture-handler';
import DisplayStyle from '../layouts/DisplayStyle';
import { Animated } from 'react-native';
import { useMemo, useState } from 'react';
import PropertyListItem from './PropertyListItem';
import { AnimatedFlashList } from '@shopify/flash-list';
import { MiniEmptyState } from '../shared/MiniEmptyState';

interface Props {
	category?: string;
	className?: string;
	scrollY?: any;
	disableCount?: boolean;
	scrollEnabled?: boolean;
	data: Property[];
	refetch: () => Promise<PropertyResponse>;
}
const GAP = 16;
const SIDE_PADDING = 16;

export default function VerticalProperties({
	category,
	scrollY,
	disableCount = false,
	data,
	scrollEnabled = false,
	refetch,
}: Props) {
	const router = useRouter();
	const [numColumns, setNumColumns] = useState(2);
	const layoutAnim = new Animated.Value(0);
	const [refreshing, setRefreshing] = useState(false);

	if (refreshing) {
		return (
			<View className=" gap-y-2 pt-4 px-4">
				{[1, 2, 3, 4].map((key) => (
					<PropertyOverviewSkeleton key={key} />
				))}
			</View>
		);
	}

	const propertysData = useMemo(() => {
		return data ?? [];
	}, [data]);
	async function onRefresh() {
		try {
			setRefreshing(true);
			await refetch();
		} catch (error) {
		} finally {
			setRefreshing(false);
		}
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

	const headerComponent = useMemo(
		() => (
			<DisplayStyle
				toggleView={toggleView}
				numColumns={numColumns}
				total={data.length}
				disableCount={disableCount}
			/>
		),
		[toggleView, numColumns]
	);
	return (
		<AnimatedFlashList
			data={propertysData}
			renderItem={({ item }) => (
				<PropertyListItem className="mb-4" columns={numColumns} data={item} />
			)}
			numColumns={numColumns}
			scrollEnabled={scrollEnabled}
			horizontal={false}
			showsVerticalScrollIndicator={false}
			onScroll={
				scrollY &&
				Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
					useNativeDriver: false,
				})
			}
			scrollEventThrottle={16}
			refreshControl={
				scrollEnabled ? (
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				) : undefined
			}
			ListHeaderComponent={headerComponent}
			keyExtractor={(item) => item.id}
			estimatedItemSize={340}
			contentInsetAdjustmentBehavior="automatic"
			ListEmptyComponent={() => <MiniEmptyState title="No property found" />}
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
