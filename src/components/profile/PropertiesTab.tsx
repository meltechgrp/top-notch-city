import React, { useMemo, useState } from 'react';
import { NativeScrollEvent, View } from 'react-native';
import VerticalProperties from '../property/VerticalProperties';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchUserProperties } from '@/actions/property';
import { SharedValue } from 'react-native-reanimated';
import { FilterComponent } from '../admin/shared/FilterComponent';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import PropertyBottomSheet from '../admin/properties/PropertyBottomSheet';
import { useStore } from '@/store';

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
	const { me } = useStore();
	const [activeProperty, setActiveProperty] = useState<Property | null>(null);
	const [propertyBottomSheet, setPropertyBottomSheet] = useState(false);
	const [search, setSearch] = useState('');
	const [actveTab, setActiveTab] = useState('all');
	const { data, isLoading, fetchNextPage, refetch } = useInfiniteQuery({
		queryKey: ['properties', profileId],
		queryFn: ({ pageParam }) =>
			fetchUserProperties({ userId: profileId, pageParam }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages) => pages.length + 1,
	});
	const list = useMemo(() => data?.pages.flat() || [], [data]);

	const filteredData = useMemo(() => {
		let filtered = list;

		if (actveTab !== 'all') {
			filtered = filtered.filter((u) => u.status.toLowerCase() === actveTab);
		}
		if (search.trim() !== '') {
			const regex = new RegExp(search.trim(), 'i');
			filtered = filtered.filter(
				(u) =>
					regex.test(u.title) ||
					regex.test(u.category) ||
					regex.test(u.subcategory)
			);
		}
		return filtered;
	}, [list, search, actveTab]);
	const tabs = useMemo(() => {
		const all = list.length;
		const rejected = list.filter((item) => item.status == 'rejected').length;
		const approved = list.filter((item) => item.status === 'approved').length;
		const pending = list.filter((item) => item.status === 'pending').length;
		const sold = list.filter((item) => item.status === 'sold').length;
		const flagged = list.filter((item) => item.status === 'flagged').length;

		return [
			{ title: 'all', total: all },
			{ title: 'pending', total: pending },
			{ title: 'approved', total: approved },
			{ title: 'sold', total: sold },
			{ title: 'rejected', total: rejected },
			{ title: 'flagged', total: flagged },
		];
	}, [list]);

	const headerComponent = useMemo(() => {
		return (
			<FilterComponent
				search={search}
				onSearch={setSearch}
				tabs={tabs}
				tab={actveTab}
				onUpdate={setActiveTab}
				searchPlaceholder="Search by name"
			/>
		);
	}, [search, setSearch, tabs, actveTab]);
	useRefreshOnFocus(refetch);
	return (
		<>
			<View className="flex-1 p-4">
				<VerticalProperties
					isLoading={isLoading}
					data={filteredData}
					headerTopComponent={headerComponent}
					onScroll={onScroll}
					scrollElRef={scrollElRef}
					headerHeight={headerHeight}
					listRef={listRef}
					refetch={refetch}
					scrollY={scrollY}
					className="pb-24"
					profileId={profileId}
					onPress={(data) => {
						setActiveProperty(data);
						setPropertyBottomSheet(true);
					}}
				/>
			</View>
			{activeProperty && me && (
				<PropertyBottomSheet
					visible={propertyBottomSheet}
					property={activeProperty}
					user={me}
					onDismiss={() => setPropertyBottomSheet(false)}
				/>
			)}
		</>
	);
}
