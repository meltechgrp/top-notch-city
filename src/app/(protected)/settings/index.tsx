import * as React from 'react';

import { ActivityIndicator, Alert, Pressable, View } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { useNavigationContainerRef } from 'expo-router';
import SettingsItemList from '@/components/settings/SettingsItemList';
import { Box } from '@/components/ui';

export default function SettingsScreen() {
	const navigation = useNavigationContainerRef();
	const [tapCount, setTapCount] = React.useState(0);

	function logout() {
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
			<Box className="flex-1 border-t border-outline">
				<View className="flex-1 w-full py-8">
					<View className="flex-1">
						<SettingsItemList
							title="Email Address"
							onPress={() => {
								// router.push('/settings/email-address');
							}}
						/>
						<SettingsItemList title="Privacy policy" />
						<SettingsItemList
							title="Change phone number"
							onPress={() => {
								// router.push('/settings/change-phone-number');
							}}
						/>
						<SettingsItemList
							title="Theme"
							onPress={() => {
								router.push('/settings/theme');
							}}
						/>
						<SettingsItemList
							title="Log out"
							onPress={onLogout}
							withArrow={false}
						/>
						<SettingsItemList
							title="Delete Account"
							withBorder={false}
							onPress={onDeleteAccount}
							textColor="text-red-700"
						/>
					</View>
				</View>
			</Box>
		</>
	);
}
