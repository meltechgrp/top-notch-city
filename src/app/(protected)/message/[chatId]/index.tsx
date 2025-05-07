import * as React from 'react';

import { KeyboardAvoidingView, Pressable, View } from 'react-native';

import ChatRoom from '@/components/chat/ChatRoom';
import { fullName } from '@/lib/utils';
// import ChatRoomProfile from '@/components/chat/ChatRoomProfile';
import eventBus from '@/lib/eventBus';
import { Stack, useLocalSearchParams } from 'expo-router';
import Platforms from '@/constants/Plaforms';
// import ReportBottomSheet from '@/components/modals/ReportBottomSheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomScreenHeader from '@/components/layouts/CustomScreenHeader';
import { useChatStore, useStore } from '@/store';
import { Avatar, AvatarFallbackText, AvatarImage, Text } from '@/components/ui';
// import { ReportReferenceType } from '@/graphql-types/index.gql';

export default function ChatRoomScreen() {
	const { chatId: id, msg } = useLocalSearchParams<{
		chatId: string;
		msg?: string;
	}>();
	const chatId = id as string;
	const text = msg ? decodeURIComponent(msg || '') : '';
	const isProfileSheetOpen = useChatStore((s) => s.isProfileOpen);
	const toggleProfileSheet = useChatStore((s) => s.toggleProfile);
	const [reportBottomSheetVisible, setReportBottomSheetVisible] =
		React.useState(false);
	const [reportData, setReportData] = React.useState<any>(null);

	return (
		<>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
			/>
			<View className="flex-1 bg-white ">
				<SafeAreaView edges={['top', 'bottom']} style={{ flex: 1 }}>
					<CustomScreenHeader
						headerCenterContent={<ScreenHeaderTitleSection />}
					/>
					<View className="flex-1">
						<KeyboardAvoidingView
							className="flex-1"
							behavior={Platforms.isIOS() ? 'padding' : 'height'}
							keyboardVerticalOffset={Platforms.isIOS() ? 100 : 0}>
							<ChatRoom
								chatId={chatId}
								ChatRoomFooterProps={{
									placeholder: 'Write a message',
									defaultText: text,
								}}
							/>
							{/* {isProfileSheetOpen && (
								<ChatRoomProfile
									chatId={chatId}
									visible={isProfileSheetOpen}
									onDismiss={() => toggleProfileSheet(false)}
									onRefresh={() => {
										eventBus.dispatchEvent('REFRESH_CHAT', {
											chatId,
										});
									}}
									onReport={(reportData: any) => {
										setReportBottomSheetVisible(true);
										setReportData(reportData);
									}}
								/>
							)} */}
						</KeyboardAvoidingView>
						{/* <ReportBottomSheet
							onDismiss={() => setReportBottomSheetVisible(false)}
							visible={reportBottomSheetVisible}
							title="Report profile"
							description="Please do provide the necessary information to the admin so that they can resolve the issue"
							data={{
								chatId,
								...reportData,
							}}
							referenceType={ReportReferenceType.ProfileChat}
							referenceId={chatId}
						/> */}
					</View>
				</SafeAreaView>
			</View>
		</>
	);
}

function ScreenHeaderTitleSection() {
	const me = useStore((s) => s.me);
	const { getOppositeUser, toggleProfile, chat } = useChatStore((s) => ({
		getOppositeUser: s.getOppositeUser,
		toggleProfile: s.toggleProfile,
		chat: s.chat,
	}));
	const oppositeUser = React.useMemo(
		() => getOppositeUser(me?.id),
		[me, JSON.stringify(chat)]
	);

	return (
		<View className="flex-1 flex flex-row items-center">
			<Pressable
				onPress={() => toggleProfile(true)}
				className="active:bg-gray-100 active:rounded-full flex-row items-center pr-3">
				<Avatar className="bg-background-muted w-20 h-20">
					<AvatarFallbackText>Humphrey Joshua</AvatarFallbackText>
					<AvatarImage
						source={{
							uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
						}}
					/>
				</Avatar>
				<Text numberOfLines={1} className="ml-2 text-base text-black-900">
					{fullName(oppositeUser?.user)}
				</Text>
			</Pressable>
		</View>
	);
}
