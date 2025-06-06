import MainLayout from '@/components/admin/shared/MainLayout';
import { MaterialTopTabs } from '@/components/layouts/MaterialTopTabs';
import { useResolvedTheme } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import Layout from '@/constants/Layout';

export const unstable_settings = {
	initialRouteName: 'index',
};

export default function ListingLayoutsComponent() {
	const theme = useResolvedTheme();
	return (
		<MainLayout>
			<MaterialTopTabs
				initialRouteName="index"
				screenOptions={{
					lazy: true,
					tabBarActiveTintColor: Colors.primary,
					tabBarInactiveTintColor:
						theme == 'dark' ? Colors.dark.text : Colors.light.text,
					tabBarIndicatorStyle: {
						backgroundColor: Colors.primary,
					},
					tabBarItemStyle: {
						flexDirection: 'row',
						alignItems: 'center',
						// Use the width of the screen divided by the number of tabs
						width: Layout.window.width / 3,
					},
				}}>
				<MaterialTopTabs.Screen
					name="index"
					options={{
						title: 'Details',
					}}
				/>
				<MaterialTopTabs.Screen
					name="listings"
					options={{
						title: 'Listing',
					}}
				/>
				<MaterialTopTabs.Screen
					name="activities"
					options={{
						title: 'Activities',
					}}
				/>
			</MaterialTopTabs>
		</MainLayout>
	);
}
