import { Box, View } from '@/components/ui';
import { useMemo, useState } from 'react';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import PropertyBottomSheet from '@/components/admin/properties/PropertyBottomSheet';
import VerticalProperties from '@/components/property/VerticalProperties';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProperties } from '@/actions/property';

export default function PendingProperties() {
	const [activeProperty, setActiveProperty] = useState<Property | null>(null);
	const [propertyBottomSheet, setPropertyBottomSheet] = useState(false);

	const { data, isLoading, fetchNextPage, refetch } = useInfiniteQuery({
		queryKey: ['properties'],
		queryFn: fetchProperties,
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages) => pages.length + 1,
	});

	const propertysData = useMemo(() => {
		return data?.pages.flat() ?? [];
	}, [data]);

	useRefreshOnFocus(refetch);
	return (
		<>
			<Box className=" flex-1 px-2 pt-2">
				<View className="flex-1">
					<VerticalProperties
						data={propertysData}
						isLoading={isLoading}
						disableHeader
						onPress={(data) => {
							setActiveProperty(data);
							setPropertyBottomSheet(true);
						}}
						refetch={refetch}
					/>
				</View>
				{activeProperty && (
					<PropertyBottomSheet
						visible={propertyBottomSheet}
						property={activeProperty}
						onDismiss={() => setPropertyBottomSheet(false)}
						onApprove={() => {}}
						onReject={() => {}}
					/>
				)}
			</Box>
		</>
	);
}
