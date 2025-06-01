import PropertyHorizontalList from '@/components/property/PropertyHorizontalList';
import SectionHeaderWithRef from '@/components/home/SectionHeaderWithRef';
import { router } from 'expo-router';
import { useGetApiQuery } from '@/lib/api';

export default function FeaturedProperties() {
	const { data, loading, error, refetch } =
		useGetApiQuery<PropertyResponse>('/properties');
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
			<PropertyHorizontalList data={data?.properties ?? []} refetch={refetch} />
		</SectionHeaderWithRef>
	);
}
