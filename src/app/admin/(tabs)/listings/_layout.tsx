import AdminCreateButton from '@/components/admin/shared/AdminCreateButton';
import MainLayout from '@/components/admin/shared/MainLayout';
import CustomTopBar from '@/components/layouts/CustomTopBar';
import { MaterialTopTabs } from '@/components/layouts/MaterialTopTabs';
import NotificationBadge from '@/components/notifications/NotificationBadge';
import { useResolvedTheme } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import Layout from '@/constants/Layout';
import { useRouter } from 'expo-router';
import { Home, Layers } from 'lucide-react-native';

export const unstable_settings = {
	initialRouteName: 'index',
};

export default function ListingLayoutsComponent() {
	const theme = useResolvedTheme();
	const router = useRouter();
	const BUTTONS = [
		{ icon: Home, value: 'property' },
		{ icon: Layers, value: 'category' },
	];
	function handleButtonPress(val: string) {
		console.log(val);
		if (val == 'category') {
			router.push({
				pathname: '/admin/(tabs)/listings/category',
				params: { new: 'cateogry' },
			});
		}
	}
	return (
		<MainLayout>
			<MaterialTopTabs
				initialRouteName="index"
				tabBar={(props) => <CustomTopBar {...props} />}
				screenOptions={{
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
			<AdminCreateButton buttons={BUTTONS} onPress={handleButtonPress} />
		</MainLayout>
	);
}
