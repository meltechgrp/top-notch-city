import { Box, View } from '@/components/ui';
import { FilterComponent } from '@/components/admin/shared/FilterComponent';
import { useMemo, useState } from 'react';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import PropertyBottomSheet from '@/components/admin/properties/PropertyBottomSheet';
import VerticalProperties from '@/components/property/VerticalProperties';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProperties } from '@/actions/property';

export default function Properties() {
	const [activeProperty, setActiveProperty] = useState<Property | null>(null);
	const [propertyBottomSheet, setPropertyBottomSheet] = useState(false);
	const [search, setSearch] = useState('');

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

	const headerComponent = useMemo(() => {
		return (
			<FilterComponent
				search={search}
				onSearch={setSearch}
				searchPlaceholder="Search by name, category, subcategory or city"
			/>
		);
	}, [search, setSearch]);

	useRefreshOnFocus(refetch);
	return (
		<>
			<Box className=" flex-1 px-2 pt-2">
				<View className="flex-1">
					<VerticalProperties
						headerTopComponent={headerComponent}
						data={filteredData}
						scrollEnabled
						isLoading={isLoading}
						refetch={refetch}
						onPress={(data) => {
							setActiveProperty(data);
							setPropertyBottomSheet(true);
						}}
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
