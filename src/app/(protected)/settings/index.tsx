import * as React from 'react';

import { Alert, View } from 'react-native';
import { router } from 'expo-router';
import SettingsItemList from '@/components/settings/SettingsItemList';
import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import useResetAppState from '@/hooks/useResetAppState';
import { Icon, Pressable, Text } from '@/components/ui';
import { LogOut } from 'lucide-react-native';
import LogoutAlertDialog from '@/components/shared/LogoutAlertDialog';

export default function SettingsScreen() {
	const resetAppState = useResetAppState();
	const [openLogoutAlertDialog, setOpenLogoutAlertDialog] =
		React.useState(false);

	function logout() {
		resetAppState();
		router.dismissTo('/(protected)/(tabs)/home');
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
						<SettingsItemList
							onPress={() =>
								router.push('/(protected)/settings/change-password')
							}
							title="Change Password"
						/>
						<SettingsItemList
							title="Delete My Account"
							withBorder={false}
							onPress={() =>
								router.push('/(protected)/settings/delete-account')
							}
							textColor="text-primary"
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
