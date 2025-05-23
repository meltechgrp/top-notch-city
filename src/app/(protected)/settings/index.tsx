import * as React from 'react';

import { Alert, Pressable, View } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { router } from 'expo-router';
import { useNavigationContainerRef } from 'expo-router';
import SettingsItemList from '@/components/settings/SettingsItemList';
import { Icon, Text } from '@/components/ui';
import LogoutAlertDialog from '@/components/shared/LogoutAlertDialog';
import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import { LogOut } from 'lucide-react-native';

export default function SettingsScreen() {
	const navigation = useNavigationContainerRef();
	const [openLogoutAlertDialog, setOpenLogoutAlertDialog] =
		React.useState(false);

	function logout() {
		navigation?.dispatch(
			CommonActions.reset({
				routes: [
					{
						name: '(onboarding)',
						state: {
							routes: [{ name: 'onboarding' }],
						},
					},
				],
			})
		);
	}
	async function onLogout() {
		Alert.alert('Logout', 'Are you sure you want to logout?', [
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
		]);
	}
	function onDeleteAccount() {
		Alert.alert(
			'Delete Account',
			'Are you sure you want to delete your account?',
			[
				{
					text: 'Cancel',
					style: 'cancel',
				},
				{
					text: 'Delete',
					style: 'destructive',
					onPress: () => {},
				},
			]
		);
	}
	return (
		<>
			<BodyScrollView withBackground={true}>
				<View className="flex-1 gap-6 w-full py-8 p-4">
					<View className="bg-background-muted pl-4 rounded-xl">
						<SettingsItemList
							title="Notifcations"
							onPress={() => {
								// router.push('/settings/email-address');
							}}
						/>
						<SettingsItemList
							title="Chats"
							onPress={() => {
								// router.push('/settings/change-phone-number');
							}}
						/>
						<SettingsItemList
							title="Theme"
							withBorder={false}
							onPress={() => {
								router.push('/settings/theme');
							}}
						/>
					</View>
					<View className="bg-background-muted pl-4 rounded-xl">
						<SettingsItemList title="Change Password" />
						<SettingsItemList title="Forgot Password" />
						<SettingsItemList
							title="Delete My Account"
							withBorder={false}
							onPress={onDeleteAccount}
							textColor="text-primary"
						/>
					</View>
					<Pressable
						onPress={onLogout}
						className="bg-background-muted h-14 rounded-xl px-4 flex-row justify-center items-center gap-2">
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
