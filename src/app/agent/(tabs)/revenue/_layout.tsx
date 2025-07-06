import MainLayout from '@/components/admin/shared/MainLayout';
import CustomTopBar from '@/components/layouts/CustomTopBar';
import { MaterialTopTabs } from '@/components/layouts/MaterialTopTabs';
import { useResolvedTheme } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import Layout from '@/constants/Layout';

export const unstable_settings = {
	initialRouteName: 'index',
};

export default function RevenueLayoutsComponent() {
	const theme = useResolvedTheme();
	return (
		<MainLayout>
			<MaterialTopTabs
				initialRouteName="index"
				tabBar={(props) => <CustomTopBar {...props} />}
				screenOptions={{
					lazy: true,
					tabBarItemStyle: {
						flexDirection: 'row',
						alignItems: 'center',
						// Use the width of the screen divided by the number of tabs
						width: Layout.window.width / 2,
					},
					tabBarStyle: {
						backgroundColor:
							theme == 'dark'
								? Colors.light.background
								: Colors.dark.background,
					},
				}}>
				<MaterialTopTabs.Screen
					name="index"
					options={{
						title: 'Overview',
					}}
				/>
				<MaterialTopTabs.Screen
					name="total"
					options={{
						title: 'Summary',
					}}
				/>
			</MaterialTopTabs>
		</MainLayout>
	);
}
