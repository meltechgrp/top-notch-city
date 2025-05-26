import {
	Avatar,
	AvatarFallbackText,
	AvatarImage,
	Heading,
	Icon,
	Pressable,
	Text,
	useResolvedTheme,
	View,
} from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { Drawer } from 'expo-router/drawer';
import { DrawerToggleButton } from '@react-navigation/drawer';
import {
	ChartNoAxesColumnIncreasing,
	ChartSpline,
	ChevronLeftIcon,
	EyeIcon,
	House,
	LayoutGrid,
	LogOut,
	Menu,
	Moon,
	Settings2,
	Sun,
	Users2,
} from 'lucide-react-native';
import React from 'react';
import {
	DrawerContentComponentProps,
	DrawerContentScrollView,
	DrawerItemList,
} from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { Platform } from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { useTheme } from '@/components/layouts/ThemeProvider';
import { cn, fullName } from '@/lib/utils';
import { useStore } from '@/store';
import Layout from '@/constants/Layout';
import { getImageUrl } from '@/lib/api';

function CustomDrawerContent(props: DrawerContentComponentProps) {
	const me = useStore((s) => s.me);
	const height = Layout.window.height;
	const theme = useResolvedTheme();
	const { toggleTheme } = useTheme();
	const router = useRouter();

	return (
		<DrawerContentScrollView showsVerticalScrollIndicator={false} {...props}>
			<View style={{ minHeight: height - 16 }} className="flex-1">
				<View className="px-4 py-4 pb-6 flex-row gap-4 items-center border-b border-outline/70">
					<Avatar className=" w-14 h-14">
						<AvatarFallbackText>Humphrey Joshua</AvatarFallbackText>
						<AvatarImage source={getImageUrl(me?.profile_image)} />
					</Avatar>
					<View className="flex-1">
						<Heading size="xl" className="">
							Hello 👋,
						</Heading>
						<Text className="text-lg text-typography/80">{fullName(me)}</Text>
					</View>
				</View>

				<View className="flex-1 gap-4 mt-4">
					<View className="w-1/2 gap-2">
						<Text className=" text-typography/70 px-2">Theme</Text>
						<View className="h-12 rounded-xl justify-center items-center p-1 bg-background-muted flex-row gap-4">
							<Pressable
								onPress={() => toggleTheme('light')}
								className={cn(
									'rounded-xl flex-row justify-center flex-1 p-2 gap-2 items-center bg-background-muted',
									theme == 'light' && ' bg-background'
								)}>
								<Icon size="sm" as={Sun} />
								<Text className=" font-regular">Light</Text>
							</Pressable>
							<Pressable
								onPress={() => toggleTheme('dark')}
								className={cn(
									'rounded-xl flex-row justify-center flex-1 p-2 gap-2 items-center bg-background-muted',
									theme == 'dark' && ' bg-background'
								)}>
								<Icon size="sm" as={Moon} />
								<Text className=" font-regular">Dark</Text>
							</Pressable>
						</View>
					</View>
					<View className=" gap-2 my-5">
						<Text className=" text-typography/70 px-2">Menu</Text>
						<DrawerItemList {...props} />
					</View>
				</View>
				<View>
					<Pressable
						onPress={() => router.replace('/menu')}
						className=" flex-row gap-2 justify-center h-14 border border-primary items-center rounded-xl">
						<Icon as={LogOut} className=" text-primary" />
						<Text className="font-medium text-primary">Exit</Text>
					</Pressable>
				</View>
			</View>
		</DrawerContentScrollView>
	);
}

