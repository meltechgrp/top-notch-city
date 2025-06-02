import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/TabBarBackground';
import {
	Home,
	Menu,
	MessageSquareMore,
	Plus,
	Search,
	Tag,
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { Icon, Pressable, Text, useResolvedTheme } from '@/components/ui';

export const unstable_settings = {
	initialRouteName: 'home',
};
export default function TabLayout() {
	const theme = useResolvedTheme();
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: '#FF4C00',
				headerShown: false,
				tabBarButton: HapticTab,
				headerTitleAlign: 'center',
				tabBarHideOnKeyboard: true,
				tabBarBackground: TabBarBackground,
				tabBarStyle: Platform.select({
					ios: {
						// Use a transparent background on iOS to show the blur effect
						position: 'absolute',
					},
					default: {
						backgroundColor:
							theme == 'dark'
								? Colors.light.background
								: Colors.dark.background,
					},
				}),
				headerStyle: {
					backgroundColor:
						theme == 'dark' ? Colors.light.background : Colors.dark.background,
				},
				headerTitleStyle: {
					color: theme == 'dark' ? Colors.dark.text : Colors.light.text,
					fontWeight: 600,
					fontSize: 22,
				},
			}}>
			<Tabs.Screen
				name="home"
				options={{
					title: 'Home',
					tabBarIcon: ({ color }) => <Home size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="search"
				options={{
					title: 'Search',
					headerShown: false,
					tabBarIcon: ({ color }) => <Search size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="sell"
				options={{
					title: 'Sell Property',
					tabBarItemStyle: {
						borderTopLeftRadius: 20,
						borderTopRightRadius: 20,
					},
					headerShown: true,
					tabBarButton: (props) => (
						<Pressable
							onPress={props.onPress}
							className="items-center h-16 absolute bottom-2 left-[10%] aspect-square mx-auto justify-center bg-primary rounded-full">
							<Plus strokeWidth={3} className=" w-6 h-6" color="white" />
						</Pressable>
					),
				}}
			/>
			<Tabs.Screen
				name="message"
				options={{
					title: 'Message',
					headerShown: true,
					tabBarIcon: ({ color }) => (
						<MessageSquareMore size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="menu"
				options={{
					title: 'Menu',
					headerShown: true,
					tabBarIcon: ({ color }) => <Menu size={24} color={color} />,
				}}
			/>
		</Tabs>
	);
}
