import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '../../components/HapticTab';
import TabBarBackground from '../../components/TabBarBackground';
import { Bookmark, Home, Search, Tag, User } from 'lucide-react-native';

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: '#FF1500',
				headerShown: false,
				tabBarButton: HapticTab,
				tabBarBackground: TabBarBackground,
				tabBarStyle: Platform.select({
					ios: {
						// Use a transparent background on iOS to show the blur effect
						position: 'absolute',
					},
					default: {},
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
				name="search"
				options={{
					title: 'Search',
					tabBarIcon: ({ color }) => <Search size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="sell"
				options={{
					title: 'Sell',
					tabBarIcon: ({ color }) => <Tag size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="saved"
				options={{
					title: 'Saved',
					tabBarIcon: ({ color }) => <Bookmark size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: 'Profile',
					tabBarIcon: ({ color }) => <User size={24} color={color} />,
				}}
			/>
		</Tabs>
	);
}
