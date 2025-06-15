import PropertyHorizontalList from '@/components/property/PropertyHorizontalList';
import SectionHeaderWithRef from '@/components/home/SectionHeaderWithRef';
import { router } from 'expo-router';

export default function FeaturedProperties() {
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
			<PropertyHorizontalList />
		</SectionHeaderWithRef>
	);
}
