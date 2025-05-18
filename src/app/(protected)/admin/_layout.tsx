import { Drawer } from 'expo-router/drawer';

export default function AdminLayout() {
	return (
		<Drawer
			screenOptions={{
				headerShown: true,
			}}>
			<Drawer.Screen
				name="index"
				options={{
					drawerLabel: 'Home',
					title: 'Overview',
				}}
			/>
			<Drawer.Screen
				name="users/index"
				options={{
					drawerLabel: 'User',
					title: 'Users',
				}}
			/>
			<Drawer.Screen
				name="analytics/index"
				options={{
					drawerLabel: 'Analytics',
					title: 'Analytics',
				}}
			/>
			<Drawer.Screen
				name="properties/index"
				options={{
					drawerLabel: 'Properties',
					title: 'Properties',
				}}
			/>
		</Drawer>
	);
}
