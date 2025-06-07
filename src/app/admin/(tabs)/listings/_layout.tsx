import MainLayout from '@/components/admin/shared/MainLayout';
import CustomTopBar from '@/components/layouts/CustomTopBar';
import { MaterialTopTabs } from '@/components/layouts/MaterialTopTabs';
import NotificationBadge from '@/components/notifications/NotificationBadge';
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
				tabBar={(props) => <CustomTopBar {...props} />}
				screenOptions={{
					swipeEnabled: false,
					lazy: true,
					tabBarStyle: {
						backgroundColor:
							theme == 'dark'
								? Colors.light.background
								: Colors.dark.background,
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
						title: 'Listings',
					}}
				/>
				<MaterialTopTabs.Screen
					name="category"
					options={{
						title: 'Category List',
					}}
				/>
				<MaterialTopTabs.Screen
					name="peding"
					options={{
						title: 'Pending',
						tabBarBadge: () => <NotificationBadge count={4} />,
					}}
				/>
			</MaterialTopTabs>
		</MainLayout>
	);
}
