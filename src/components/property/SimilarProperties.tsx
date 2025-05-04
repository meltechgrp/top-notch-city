import PropertyHorizontalList from '@/components/property/PropertyHorizontalList';
import SectionHeaderWithRef from '@/components/home/SectionHeaderWithRef';
import { router } from 'expo-router';

export default function SimilarProperties() {
	return (
		<SectionHeaderWithRef title="Similar Properties">
			<PropertyHorizontalList />
		</SectionHeaderWithRef>
	);
}
