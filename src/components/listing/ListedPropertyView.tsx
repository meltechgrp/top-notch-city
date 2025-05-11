import React, { useState } from 'react';
import {
	Dimensions,
	NativeScrollEvent,
	Pressable,
	RefreshControl,
	View,
} from 'react-native';
import { router } from 'expo-router';
import { useAnimatedScrollHandler } from 'react-native-reanimated';
import { useStore } from '@/store';
import { Box, Icon, Text } from '../ui';
import { ChevronRightIcon, House } from 'lucide-react-native';
import { AnimatedFlashList } from '@shopify/flash-list';

type Property = any;
type Props = {
	properties?: Property;
	loading: boolean;
	profileId?: string;
	onRefresh?: () => any;
	onScroll?: (e: NativeScrollEvent) => void;
	scrollElRef: any;
	headerHeight: number;
	listRef: any;
};
export default function ListedPropertyView(props: Props) {
	const {
		properties,
		loading,
		profileId,
		onRefresh: refetch,
		onScroll,
		headerHeight,
		scrollElRef,
		listRef,
	} = props;
	const [refreshing, setRefreshing] = useState(false);
	const me = useStore((s) => s.me);
	async function onRefresh() {
		try {
			setRefreshing(true);
			await refetch?.();
		} catch (error) {
		} finally {
			setRefreshing(false);
		}
	}

	const onScrollToTop = React.useCallback(() => {
		scrollElRef.current?.scrollToOffset({
			animated: true,
			offset: headerHeight,
		});
	}, [scrollElRef, headerHeight]);

	React.useImperativeHandle(listRef, () => ({
		scrollToTop: onScrollToTop,
	}));

	const scrollHandler = useAnimatedScrollHandler({
		onScroll,
	});

	const renderItem = React.useCallback(
		({ item }: { item: any }) => {
			return (
				<View>
					<Text>Property</Text>
				</View>
			);
		},
		[profileId]
	);

	const isEmpty = !properties?.length;

	return (
		<Box
			style={[
				{
					minHeight: !isEmpty
						? Dimensions.get('window').height * 1.5
						: undefined,
				},
			]}
			className="flex-1 w-full">
			<AnimatedFlashList
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
				contentContainerStyle={{
					paddingTop: headerHeight + 16,
					paddingHorizontal: 16,
					paddingBottom: headerHeight * 2,
				}}
				data={properties}
				renderItem={renderItem}
				keyExtractor={(item: any) => item.id.toString()}
				ListEmptyComponent={
					// <FullHeightLoaderWrapper loading={loading}>
					<EmptyState isOwnProfile={true} />
					// </FullHeightLoaderWrapper>
				}
				onScroll={scrollHandler}
				ref={scrollElRef}
				scrollEventThrottle={1}
				estimatedItemSize={284}
			/>
		</Box>
	);
}

const EmptyState = ({ isOwnProfile }: { isOwnProfile: boolean }) => {
	return (
		<View className="flex-1 items-center justify-center gap-3 bg-background-muted rounded-xl py-24">
			<View className="items-center gap-3">
				<Icon size="xl" as={House} />
				<Text className="text-typography/70">No listed properties</Text>
				{isOwnProfile && (
					<Pressable
						onPress={() => {
							router.push('/(protected)/(tabs)/home');
						}}
						className="flex flex-row gap-1 items-center active:opacity-50">
						<Text className="text-primary text-sm">Post a property</Text>
						<Icon as={ChevronRightIcon} className="text-primary h-[12px]" />
					</Pressable>
				)}
			</View>
		</View>
	);
};
