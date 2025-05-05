import SectionHeaderWithRef from '@/components/home/SectionHeaderWithRef';
import { router } from 'expo-router';
import React from 'react';
import VerticalProperties from '@/components/property/VerticalProperties';
import { View } from '@/components/ui';

export default function TopProperties() {
	return (
		<SectionHeaderWithRef
			title="Top Properties"
			onSeeAllPress={() => {
				router.push({
					pathname: '/(protected)/property/section',
					params: {
						title: 'Top Properties',
					},
				});
			}}>
			<View className="flex-1 px-4">
				<VerticalProperties disableCount={true} category="top" scrollY={0} />
			</View>
		</SectionHeaderWithRef>
	);
}
