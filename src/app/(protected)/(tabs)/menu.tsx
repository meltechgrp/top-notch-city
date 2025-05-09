import {
	Box,
	Button,
	ButtonText,
	ImageBackground,
	Text,
	View,
} from '@/components/ui';
import { Stack, usePathname, useRouter } from 'expo-router';
import { ScrollView, Share } from 'react-native';
import React from 'react';
import { useTheme } from '@/components/layouts/ThemeProvider';
import LogoutAlertDialog from '@/components/shared/LogoutAlertDialog';
import {
	Mail,
	NotebookText,
	ReceiptText,
	Settings,
	Share2,
	Sparkle,
	User2,
} from 'lucide-react-native';
import { MenuListItem } from '@/components/menu/MenuListItem';
import config from '@/config';
import { LogoutButton } from '@/components/menu/LogoutButton';
import { Divider } from '@/components/ui/divider';
import { cn, formatToNaira } from '@/lib/utils';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import NotificationBarButton from '@/components/notifications/NotificationBarButton';
import { Colors } from '@/constants/Colors';
import { useStore } from '@/store';

export default function More() {
	const me = useStore((v) => v.me);
	const router = useRouter();
	const pathname = usePathname();
	const { theme } = useTheme();
	const [openLogoutAlertDialog, setOpenLogoutAlertDialog] =
		React.useState(false);
	async function onInvite() {
		try {
			const result = await Share.share({
				message: 'Invite your friends to join the MyNebor app',
			});
			if (result.action === Share.sharedAction) {
				if (result.activityType) {
					// shared with activity type of result.activityType
				} else {
					// shared
				}
			} else if (result.action === Share.dismissedAction) {
				// dismissed
			}
		} catch (error: any) {
			alert(error.message);
		}
	}
	return (
		<>
			<Stack.Screen
				options={{
					headerStyle: {
						backgroundColor:
							theme == 'dark'
								? Colors.light.background
								: Colors.dark.background,
					},
					headerTitleStyle: {
						color: theme == 'dark' ? 'white' : 'black',
					},
					headerRight: () => (
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}
							className=" px-4">
							<NotificationBarButton className=" bg-transparent rounded-none" />
						</View>
					),
				}}
			/>
			{/* <ImageBackground
				source={require('@/assets/images/landing/home.png')}
				className="flex-1"> */}
			<Box
				className={cn(
					'flex-1 '
					// theme == 'dark' ? 'bg-background-dark/90' : 'bg-background-light/90'
				)}>
				<ScrollView
					style={{ display: 'flex' }}
					showsVerticalScrollIndicator={false}
					contentContainerClassName="pb-40">
					<View className="px-4 py-4 relative mt-2 bg-background-info/90">
						<View className=" items-center">
							{/* {walletLoading ? (
										<WalletLoadingSkeleton />
									) : ( */}
							<Text size="3xl" className=" font-heading">
								{formatToNaira(500000, 2)}
							</Text>
							{/* )} */}
							<Text className="text-sm text-typography/80 text-center">
								Wallet balance
							</Text>
						</View>
						<View className="mt-4 px-8 flex-row gap-8 justify-between">
							<Button
								action="primary"
								className="flex-1"
								style={{ height: 43 }}>
								<ButtonText>Deposit</ButtonText>
							</Button>
							<Button
								variant="outline"
								className="flex-1"
								style={{ height: 43 }}>
								<ButtonText>Cashout</ButtonText>
							</Button>
						</View>
					</View>
					<View className="pt-8 flex-1">
						<Text className="text-sm text-typography/80 uppercase px-4 mb-2">
							Profile Menu
						</Text>
						<View className="flex-1">
							<ScrollView
								contentContainerClassName="px-4"
								showsVerticalScrollIndicator={false}>
								<Divider className=" h-[0.3px] mb-4 opacity-50" />
								<MenuListItem
									title="Profile"
									description="View and edit your account details"
									onPress={() => {
										// me &&
										router.push({
											pathname: '/(protected)/profile/[user]',
											params: {
												user: 'hghjhgjhj',
												ref: pathname,
											},
										});
									}}
									icon={User2}
									iconColor="primary"
									className=" py-2"
								/>
								<Divider className=" h-[0.3px] mb-4 opacity-50" />
								<MenuListItem
									title="Push Notifications"
									description="Configure app notifications"
									onPress={() => {}}
									icon={Mail}
									iconColor="success"
									className=" py-2"
								/>
								<Divider className=" h-[0.3px] mb-4 opacity-50" />
								<MenuListItem
									title="Wishlist"
									description="View all your saved properties"
									onPress={() => {
										// me && router.push('/account/transactions');
									}}
									icon={ReceiptText}
									iconColor="blue-500"
									className=" py-2"
								/>
								<Divider className=" h-[0.3px] mb-4 opacity-50" />
								<MenuListItem
									title="Security"
									description="protect yourself from intruders"
									onPress={() => {
										// router.push('/settings/');
									}}
									icon={Settings}
									iconColor="gray-500"
									className=" py-2"
								/>
								<Divider className=" h-[0.3px] mb-4 opacity-50" />
								<MenuListItem
									title="Write a review"
									description="Let's improve the app"
									onPress={() => {}}
									icon={NotebookText}
									className="py-2"
									iconColor="primary"
								/>
								<Divider className=" h-[0.3px] mb-4 opacity-50" />
								<MenuListItem
									title="Invite friends"
									description={`Invite your friends to join ${config.appName} app`}
									icon={Share2}
									className=" py-2"
									iconColor="tertiary-300"
									onPress={() => {
										// router.push('/account/invite-friends');
									}}
								/>
								<Divider className=" h-[0.3px] mb-4 opacity-50" />
								<MenuListItem
									title="Become an Agent"
									description={`Join us as an agent to earn more`}
									icon={Sparkle}
									className="py-2"
									iconColor="primary"
									onPress={() => {
										// router.push('/account/invite-friends');
									}}
								/>
								<Divider className=" h-[0.3px] mb-4 opacity-50" />
								<MenuListItem
									title="Help and Support"
									description="Get help and support"
									onPress={() => {
										// router.push('/help-and-support');
									}}
									icon={Sparkle}
									className="py-2"
									iconColor="primary"
								/>
								<Divider className=" h-[0.3px] mb-4 opacity-50" />
								<LogoutButton />
							</ScrollView>
						</View>
					</View>
					<LogoutAlertDialog
						setOpenLogoutAlertDialog={setOpenLogoutAlertDialog}
						openLogoutAlertDialog={openLogoutAlertDialog}
					/>
				</ScrollView>
			</Box>
			{/* </ImageBackground> */}
		</>
	);
}

//wallet loading skeleton
export function WalletLoadingSkeleton() {
	return (
		<MotiView
			transition={{
				type: 'timing',
			}}
			className="py-2 flex flex-row items-center">
			<Skeleton colorMode="light" width="100%" height={36} />
		</MotiView>
	);
}
