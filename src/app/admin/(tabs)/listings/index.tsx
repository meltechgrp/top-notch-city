import { Box, View } from '@/components/ui';
import { FilterComponent } from '@/components/admin/shared/FilterComponent';
import { useMemo, useState } from 'react';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import PropertyBottomSheet from '@/components/admin/properties/PropertyBottomSheet';
import VerticalProperties from '@/components/property/VerticalProperties';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProperties } from '@/actions/property';

export default function Properties() {
	const [refreshing, setRefreshing] = useState(false);
	const [activeProperty, setActiveProperty] = useState<Property | null>(null);
	const [propertyBottomSheet, setPropertyBottomSheet] = useState(false);
	const [actveTab, setActiveTab] = useState<Property['status'] | 'all'>('all');
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);

	const { data, isLoading, fetchNextPage, refetch } = useInfiniteQuery({
		queryKey: ['properties'],
		queryFn: fetchProperties,
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages) => pages.length + 1,
	});

	const propertysData = useMemo(() => {
		return data?.pages.flat() ?? [];
	}, [data]);
	const filteredData = useMemo(() => {
		let filtered = propertysData;

		if (actveTab !== 'all') {
			if (actveTab == 'pending')
				filtered = filtered.filter((u) => u.status == actveTab);
			else if (actveTab == 'approve')
				filtered = filtered.filter((u) => u.status === actveTab);
			else if (actveTab == 'sold')
				filtered = filtered.filter((u) => u.status === actveTab);
		}

		// Search by title
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
	}, [propertysData, actveTab, search]);

	const tabs = useMemo(() => {
		const all = propertysData.length;

		const approved = propertysData.filter(
			(property) => property.status == 'approve'
		).length;
		const pending = propertysData.filter(
			(property) => property.status === 'pending'
		).length;
		const sold = propertysData.filter(
			(property) => property.status === 'sold'
		).length;
		return [
			{ title: 'all', total: all },
			{ title: 'pending', total: pending },
			{ title: 'approved', total: approved },
			{ title: 'sold', total: sold },
			// { title: 'banned', total: 0 },
		];
	}, [propertysData]);

	async function onRefresh() {
		try {
			setRefreshing(true);
			await refetch();
		} catch (error) {
		} finally {
			setRefreshing(false);
		}
	}
	const headerComponent = useMemo(() => {
		return (
			<FilterComponent
				search={search}
				onSearch={setSearch}
				onUpdate={(tab: any) => setActiveTab(tab)}
				searchPlaceholder="Search by name or city"
				tabs={tabs}
				tab={actveTab}
			/>
		);
	}, [tabs, actveTab, search, setSearch]);

	useRefreshOnFocus(refetch);
	return (
		<>
			<Box className=" flex-1 px-2 pt-2">
				<View className="flex-1 pb-8">
					<VerticalProperties
						headerTopComponent={headerComponent}
						data={propertysData}
						scrollEnabled
						refetch={refetch}
					/>
				</View>
				{activeProperty && (
					<PropertyBottomSheet
						visible={propertyBottomSheet}
						property={activeProperty}
						onDismiss={() => setPropertyBottomSheet(false)}
					/>
				)}
			</Box>
		</>
	);
}
