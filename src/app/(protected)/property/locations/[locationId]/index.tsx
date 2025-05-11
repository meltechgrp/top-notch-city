import { Box, Heading, Image, Pressable, Text, View } from '@/components/ui';
import { Animated, useWindowDimensions } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useRef } from 'react';
import { ChevronLeftIcon, ListFilter } from 'lucide-react-native';
import { TabView, SceneRendererProps } from 'react-native-tab-view';
import { hapticFeed } from '@/components/HapticTab';
import CustomTabBar2 from '@/components/layouts/CustomTopBar2';
import VerticalProperties from '@/components/property/VerticalProperties';
import { Locations } from '..';
const data: Locations = [
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
	const router = useRouter();
	const scrollY = useRef(new Animated.Value(0)).current;
	const layout = useWindowDimensions();
	const [index, setIndex] = React.useState(0);
	const tabs = [
		{
			key: 'duplex',
			title: 'Duplex',
			component: () => (
				<VerticalProperties scrollY={scrollY} category="duplex" />
			),
		},
		{
			key: 'bungalow',
			title: 'Bungalow',
			component: () => (
				<VerticalProperties scrollY={scrollY} category="duplex" />
			),
		},
		{
			key: 'flat',
			title: 'Flat',
			component: () => (
				<VerticalProperties scrollY={scrollY} category="duplex" />
			),
		},
		{
			key: 'mansion',
			title: 'Mansion',
			component: () => (
				<VerticalProperties scrollY={scrollY} category="duplex" />
			),
		},
	];

	const routes = tabs.map(({ key, title }) => ({ key, title }));
	const renderScene = ({
		route,
	}: SceneRendererProps & { route: { key: string } }) => {
		const tab = tabs.find((t) => t.key === route.key);
		return tab?.component ? tab.component() : null;
	};
	const location = useMemo(
		() => data.find((l) => l.id === locationId),
		[locationId]
	);
	const bannerHeight = scrollY.interpolate({
		inputRange: [0, 200],
		outputRange: [340, 110],
		extrapolate: 'clamp',
	});
	if (!location) return null;

	return (
		<>
			<Stack.Screen
				options={{
					statusBarStyle: 'light',
					headerTransparent: true,
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
									// router.push({
									// 	pathname: '/list/[listId]/share',
									// 	params: { listId },
									// });
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
						style={{ height: bannerHeight }}
						className="w-full relative rounded-b-[50px] overflow-hidden">
						<Image
							source={location.banner}
							alt={location.name}
							className="w-full h-full object-cover object-center"
						/>
						<View className="absolute bottom-0 z-10 left-0 w-full h-full bg-black/20" />
					</Animated.View>
					{/* <View className="px-6 gap-2">
						<Heading size="2xl">{location.name}</Heading>
						<Text>Our recommended real estates in {location.name}</Text>
					</View> */}
				</View>
				<View className="px-4 flex-1">
					<TabView
						style={{ flex: 1 }}
						renderTabBar={(props) => <CustomTabBar2 {...props} />}
						navigationState={{ index, routes }}
						renderScene={renderScene}
						onIndexChange={setIndex}
						initialLayout={{ width: layout.width }}
					/>
				</View>
			</Box>
		</>
	);
}
