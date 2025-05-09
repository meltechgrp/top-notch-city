import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/TabBarBackground';
import {
	Heart,
	Home,
	MessageSquareMore,
	Tag,
	UserCircle2,
} from 'lucide-react-native';
import { useTheme } from '@/components/layouts/ThemeProvider';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
	const { theme } = useTheme();
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: '#FF4C00',
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarHideOnKeyboard: true,
				tabBarBackground: TabBarBackground,
				tabBarStyle: Platform.select({
					ios: {
						// Use a transparent background on iOS to show the blur effect
						position: 'absolute',
					},
					default: {},
					android: {
						backgroundColor:
							theme == 'dark'
								? Colors.light.background
								: Colors.dark.background,
						// borderTopWidth: 0,
						// elevation: 8,
					},
				}),
			}}>
			<Tabs.Screen
				name="home"
				options={{
					title: 'Home',
					tabBarIcon: ({ color }) => <Home size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="wishlist"
				options={{
					title: 'Wishlist',
					tabBarIcon: ({ color }) => <Heart size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="sell"
				options={{
					title: 'Listing',
					headerShown: true,
					tabBarIcon: ({ color }) => <Tag size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="message"
				options={{
					title: 'Message',
					tabBarIcon: ({ color }) => (
						<MessageSquareMore size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Profile',
					tabBarIcon: ({ color }) => <UserCircle2 size={24} color={color} />,
				}}
			/>
		</Tabs>
	);
}
