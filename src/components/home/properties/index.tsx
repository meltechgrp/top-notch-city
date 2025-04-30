import SectionHeaderWithRef from '@/components/home/SectionHeaderWithRef';
import { router } from 'expo-router';
import React from 'react';
import TopPropertiesVerticalList from './PropertiesVerticalList';

export default function TopProperties() {
	const [index, setIndex] = React.useState(0);
	return (
		<SectionHeaderWithRef
			title="Properties"
			onSeeAllPress={() => {
				router.push('/(protected)/featured/(tabs)/home');
			}}>
			<TopPropertiesVerticalList />
		</SectionHeaderWithRef>
	);
}
