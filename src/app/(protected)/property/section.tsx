import { Box, Icon, Pressable, View } from '@/components/ui';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ChevronLeftIcon, ListFilter } from 'lucide-react-native';
import { hapticFeed } from '@/components/HapticTab';
import VerticalProperties from '@/components/property/VerticalProperties';
import { useTheme } from '@/components/layouts/ThemeProvider';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchProperties } from '@/actions/property';

export default function PropertySections() {
	const { title } = useLocalSearchParams() as { title?: string };
	const router = useRouter();
	const { data, isLoading, fetchNextPage, refetch } = useInfiniteQuery({
		queryKey: ['properties'],
		queryFn: fetchProperties,
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages) => pages.length + 1,
	});

	const properties = useMemo(() => data?.pages.flat() || [], [data]);
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
					// fetchNextPage={fetchNextPage}
				/>
			</Box>
		</>
	);
}
