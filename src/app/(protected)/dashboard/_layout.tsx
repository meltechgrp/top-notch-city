import { Drawer } from 'expo-router/drawer';

export default function DashboardLayout() {
	return (
		<Drawer>
			<Drawer.Screen
				name="index"
				options={{
					drawerLabel: 'Home',
					title: 'Dashoard',
				}}
			/>
			<Drawer.Screen
				name="user/[id]"
				options={{
					drawerLabel: 'User',
					title: 'overview',
				}}
			/>
		</Drawer>
	);
}
