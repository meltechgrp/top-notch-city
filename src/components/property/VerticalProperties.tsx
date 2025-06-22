import { View } from '@/components/ui';
import { RefreshControl } from 'react-native-gesture-handler';
import DisplayStyle from '../layouts/DisplayStyle';
import { Animated, NativeScrollEvent } from 'react-native';
import React, {
	forwardRef,
	useCallback,
	useImperativeHandle,
	useMemo,
	useState,
} from 'react';
import PropertyListItem from './PropertyListItem';
import { MiniEmptyState } from '../shared/MiniEmptyState';
import { useRouter } from 'expo-router';
import { SharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { AnimatedFlashList } from '../shared/AnimatedFlashList';
import FullHeightLoaderWrapper from '../loaders/FullHeightLoaderWrapper';

interface Props {
	category?: string;
	className?: string;
	isEmptyTitle?: string;
	scrollY?: any;
	disableCount?: boolean;
	isAdmin?: boolean;
	profileId?: string;
	onScroll?: (e: NativeScrollEvent) => any;
	scrollEnabled?: boolean;
	isHorizontal?: boolean;
	showsVerticalScrollIndicator?: boolean;
	isLoading?: boolean;
	hasNextPage?: boolean;
	data: Property[];
	scrollElRef?: any;
	disableHeader?: boolean;
	refetch: () => Promise<any>;
	fetchNextPage?: () => Promise<any>;
	headerTopComponent?: any;
	headerHeight?: number;
	listRef?: any;
	onPress?: (data: Props['data'][0]) => void;
}
const VerticalProperties = forwardRef<any, Props>(function VerticalProperties(
	{
		category,
		scrollY,
		disableCount = false,
		scrollEnabled = true,
		data,
		isLoading,
		showsVerticalScrollIndicator = false,
		refetch,
		fetchNextPage,
		isHorizontal = false,
		headerTopComponent,
		disableHeader,
		isAdmin,
		onScroll,
		className,
		onPress,
		scrollElRef,
		headerHeight,
		isEmptyTitle,
		profileId,
		hasNextPage,
	},
	ref
) {
	const router = useRouter();
	const [numColumns, setNumColumns] = useState(1);
	const layoutAnim = new Animated.Value(0);
	const [refreshing, setRefreshing] = useState(false);

	const onScrollToTop = useCallback(() => {
		scrollElRef?.current?.scrollToOffset({
			animated: true,
			offset: headerHeight || 0,
		});
	}, [scrollElRef, headerHeight]);

	useImperativeHandle(ref, () => ({
		scrollToTop: onScrollToTop,
	}));

	async function onRefresh() {
		try {
			setRefreshing(true);
			await refetch();
		} catch (error) {
		} finally {
			setRefreshing(false);
		}
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
			<>
				{data?.length > 0 && (
					<DisplayStyle
						toggleView={toggleView}
						numColumns={numColumns}
						total={data.length}
						disableCount={disableCount}
					/>
				)}
			</>
		);
	}, [toggleView, numColumns, data.length, disableCount]);
	const renderItem = useCallback(
		({ item, index }: { item: any; index: number }) => {
			return (
				<PropertyListItem
					style={{
						marginRight: (index + 1) % numColumns === 0 ? 0 : 4,
						marginLeft: index % numColumns === 0 ? 0 : 4,
					}}
					onPress={(data) => {
						if (onPress) return onPress(data);
						router.push({
							pathname: `/property/[propertyId]`,
							params: {
								propertyId: data.id,
							},
						});
					}}
					isAdmin={isAdmin}
					profileId={profileId}
					isHorizontal={isHorizontal}
					columns={numColumns}
					data={item}
				/>
			);
		},
		[numColumns]
	);
	const scrollHandler = useAnimatedScrollHandler({
		onScroll: (event) => {
			'worklet';
			if (scrollY) {
				scrollY.value = event.contentOffset.y;
			}
		},
	});
	return (
		<FullHeightLoaderWrapper loading={isLoading || false}>
			<AnimatedFlashList
				data={data}
				extraData={numColumns}
				renderItem={renderItem}
				numColumns={!isHorizontal ? numColumns : undefined}
				scrollEnabled={scrollEnabled}
				horizontal={isHorizontal}
				refreshing={refreshing}
				showsVerticalScrollIndicator={showsVerticalScrollIndicator}
				onScroll={scrollHandler}
				removeClippedSubviews
				contentContainerClassName={className}
				ref={scrollElRef}
				ItemSeparatorComponent={() => (
					<View className={numColumns == 1 ? 'h-5' : 'h-3'} />
				)}
				scrollEventThrottle={16}
				refreshControl={
					scrollEnabled ? (
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					) : undefined
				}
				contentContainerStyle={{ paddingTop: headerHeight }}
				ListHeaderComponent={
					!isHorizontal && !disableHeader ? (
						<>
							{headerTopComponent}
							{headerComponent}
						</>
					) : undefined
				}
				keyExtractor={(item: any, index) => index.toString()}
				estimatedItemSize={340}
				onEndReached={() => {
					if (hasNextPage && !isLoading) fetchNextPage?.();
				}}
				onEndReachedThreshold={20}
				contentInsetAdjustmentBehavior="automatic"
				ListEmptyComponent={() => (
					<MiniEmptyState title={isEmptyTitle || 'No property found'} />
				)}
			/>
		</FullHeightLoaderWrapper>
	);
});

export default VerticalProperties;
