import SectionHeaderWithRef from '@/components/home/SectionHeaderWithRef';
import { router } from 'expo-router';
import React from 'react';
import VerticalProperties from '@/components/property/VerticalProperties';
import { View } from '@/components/ui';
import { useGetApiQuery } from '@/lib/api';

export default function TopProperties() {
	const { data, loading, error, refetch } =
		useGetApiQuery<PropertyResponse>('/properties');
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
				<VerticalProperties
					data={data?.properties ?? []}
					refetch={refetch}
					disableCount={true}
					category="top"
					scrollEnabled={false}
				/>
			</View>
		</SectionHeaderWithRef>
	);
}
