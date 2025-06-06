import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/TabBarBackground';
import {
	ChartNoAxesColumn,
	LayoutDashboard,
	List,
	Settings2,
	Users2,
	Wallet,
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';
import { useResolvedTheme } from '@/components/ui';

export const unstable_settings = {
	initialRouteName: 'dashboard',
};
export default function AdminTabLayout() {
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
				name="dashboard"
				options={{
					title: 'Dashboard',
					tabBarIcon: ({ color }) => (
						<LayoutDashboard size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="users"
				options={{
					title: 'Users',
					tabBarIcon: ({ color }) => <Users2 size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="listings"
				options={{
					title: 'Listings',
					tabBarIcon: ({ color }) => <List size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="analytics"
				options={{
					title: 'Analytics',
					tabBarIcon: ({ color }) => (
						<ChartNoAxesColumn size={24} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: 'Settings',
					href: null,
					tabBarIcon: ({ color }) => <Settings2 size={24} color={color} />,
				}}
			/>
			<Tabs.Screen
				name="revenue"
				options={{
					title: 'Revenue',
					tabBarIcon: ({ color }) => <Wallet size={24} color={color} />,
				}}
			/>
		</Tabs>
	);
}
