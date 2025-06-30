import { Box, Icon, Pressable, View } from '@/components/ui';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ChevronLeftIcon, ListFilter } from 'lucide-react-native';
import { hapticFeed } from '@/components/HapticTab';
import VerticalProperties from '@/components/property/VerticalProperties';
import { useProductQueries } from '@/tanstack/queries/useProductQueries';

export default function PropertySections() {
	const { title } = useLocalSearchParams() as { title?: string };
	const router = useRouter();
	const { data, isLoading, fetchNextPage, refetch } = useProductQueries({type: 'all'});

	const properties = useMemo(() => data?.pages.flatMap((page)=> page?.results) || [], [data]);
	return (
		<>
			<Stack.Screen
				options={{
					headerShown: true,
					headerBackVisible: false,
					headerTitle: title ?? 'Properties',
					headerLeft: () => (
						<Pressable
							onPress={() => {
								hapticFeed();
								if (router.canGoBack()) router.back();
								else router.push('/home');
							}}
							className="p-1.5 bg-black/20 mb-1 rounded-full flex-row items-center ">
							<ChevronLeftIcon size={26} strokeWidth={3} color={'white'} />
						</Pressable>
					),
					headerRight: () => (
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<Pressable
								onPress={() => {
									hapticFeed();
									// router.push({
									// 	pathname: '/list/[listId]/share',
									// 	params: { listId },
									// });
								}}
								style={{ padding: 8 }}>
								<Icon as={ListFilter} />
							</Pressable>
						</View>
					),
				}}
			/>
			<Box className="flex-1 px-4">
				<VerticalProperties
					data={properties}
					isLoading={isLoading}
					className="pb-20"
					refetch={refetch}
					fetchNextPage={fetchNextPage}
				/>
			</Box>
		</>
	);
}
