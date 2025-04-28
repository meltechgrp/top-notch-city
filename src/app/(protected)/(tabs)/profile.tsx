import { Text, View } from '@/components/ui';
import { router } from 'expo-router';
import { HelpCircle, List, Lock, LogOutIcon } from 'lucide-react-native';
import { Pressable } from 'react-native';
import React, { useState } from 'react';
// import SignoutBottomSheet from '@/components/modals/Signout';
import { Avatar } from '@/components/ui';
import SettingsItemList from '@/components/settings/SettingsItemList';
import { BodyScrollView } from '@/components/layouts/BodyScrollView';

export default function Profile() {
	// const me = useStore((v) => v.me);
	const [signoutBottomSheet, setSignoutBottomSheeet] = useState(false);

	return (
		<BodyScrollView>
			<View className="px-6 pt-6 pb-10 gap-8">
				<Pressable
					// onPress={() => router.push('/account')}
					className="flex-row bg-secondary rounded-2xl p-4 gap-3 items-center">
					{/* <Avatar
							border
							path={me?.photo?.path}
							size={50}
							name={fullName(me)}
						/> */}
					<View className="flex-1 bg-transparent gap-1">
						<Text className="text-lg font-semibold">Humphrey Joshua</Text>
						<Text className="text-muted-foreground text-sm">
							joshuahumphrey579@gmail.com
						</Text>
					</View>
				</Pressable>
				<View className=" gap-4">
					<View>
						<Text>Setting</Text>
					</View>
					<View className="bg-secondary rounded-2xl py-1">
						{data.map((item, i) => (
							<SettingsItemList
								Icon={
									<View className="bg-transparent">
										<item.icon color={'black'} width={18} height={16} />
									</View>
								}
								withBorder={i !== data.length - 1 ? true : false}
								key={item.name}
								title={item.name}
								onPress={() => item.path && router.push(item.path as any)}
							/>
						))}
					</View>

					<SettingsItemList
						Icon={
							<View className="bg-transparent">
								<LogOutIcon color={'black'} width={16} height={16} />
							</View>
						}
						withArrow={false}
						withBorder={false}
						className=" bg-secondary"
						title={'Sign Out'}
						onPress={() => setSignoutBottomSheeet(true)}
					/>
				</View>
			</View>
			{/* <SignoutBottomSheet
				visible={!!signoutBottomSheet}
				onDismiss={() => setSignoutBottomSheeet(false)}
			/> */}
		</BodyScrollView>
	);
}

const data = [
	{
		name: 'My Listing',
		icon: List,
		path: '/account',
	},
	{
		name: 'Security',
		icon: Lock,
		path: '/e/(tabs)',
	},
	{
		name: 'Help and Support',
		icon: HelpCircle,
		path: '/profile/sos',
	},
];
