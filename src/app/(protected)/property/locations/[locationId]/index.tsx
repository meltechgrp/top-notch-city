import { Box, Image, Pressable, View } from '@/components/ui';
import { Animated } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { ListFilter } from 'lucide-react-native';
import { hapticFeed } from '@/components/HapticTab';
import VerticalProperties from '@/components/property/VerticalProperties';
import {
	useSharedValue,
} from 'react-native-reanimated';
import { useProductQueries } from '@/tanstack/queries/useProductQueries';

export default function PropertyLocations() {
	const { location } = useLocalSearchParams() as { location?: string };
	const scrollY = useSharedValue(0);
	const [height, setHeight] = useState(340);

	const { data, isLoading, fetchNextPage, refetch } = useProductQueries({type: 'location', location});

	const propertysData = useMemo(() => {
		return data?.pages.flatMap((page)=> page.results) ?? [];
	}, [data]);

	return (
		<>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTransparent: true,
					headerTitleStyle: {
						color: 'white',
					},
					headerStyle: { backgroundColor: undefined },
					headerTitle: location,
					headerRight: () => (
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<Pressable
								onPress={() => {
									hapticFeed();
								}}
								style={{ padding: 8 }}>
								<ListFilter color={'white'} />
							</Pressable>
						</View>
					),
				}}
			/>
			<Box className="flex-1 gap-4">
				{/* <View className="gap-2">
					<Animated.View
						style={[
							{
								height: height,
							},
							{ width: '100%', overflow: 'hidden' },
						]}
						className=" w-full relative rounded-b-[50px] overflow-hidden">
						<Image
							source={location.banner}
							alt={location.name}
							className="w-full h-full object-cover object-center"
						/>
						<View className="absolute bottom-0 z-10 left-0 w-full h-full bg-black/20" />
					</Animated.View>
				</View> */}
				<View className="px-4 flex-1">
					<VerticalProperties
						data={propertysData}
						isLoading={isLoading}
						refetch={refetch}
						scrollY={scrollY}
					/>
				</View>
			</Box>
		</>
	);
}