export default function AdminLayout() {
	const theme = useResolvedTheme();
	const router = useRouter();

	React.useEffect(() => {
		if (Platform.OS == 'android') {
			SystemNavigationBar.setNavigationColor('translucent');
		}
	}, []);

	return (
		<Drawer
			drawerContent={CustomDrawerContent}
			screenOptions={{
				headerTitleAlign: 'center',
				headerShown: true,
				drawerActiveBackgroundColor: Colors.primary,
				drawerInactiveBackgroundColor:
					theme == 'dark' ? 'rgb(38 40 42)' : 'rgb(253 253 253)',
				drawerActiveTintColor: '#fff',
				swipeEdgeWidth: 100,
				drawerIcon: () => <Icon as={Menu} />,
				headerLeft: () => (
					<DrawerToggleButton
						tintColor={theme == 'dark' ? Colors.dark.text : Colors.light.text}
					/>
				),
				drawerAllowFontScaling: true,
				headerTitleAllowFontScaling: true,
				headerTransparent: false,
				drawerStyle: {
					backgroundColor:
						theme == 'dark' ? Colors.light.background : Colors.dark.background,
				},
				drawerLabelStyle: {
					color: theme == 'dark' ? Colors.dark.text : Colors.light.text,
				},
				drawerItemStyle: {
					borderRadius: 12,
				},
				drawerType: 'slide',
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
			<Drawer.Screen
				name="index"
				options={{
					drawerIcon: () => <Icon as={LayoutGrid} />,
					drawerLabel: 'Dashboard',
					title: 'Dashboard',
				}}
			/>
			<Drawer.Screen
				name="users/index"
				options={{
					drawerIcon: () => <Icon as={Users2} />,
					drawerLabel: 'User',
					title: 'Users',
				}}
			/>
			<Drawer.Screen
				name="properties/index"
				options={{
					drawerIcon: () => <Icon as={House} />,
					drawerLabel: 'Properties',
					title: 'Properties',
				}}
			/>

			<Drawer.Screen
				name="properties/categories"
				options={{
					headerTitleStyle: {
						fontWeight: 500,
						fontSize: 20,
						color: theme == 'dark' ? Colors.dark.text : Colors.light.text,
					},
					headerTitle: 'Update',
					headerLeft: () => (
						<Pressable
							onPress={() => router.push('/admin/properties')}
							className="py-2 flex-row items-center pl-2 android:pr-4">
							<Icon className=" w-8 h-8" as={ChevronLeftIcon} />
						</Pressable>
					),
					swipeEnabled: false,
					drawerItemStyle: {
						display: 'none',
					},
				}}
			/>
			<Drawer.Screen
				name="properties/sub-categories"
				options={{
					headerTitle: 'Update',
					headerLeft: () => (
						<Pressable
							onPress={() => router.push('/admin/properties')}
							className="py-2 flex-row items-center pl-2 android:pr-4">
							<Icon className=" w-8 h-8" as={ChevronLeftIcon} />
						</Pressable>
					),
					swipeEnabled: false,
					drawerItemStyle: {
						display: 'none',
					},
				}}
			/>
			<Drawer.Screen
				name="analytics/index"
				options={{
					drawerIcon: () => <Icon as={ChartSpline} />,
					drawerLabel: 'Analytics',
					title: 'Analytics',
				}}
			/>
			<Drawer.Screen
				name="requests"
				options={{
					drawerIcon: () => <Icon as={ChartNoAxesColumnIncreasing} />,
					drawerLabel: 'Requests',
					title: 'Agent Requests',
				}}
			/>
			<Drawer.Screen
				name="reports"
				options={{
					drawerIcon: () => <Icon as={ChartNoAxesColumnIncreasing} />,
					drawerLabel: 'Reports',
					title: 'Reports',
				}}
			/>
			<Drawer.Screen
				name="views"
				options={{
					drawerIcon: () => <Icon as={EyeIcon} />,
					drawerLabel: 'Views',
					title: 'Property Views',
				}}
			/>
			<Drawer.Screen
				name="setting"
				options={{
					drawerIcon: () => <Icon as={Settings2} />,
					drawerLabel: 'Settings',
					title: 'Settings',
				}}
			/>
		</Drawer>
	);
}
