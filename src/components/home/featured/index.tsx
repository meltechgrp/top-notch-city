import PropertyHorizontalList from '@/components/property/PropertyHorizontalList';
import SectionHeaderWithRef from '@/components/home/SectionHeaderWithRef';
import { router } from 'expo-router';
import { useGetApiQuery } from '@/lib/api';
import { useMemo } from 'react';

export default function FeaturedProperties() {
	const { data } = useGetApiQuery<PropertyResponse>(
		'/properties',
		{},
		'properties'
	);
	const featured = useMemo(() => data?.properties ?? [], [data]);
	return (
		<SectionHeaderWithRef
			title="Featured Properties"
			onSeeAllPress={() => {
				router.push({
					pathname: '/(protected)/property/section',
					params: {
						title: 'Featured Properties',
					},
				});
			}}>
			<PropertyHorizontalList data={featured} />
		</SectionHeaderWithRef>
	);
}
