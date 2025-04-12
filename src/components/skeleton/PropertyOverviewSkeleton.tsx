import React from 'react';
import { View } from 'react-native';
import { Skeleton } from 'moti/skeleton';

import { MotiView } from 'moti';

export default function PropertyOverviewSkeleton() {
	return (
		<MotiView
			transition={{
				type: 'timing',
			}}
			className="relative bg-gray-200 p-2 border-2 border-gray-200 rounded-md w-[238px]">
			<Skeleton colorMode="light" radius="round" height={16} width={100} />

			<View className="flex-row items-center mb-4 mt-5">
				<Skeleton colorMode="light" radius="round" height={48} width={48} />
				<View className="flex-1 pl-4">
					<Skeleton colorMode="light" height={16} width="100%" />
				</View>
			</View>
			<Skeleton colorMode="light" height={32} width="100%" />
		</MotiView>
	);
}
