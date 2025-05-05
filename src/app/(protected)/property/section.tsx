import { Box, Pressable, View } from '@/components/ui';
import { useWindowDimensions } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ChevronLeftIcon, ListFilter } from 'lucide-react-native';
import { TabView, SceneRendererProps } from 'react-native-tab-view';
import { hapticFeed } from '@/components/HapticTab';
import CustomTabBar2 from '@/components/layouts/CustomTopBar2';
import VerticalProperties from '@/components/property/VerticalProperties';
import { useTheme } from '@/components/layouts/ThemeProvider';
import { Colors } from '@/constants/Colors';

export default function PropertySections() {
	const { title } = useLocalSearchParams() as { title?: string };
	const { theme } = useTheme();
	const router = useRouter();
	const layout = useWindowDimensions();
	const [index, setIndex] = React.useState(0);
	const tabs = [
		{
			key: 'duplex',
			title: 'Duplex',
			component: () => <VerticalProperties category="duplex" />,
		},
		{
			key: 'bungalow',
			title: 'Bungalow',
			component: () => <VerticalProperties category="duplex" />,
		},
		{
			key: 'flat',
			title: 'Flat',
			component: () => <VerticalProperties category="duplex" />,
		},
		{
			key: 'mansion',
			title: 'Mansion',
			component: () => <VerticalProperties category="duplex" />,
		},
	];

	const routes = tabs.map(({ key, title }) => ({ key, title }));
	const renderScene = ({
		route,
	}: SceneRendererProps & { route: { key: string } }) => {
		const tab = tabs.find((t) => t.key === route.key);
		return tab?.component ? tab.component() : null;
	};
	return (
		<>
			<Stack.Screen
				options={{
					headerShown: true,
					headerBackVisible: false,
					headerTitle: title ?? 'Properties',
					headerTitleStyle: { color: theme == 'dark' ? 'white' : 'black' },
					headerStyle: {
						backgroundColor:
							theme == 'dark'
								? Colors.light.background
								: Colors.dark.background,
					},
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
								<ListFilter color={theme == 'dark' ? 'white' : 'black'} />
							</Pressable>
						</View>
					),
				}}
			/>
			<Box className="flex-1 px-4">
				<TabView
					style={{ flex: 1 }}
					renderTabBar={(props) => <CustomTabBar2 {...props} />}
					navigationState={{ index, routes }}
					renderScene={renderScene}
					onIndexChange={setIndex}
					initialLayout={{ width: layout.width }}
				/>
			</Box>
		</>
	);
}
