import { Box, View } from '@/components/ui';
import { FilterComponent } from '@/components/admin/shared/FilterComponent';
import { useMemo, useState } from 'react';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import PropertyBottomSheet from '@/components/admin/properties/PropertyBottomSheet';
import VerticalProperties from '@/components/property/VerticalProperties';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProperties } from '@/actions/property';
import { useStore } from '@/store';

export default function Properties() {
	const [activeProperty, setActiveProperty] = useState<Property | null>(null);
	const [propertyBottomSheet, setPropertyBottomSheet] = useState(false);
	const [search, setSearch] = useState('');
	const [actveTab, setActiveTab] = useState('all');
	const { me } = useStore();

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
	}, [propertysData, search]);
	const tabs = useMemo(() => {
		const all = propertysData.length;
		const rejected = propertysData.filter(
			(item) => item.status == 'rejected'
		).length;
		const approved = propertysData.filter(
			(item) => item.status === 'approved'
		).length;
		const pending = propertysData.filter(
			(item) => item.status === 'pending'
		).length;
		const sold = propertysData.filter((item) => item.status === 'sold').length;
		const flagged = propertysData.filter(
			(item) => item.status === 'flagged'
		).length;

		return [
			{ title: 'all', total: all },
			{ title: 'pending', total: pending },
			{ title: 'approved', total: approved },
			{ title: 'sold', total: sold },
			{ title: 'rejected', total: rejected },
			{ title: 'flagged', total: flagged },
		];
	}, [propertysData]);
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
			<Box className=" flex-1 px-2 pt-2">
				<View className="flex-1">
					<VerticalProperties
						headerTopComponent={headerComponent}
						data={filteredData}
						isLoading={isLoading}
						refetch={refetch}
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
			</Box>
		</>
	);
}
