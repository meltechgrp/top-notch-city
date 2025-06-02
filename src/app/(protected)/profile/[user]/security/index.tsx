import * as React from 'react';

import { Alert, View } from 'react-native';
import SettingsItemList from '@/components/settings/SettingsItemList';
import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import { useRouter } from 'expo-router';

export default function SecurityScreen() {
	const router = useRouter();
	return (
		<>
			<BodyScrollView withBackground={true}>
				<View className="flex-1 gap-6 w-full py-8 p-4">
					<View className="bg-background-muted pl-4 rounded-xl">
						<SettingsItemList
							onPress={() =>
								router.push(
									'/(protected)/profile/[user]/security/change-password'
								)
							}
							title="Change Password"
						/>
						<SettingsItemList
							title="Delete My Account"
							withBorder={false}
							onPress={() =>
								router.push(
									'/(protected)/profile/[user]/security/delete-account'
								)
							}
							textColor="text-primary"
						/>
					</View>
				</View>
			</BodyScrollView>
		</>
	);
}
