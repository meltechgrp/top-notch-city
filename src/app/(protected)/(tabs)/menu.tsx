import {
	Avatar,
	AvatarBadge,
	AvatarFallbackText,
	AvatarImage,
	Box,
	Icon,
	ImageBackground,
	Pressable,
	Text,
	View,
} from '@/components/ui';
import { Stack, usePathname, useRouter } from 'expo-router';
import { ScrollView, Share } from 'react-native';
import React from 'react';
import { useTheme } from '@/components/layouts/ThemeProvider';
import LogoutAlertDialog from '@/components/shared/LogoutAlertDialog';
import {
	ChevronRight,
	Mail,
	NotebookText,
	Settings,
	Share2,
	Sparkle,
	User2,
} from 'lucide-react-native';
import { MenuListItem } from '@/components/menu/MenuListItem';
import config from '@/config';
import { LogoutButton } from '@/components/menu/LogoutButton';
import { Divider } from '@/components/ui/divider';
import { cn } from '@/lib/utils';
import NotificationBarButton from '@/components/notifications/NotificationBarButton';
import { profileDefault, useStore } from '@/store';
import { BodyScrollView } from '@/components/layouts/BodyScrollView';

export default function More() {
	const me = useStore((v) => v.me);
	const router = useRouter();
	const pathname = usePathname();
	const { theme } = useTheme();
	async function onInvite() {
		try {
			const result = await Share.share({
				message: 'Invite your friends to join TopNotch City Estate.',
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
			<BodyScrollView withBackground={true}>
				<View
					className={cn(
						'px-4 py-2 mt-2',
						theme == 'dark'
							? 'bg-background-muted/95'
							: 'bg-background-muted/60'
					)}>
					<Pressable
						onPress={() => {
							router.push({
								pathname: '/(protected)/profile/[user]',
								params: {
									user: 'hghjhgjhj',
									ref: pathname,
								},
							});
						}}
						className={'flex-row items-center'}>
						<Avatar className=" w-20 h-20">
							<AvatarFallbackText>Humphrey Joshua</AvatarFallbackText>
							<AvatarBadge size="md" />
							<AvatarImage
								source={
									me?.photo
										? {
												uri: me?.photo,
											}
										: profileDefault
								}
							/>
						</Avatar>
						<View className="flex-1 pl-3">
							<Text className="text-base font-medium">Humphrey Joshua</Text>
							<Text className="text-sm text-typography/80">
								View profile record and engagements
							</Text>
						</View>
						<Icon as={ChevronRight} className="text-primary" />
					</Pressable>
				</View>
				<View className="pt-8 flex-1 px-4">
					<Text className="text-sm text-typography/80 uppercase px-4 mb-2">
						Profile Menu
					</Text>
					<View className="flex-1 mt-2">
						<MenuListItem
							title="Dashboard"
							description="View admin dashboard"
							onPress={() => {
								router.push({
									pathname: '/(protected)/admin',
									params: {
										user: 'hghjhgjhj',
										ref: pathname,
									},
								});
							}}
							icon={User2}
							iconColor="primary"
							className=" py-2 pb-3"
						/>
						<Divider className=" h-[0.3px] bg-background-info mb-4" />
						<MenuListItem
							title="Account"
							description="View and edit your account details"
							onPress={() => {
								// me &&
								router.push({
									pathname: '/(protected)/account',
									params: {
										user: 'hghjhgjhj',
										ref: pathname,
									},
								});
							}}
							icon={User2}
							iconColor="primary"
							className=" py-2 pb-3"
						/>
						<Divider className=" h-[0.3px] bg-background-info mb-4" />
						<MenuListItem
							title="Settings"
							description="Change your theme and other settings"
							onPress={() => {
								router.push('/settings');
							}}
							icon={Settings}
							iconColor="gray-500"
							className=" py-2 pb-3"
						/>
						<Divider className=" h-[0.3px] bg-background-info mb-4" />
						<MenuListItem
							title="Write a review"
							description="Let's improve the app"
							onPress={() => {}}
							icon={NotebookText}
							className="py-2"
							iconColor="primary"
						/>
						<Divider className=" h-[0.3px] bg-background-info mb-4" />
						<MenuListItem
							title="Invite friends"
							description={`Invite your friends to join ${config.appName} app`}
							icon={Share2}
							className=" py-2 pb-3"
							iconColor="tertiary-300"
							onPress={onInvite}
						/>
						<Divider className=" h-[0.3px] bg-background-info mb-4" />
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
						<Divider className=" h-[0.3px] bg-background-info mb-4" />
						<MenuListItem
							title="Help and Support"
							description="Get help and support"
							onPress={() => {
								router.push('/support');
							}}
							icon={Sparkle}
							className="py-2"
							iconColor="primary"
						/>
					</View>
				</View>
			</BodyScrollView>
		</>
	);
}
