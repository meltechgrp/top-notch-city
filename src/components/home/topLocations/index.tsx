import SectionHeaderWithRef from '@/components/home/SectionHeaderWithRef';
import { router } from 'expo-router';
import TopLocationsHorizontalList from './TopLocationHozontalList';

export default function TopLocations() {
	return (
		<SectionHeaderWithRef
			title="Top Locations"
			subTitle="Explore"
			className=''
			onSeeAllPress={() => {
				router.push('/(protected)/property/locations');
			}}>
			<TopLocationsHorizontalList />
		</SectionHeaderWithRef>
	);
}
