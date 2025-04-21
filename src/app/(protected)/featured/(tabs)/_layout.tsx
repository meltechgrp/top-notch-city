import { hapticFeed } from '@/components/HapticTab';
import { MaterialTopTabs } from '@/components/layouts/MaterialTopTabs';
import headerLeft from '@/components/shared/headerLeft';
import { Pressable } from '@/components/ui';
import Layout from '@/constants/Layout';
import { Stack } from 'expo-router';
import { ListFilter } from 'lucide-react-native';
import { View } from 'react-native';

export const unstable_settings = {
	initialRouteName: 'home',
};

export default function FeaturedLayout() {
	return (
		<>
			<Stack.Screen
				options={{
					headerShown: true,
					headerTitle: 'Featured Sales',
					headerBackVisible: false,
					headerLeft: headerLeft(),
					headerRight: () => (
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<Pressable
								onPress={() => {
									hapticFeed();
									// router.push({
									// 	pathname: '/list/[listId]/share',
									// 	params: { listId },
									// });
								}}
								style={{ padding: 8 }}>
								<ListFilter color={'black'} />
							</Pressable>
						</View>
					),
				}}
			/>
			<View className=" flex-1 py-[2px]">
				<MaterialTopTabs
					initialRouteName="home"
					screenOptions={{
						lazy: true,
						tabBarActiveTintColor: '#FF1500',
						tabBarInactiveTintColor: '#000',
						tabBarIndicatorStyle: {
							backgroundColor: '#FF1500',
						},
						tabBarItemStyle: {
							flexDirection: 'row',
							alignItems: 'center',
							// Use the width of the screen divided by the number of tabs
							width: Layout.window.width / 4,
						},
					}}>
					<MaterialTopTabs.Screen
						name="home"
						options={{
							title: 'Homes',
						}}
					/>
					<MaterialTopTabs.Screen
						name="shop"
						options={{
							title: 'Shops',
						}}
					/>
					<MaterialTopTabs.Screen
						name="hotel"
						options={{
							title: 'Hotels',
						}}
					/>
					<MaterialTopTabs.Screen
						name="office"
						options={{
							title: 'Offices',
						}}
					/>
				</MaterialTopTabs>
			</View>
		</>
	);
}
