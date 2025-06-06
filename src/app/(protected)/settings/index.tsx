import * as React from 'react';

import { Alert, View } from 'react-native';
import { router } from 'expo-router';
import SettingsItemList from '@/components/settings/SettingsItemList';
import { BodyScrollView } from '@/components/layouts/BodyScrollView';

export default function SettingsScreen() {
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
				</View>
			</BodyScrollView>
		</>
	);
}
