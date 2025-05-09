import { MessageListItem } from '@/components/contents/MessageListItem';
import SmartphoneChatIcon from '@/components/icons/SmartphoneChatIcon';
import ConnectionsListSelectBottomSheet from '@/components/modals/ConnectionsListSelectBottomSheet';
import CreateButton from '@/components/shared/CreateButton';
import EmptyStateWrapper from '@/components/shared/EmptyStateWrapper';
import { Box, Heading, Icon, Text, View } from '@/components/ui';
import { useStore } from '@/store';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Search } from 'lucide-react-native';
import React from 'react';
import { RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function MessageScreen() {
	const [friendsModal, setFriendsModal] = React.useState(false);
	const me = useStore((state) => state.me);
	const router = useRouter();
	const [loading, setLoading] = React.useState(false);
	const [refreshing, setRefreshing] = React.useState(false);

	async function refetch() {}
	const onNewChat = () => {
		setFriendsModal(true);
	};
	async function onRefresh() {
		try {
			setRefreshing(true);
			await refetch();
		} catch (error) {
		} finally {
			setRefreshing(false);
		}
	}
	const isEmpty = true;
	return (
		<>
			<Box className="flex-1">
				<EmptyStateWrapper
					loading={loading}
					isEmpty={isEmpty}
					illustration={<SmartphoneChatIcon className="relative left-4" />}
					text="You don't have any message in your inbox"
					refreshControl={
						<RefreshControl refreshing={loading} onRefresh={refetch} />
					}>
					<View className="flex-1 bg-white">
						<View className="px-4 pb-2">
							<View className="flex-row items-center h-8 bg-gray-100 rounded-lg px-2.5">
								<Icon as={Search} className="text-gray-600 " />
								<Text className="text-typography/80 text-sm pl-2">
									Search inbox
								</Text>
							</View>
						</View>
						<FlashList
							data={[]}
							refreshControl={
								<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
							}
							ListHeaderComponent={
								// chats.length ? (
								<View className="px-4 pt-4">
									<Text className=" text-lg">Inbox</Text>
								</View>
								// ) : null
							}
							ListFooterComponent={<View className="h-16"></View>}
							// keyExtractor={(item) => item.id}
							renderItem={({ item }) => (
								<MessageListItem chat={item} me={me as any} />
							)}
							estimatedItemSize={92}
						/>
					</View>
				</EmptyStateWrapper>
			</Box>
			<CreateButton onPress={onNewChat} />
			{friendsModal && (
				<ConnectionsListSelectBottomSheet
					visible={friendsModal}
					onDismiss={() => setFriendsModal(false)}
					onSelect={(member) => {
						router.push({
							pathname: '/(protected)/message/[chatId]',
							params: {
								chatId: `${member.id}_${me?.id}`,
							},
						});
					}}
					title="Start a conversation"
					RightComponent={() => (
						<View className="px-2 py-1 border border-black-900 rounded-md">
							<Text className="text-black-900">Say hi</Text>
						</View>
					)}
				/>
			)}
		</>
	);
}
