import SectionHeaderWithRef from '@/components/home/SectionHeaderWithRef';
import { router } from 'expo-router';
import React from 'react';
import VerticalProperties from '@/components/property/VerticalProperties';
import { View } from '@/components/ui';
interface Props {
	isLoading?: boolean;
	data: Property[];
	refetch: () => Promise<any>;
}

export default function TopProperties({ data, isLoading, refetch }: Props) {
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
					data={data}
					scrollEnabled={false}
					refetch={refetch}
					disableCount={true}
					isLoading={isLoading}
				/>
			</View>
		</SectionHeaderWithRef>
	);
}
