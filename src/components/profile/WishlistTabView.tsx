import React, { useMemo } from 'react';
import { NativeScrollEvent, View } from 'react-native';
import VerticalProperties from '../property/VerticalProperties';
import { useQuery } from '@tanstack/react-query';
import { fetchWishlist } from '@/actions/property';
import { SharedValue } from 'react-native-reanimated';

type IProps = {
	profileId: string;
	onScroll?: (e: NativeScrollEvent) => any;
	headerHeight: number;
	scrollElRef: any;
	listRef: any;
	scrollY?: SharedValue<number>;
};
export default function WishlistTabView(props: IProps) {
	const { profileId, onScroll, scrollY, headerHeight, scrollElRef, listRef } =
		props;

	const { data, isLoading, refetch } = useQuery({
		queryKey: ['wishlist'],
		queryFn: fetchWishlist,
	});
	const list = useMemo(() => data || [], [data]);
	return (
		<View className="flex-1 px-4 py-3">
			<VerticalProperties
				isLoading={isLoading}
				data={list as any}
				onScroll={onScroll}
				scrollElRef={scrollElRef}
				headerHeight={headerHeight}
				listRef={listRef}
				disableHeader={true}
				refetch={refetch}
				scrollY={scrollY}
				profileId={profileId}
				isEmptyTitle="Your wishlist is empty!"
			/>
		</View>
	);
}
