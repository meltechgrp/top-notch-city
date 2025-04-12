import { cn } from '@/lib/utils';
import { FlashList, FlashListProps } from '@shopify/flash-list';
import React, { useCallback, Ref, forwardRef, useRef } from 'react';
import { FlatList, FlatListProps } from 'react-native';

// Type definition for onViewableItemsChanged callback arguments
type OnViewableItemsChangedArg<ItemT> = Parameters<
	NonNullable<FlatListProps<ItemT>['onViewableItemsChanged']>
>[0];

// Default viewability configuration
const defaultViewabilityConfig = {
	itemVisiblePercentThreshold: 1,
	minimumViewTime: 1,
	waitForInteraction: false,
};

// Props for TrackingFlatlist component
interface TrackingFlatlistProps<ItemT> extends FlatListProps<ItemT> {}

// TrackingFlatlist component
const TrackingFlatlistComponent = (
	{ onViewableItemsChanged, ...props }: TrackingFlatlistProps<any>,
	ref: Ref<FlatList<any>>
) => {
	// Uncomment the line below if you plan to use trackingSent
	// const trackingSent = new Set();

	// Callback for onViewableItemsChanged event
	const handleViewableItemsChanged = useCallback(
		({ viewableItems, changed }: OnViewableItemsChangedArg<any>) => {
			// Add your logic here to handle viewable items change
			// trackingSent can be used to track which items have been viewed
		},
		[]
	);

	// Render FlatList with tracking features
	return (
		<FlatList
			ref={ref}
			{...props}
			onViewableItemsChanged={
				onViewableItemsChanged
					? onViewableItemsChanged
					: handleViewableItemsChanged
			}
			viewabilityConfig={defaultViewabilityConfig}
		/>
	);
};
export const TrackingFlatlist = forwardRef(TrackingFlatlistComponent);

interface TrackingFlashlistProps<ItemT> extends FlashListProps<ItemT> {
	listSource: string;
	onEngagementUpdate?: (p: any) => void;
}
const TrackingFlashlistComponent = (
	props: TrackingFlashlistProps<any>,
	ref: Ref<FlashList<any>>
) => {
	const { listSource, className, onEngagementUpdate, ...rest } = props;

	const handleViewableItemsChanged = useCallback(
		({ viewableItems }: OnViewableItemsChangedArg<any>) => {},
		[]
	);

	return (
		<FlashList
			ref={ref}
			{...rest}
			className={cn('flex-1 h-full', className)}
			onViewableItemsChanged={handleViewableItemsChanged}
			viewabilityConfig={defaultViewabilityConfig}
		/>
	);
};

export const TrackingFlashlist = forwardRef(TrackingFlashlistComponent);
