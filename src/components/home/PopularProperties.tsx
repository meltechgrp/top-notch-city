import PropertyHorizontalList from '@/components/property/PropertyHorizontalList';
import SectionHeaderWithRef from '@/components/home/SectionHeaderWithRef';
import { router } from 'expo-router';

export default function PopulerProperties() {
	return (
		<SectionHeaderWithRef
			title="Featured Properties"
			onSeeAllPress={() => {
				router.push('/(protected)/featured/(tabs)/home');
			}}>
			<PropertyHorizontalList />
		</SectionHeaderWithRef>
	);
}
