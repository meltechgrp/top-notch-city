import React, { useMemo } from 'react';
import { NativeScrollEvent, View } from 'react-native';
import VerticalProperties from '../property/VerticalProperties';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchUserProperties } from '@/actions/property';
import { SharedValue } from 'react-native-reanimated';
import { MiniEmptyState } from '../shared/MiniEmptyState';

type IProps = {
	profileId: string;
	onScroll?: (e: NativeScrollEvent) => any;
	headerHeight: number;
	scrollElRef: any;
	listRef: any;
	scrollY?: SharedValue<number>;
};
export default function PropertiesTabView(props: IProps) {
	const { profileId, onScroll, scrollY, headerHeight, scrollElRef, listRef } =
		props;

	const { data, isLoading, fetchNextPage, refetch } = useInfiniteQuery({
		queryKey: ['properties', profileId],
		queryFn: ({ pageParam }) =>
			fetchUserProperties({ userId: profileId, pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages) => pages.length + 1,
	});

	const list = useMemo(() => data?.pages.flat() || [], [data]);
	return (
		<View className="flex-1 p-4">
			{list?.length ? (
				<VerticalProperties
					isLoading={isLoading}
					data={list}
					onScroll={onScroll}
					scrollElRef={scrollElRef}
					headerHeight={headerHeight}
					listRef={listRef}
					refetch={refetch}
					scrollY={scrollY}
				/>
			) : (
				<MiniEmptyState
					className=" justify-start"
					title="You have no listed property!"
				/>
			)}
		</View>
	);
}
