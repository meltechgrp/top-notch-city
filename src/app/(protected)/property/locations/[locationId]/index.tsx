import { Box, Image, Pressable, View } from '@/components/ui';
import { Animated } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { ListFilter } from 'lucide-react-native';
import { hapticFeed } from '@/components/HapticTab';
import VerticalProperties from '@/components/property/VerticalProperties';
import { Locations } from '..';
import { fetchProperties } from '@/actions/property';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
	Extrapolation,
	interpolate,
	runOnJS,
	useAnimatedReaction,
	useAnimatedStyle,
	useSharedValue,
} from 'react-native-reanimated';
const locations: Locations = [
	{
		id: 'dhghg662389kndnc',
		name: 'Lekki',
		properties: 55,
		banner: require('@/assets/images/locations/location6.png'),
	},
	{
		id: 'dhghg6623ds66skndnc',
		name: 'Port Harcourt',
		properties: 75,
		banner: require('@/assets/images/locations/location5.png'),
	},
	{
		id: 'dhgdsbj332389kndnc',
		name: 'Abuja',
		properties: 20,
		banner: require('@/assets/images/locations/location4.png'),
	},
	{
		id: 'dhghg66mdm89kndnc',
		name: 'Victoria Island',
		properties: 30,
		banner: require('@/assets/images/locations/location3.png'),
	},
	{
		id: 'dhejdkd66skndnc',
		name: 'Warri',
		properties: 15,
		banner: require('@/assets/images/locations/location2.png'),
	},
	{
		id: 'dhgdscxskk89kndnc',
		name: 'Enugu',
		properties: 4,
		banner: require('@/assets/images/locations/location1.png'),
	},
];
export default function PropertyLocations() {
	const { locationId } = useLocalSearchParams() as { locationId?: string };
	const scrollY = useSharedValue(0);
	const [height, setHeight] = useState(340);

	const { data, isLoading, fetchNextPage, refetch } = useInfiniteQuery({
		queryKey: ['properties'],
		queryFn: fetchProperties,
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages) => pages.length + 1,
	});

	const propertysData = useMemo(() => {
		return data?.pages.flat() ?? [];
	}, [data]);

	const location = useMemo(
		() => locations.find((l) => l.id === locationId),
		[locationId]
	);

	if (!location) return null;
	return (
		<>
			<Stack.Screen
				options={{
					statusBarStyle: 'light',
					headerShown: true,
					headerTransparent: true,
					headerTitleStyle: {
						color: 'white',
					},
					headerStyle: { backgroundColor: undefined },
					headerTitle: location.name,
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
				<View className="gap-2">
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
				</View>
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
