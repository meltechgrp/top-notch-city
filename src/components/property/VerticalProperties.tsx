import { View } from '@/components/ui';
import { RefreshControl } from 'react-native-gesture-handler';
import DisplayStyle from '../layouts/DisplayStyle';
import { ActivityIndicator, Animated } from 'react-native';
import { useCallback, useMemo, useState } from 'react';
import PropertyListItem from './PropertyListItem';
import { AnimatedFlashList, ViewToken } from '@shopify/flash-list';
import { MiniEmptyState } from '../shared/MiniEmptyState';

interface Props {
	category?: string;
	className?: string;
	scrollY?: any;
	disableCount?: boolean;
	scrollEnabled?: boolean;
	isHorizontal?: boolean;
	showsVerticalScrollIndicator?: boolean;
	isLoading?: boolean;
	data: Property[];
	refetch: () => Promise<any>;
	fetchNextPage?: () => Promise<any>;
}
export default function VerticalProperties({
	category,
	scrollY,
	disableCount = false,
	scrollEnabled = false,
	data,
	isLoading,
	showsVerticalScrollIndicator = false,
	refetch,
	fetchNextPage,
	isHorizontal = false,
}: Props) {
	const [numColumns, setNumColumns] = useState(1);
	const layoutAnim = new Animated.Value(0);
	const [refreshing, setRefreshing] = useState(false);
	const [visibleItems, setVisibleItems] = useState<number[]>([]);

	const viewabilityConfig = useMemo(
		() => ({
			itemVisiblePercentThreshold: 50,
		}),
		[]
	);

	const onViewableItemsChanged = useCallback(
		({ viewableItems }: { viewableItems: ViewToken[] }) => {
			setVisibleItems(viewableItems.map((val) => val.index || 0));
		},
		[]
	);

	async function onRefresh() {
		try {
			setRefreshing(true);
			await refetch();
		} catch (error) {
		} finally {
			setRefreshing(false);
		}
	}

	if (isLoading) {
		return <ActivityIndicator />;
	}
	const toggleView = useCallback(() => {
		Animated.timing(layoutAnim, {
			toValue: numColumns === 1 ? 1 : 0,
			duration: 300,
			useNativeDriver: false,
		}).start(() => {
			setNumColumns(numColumns === 1 ? 2 : 1);
		});
	}, [numColumns]);

	const headerComponent = useMemo(() => {
		return (
			<DisplayStyle
				toggleView={toggleView}
				numColumns={numColumns}
				total={data.length}
				disableCount={disableCount}
			/>
		);
	}, [toggleView, numColumns, data.length, disableCount]);
	const renderItem = useCallback(
		({ item, index }: { item: Property; index: number }) => {
			return (
				<PropertyListItem
					style={{
						marginRight: (index + 1) % numColumns === 0 ? 0 : 4,
						marginLeft: index % numColumns === 0 ? 0 : 4,
					}}
					isHorizontal={isHorizontal}
					columns={numColumns}
					data={item}
				/>
			);
		},
		[numColumns]
	);
	return (
		<AnimatedFlashList
			data={data}
			extraData={numColumns}
			renderItem={renderItem}
			numColumns={!isHorizontal ? numColumns : undefined}
			scrollEnabled={scrollEnabled}
			horizontal={isHorizontal}
			refreshing={refreshing}
			showsVerticalScrollIndicator={showsVerticalScrollIndicator}
			onScroll={
				scrollY &&
				Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
					useNativeDriver: false,
				})
			}
			ItemSeparatorComponent={() => (
				<View className={numColumns == 1 ? 'h-6' : 'h-3'} />
			)}
			// scrollEventThrottle={16}
			refreshControl={
				scrollEnabled ? (
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				) : undefined
			}
			ListHeaderComponent={!isHorizontal ? headerComponent : undefined}
			keyExtractor={(item) => item.id}
			estimatedItemSize={340}
			onEndReached={() => fetchNextPage?.()}
			onEndReachedThreshold={20}
			onViewableItemsChanged={onViewableItemsChanged}
			viewabilityConfig={viewabilityConfig}
			contentInsetAdjustmentBehavior="automatic"
			ListEmptyComponent={() => <MiniEmptyState title="No property found" />}
		/>
	);
}
