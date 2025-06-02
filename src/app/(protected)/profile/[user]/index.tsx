import * as React from 'react';

import { Alert, Animated, View } from 'react-native';

import { useStore } from '@/store';
import {
	Stack,
	useLocalSearchParams,
	useNavigationContainerRef,
	useRouter,
} from 'expo-router';
import BeachPersonWaterParasolSingleColorIcon from '@/components/icons/BeachPersonWaterParasolIcon';
import {
	Avatar,
	AvatarFallbackText,
	AvatarImage,
	Icon,
	Pressable,
	Text,
	useResolvedTheme,
} from '@/components/ui';
import { getImageUrl, useApiRequest } from '@/lib/api';
import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import { Divider } from '@/components/ui/divider';
import { MenuListItem } from '@/components/menu/MenuListItem';
import {
	BookCheck,
	Building2,
	ChartNoAxesColumnIncreasing,
	ChevronRight,
	House,
	LogOut,
	Shield,
	User,
	Warehouse,
} from 'lucide-react-native';
import { cn, fullName } from '@/lib/utils';
import { CommonActions } from '@react-navigation/native';
import LogoutAlertDialog from '@/components/shared/LogoutAlertDialog';
import useResetAppState from '@/hooks/useResetAppState';

export default function ProfileScreen() {
	const { user, ref } = useLocalSearchParams<{
		user: string;
		ref?: string;
	}>();
	const { me, updateProfile } = useStore();
	const resetAppState = useResetAppState();
	const [refetching, setRefetching] = React.useState(false);
	const router = useRouter();
	const navigation = useNavigationContainerRef();
	const [openLogoutAlertDialog, setOpenLogoutAlertDialog] =
		React.useState(false);
	const { request } = useApiRequest<Me>();
	const theme = useResolvedTheme();

	async function onRefresh() {
		try {
			setRefetching(true);
			const data = await request({
				url: 'users/me',
			});
			if (data) {
				updateProfile(data);
			}
		} catch (error) {
		} finally {
			setRefetching(false);
		}
	}
	function logout() {
		resetAppState();
		navigation?.dispatch(
			CommonActions.reset({
				routes: [
					{
						name: '(auth)',
						state: {
							routes: [{ name: 'onboarding' }],
						},
					},
					{
						name: '(auth)',
						state: {
							routes: [{ name: 'signin' }],
						},
					},
				],
			})
		);
	}
	async function onLogout() {
		Alert.alert(
			'Logout',
			'Are you sure you want to logout?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Logout',
					style: 'destructive',
					onPress: () => {
						logout();
					},
				},
			],
			{}
		);
	}
	if (!me?.id) {
		return <EmptyProfile />;
	}
	return (
		<>
			<Stack.Screen
				options={{
					headerRight: () => (
						<View className="flex-row items-center">
							<Pressable
								onPress={() => {
									router.push('/(protected)/profile/[user]/account');
								}}>
								<Text size="xl" className="text-primary">
									Edit
								</Text>
							</Pressable>
						</View>
					),
				}}
			/>
			<BodyScrollView
				onRefresh={onRefresh}
				refreshing={refetching}
				withBackground={true}
				className="pt-4">
				<View
					className={cn(
						'px-4 py-2 mt-2',
						theme == 'dark'
							? 'bg-background-muted/95'
							: 'bg-background-muted/60'
					)}>
					<Pressable className={'flex-row items-center'}>
						<Avatar className=" w-16 h-16">
							<AvatarFallbackText>{fullName(me)}</AvatarFallbackText>
							<AvatarImage source={getImageUrl(me?.profile_image)} />
						</Avatar>
						<View className="flex-1 pl-3">
							<Text className="text-lg font-medium">{fullName(me)}</Text>
							<Text className="text-sm text-typography/80">{me?.email}</Text>
						</View>
					</Pressable>
				</View>
				<View className="pt-10 flex-1 px-4">
					<Text className="text-sm text-typography/80 uppercase px-4 mb-2">
						Profile Menu
					</Text>
					<View className="flex-1 mt-2">
						<MenuListItem
							title="Properties"
							description="View all your saved properties"
							onPress={() =>
								router.push('/(protected)/profile/[user]/properties')
							}
							icon={Building2}
							iconColor="primary"
							className=" py-2 pb-3"
						/>
						<Divider className=" h-[0.3px] bg-background-info mb-4" />
						<MenuListItem
							title="Bookings"
							description="View all customers requests"
							onPress={() => {}}
							icon={BookCheck}
							iconColor="yellow-600"
							className=" py-2 pb-3"
						/>
						<Divider className=" h-[0.3px] bg-background-info mb-4" />
						<MenuListItem
							title="Security"
							description="Change your password or delete account"
							onPress={() =>
								router.push('/(protected)/profile/[user]/security')
							}
							icon={Shield}
							iconColor="gray-500"
							className=" py-2 pb-3"
						/>
						<Divider className=" h-[0.3px] bg-background-info mb-4" />
						<MenuListItem
							title="Analytics"
							description="Monitor your sells and views"
							onPress={() =>
								router.push('/(protected)/profile/[user]/analytics')
							}
							icon={ChartNoAxesColumnIncreasing}
							className="py-2"
							iconColor="yellow-600"
						/>
						<Divider className=" h-[0.3px] bg-background-info mb-4" />
						<MenuListItem
							title="Sell or Rent your property"
							description={`Join us as an agent to earn more`}
							icon={Warehouse}
							className="py-2"
							iconColor="gray-600"
							onPress={() => router.push('/sell')}
						/>
					</View>
					<Pressable
						onPress={onLogout}
						className="bg-background-muted h-14 mt-8 rounded-xl px-4 flex-row justify-center items-center gap-2">
						<Text size="lg">Sign Out</Text>
						<Icon size="md" as={LogOut} className="text-primary" />
					</Pressable>
				</View>
			</BodyScrollView>
			<LogoutAlertDialog
				setOpenLogoutAlertDialog={setOpenLogoutAlertDialog}
				openLogoutAlertDialog={openLogoutAlertDialog}
			/>
		</>
	);
}

function EmptyProfile() {
	return (
		<View className="flex-1 justify-center items-center px-4">
			<BeachPersonWaterParasolSingleColorIcon
				width={64}
				height={64}
				className="text-gray-500"
			/>
			<Text className="text-gray-500 mt-2">Nothing to see here</Text>
		</View>
	);
}
