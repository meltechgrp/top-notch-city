import { MessageListItem } from '@/components/contents/MessageListItem';
import SmartphoneChatIcon from '@/components/icons/SmartphoneChatIcon';
import StartChatBottomSheet from '@/components/modals/StartChatBottomSheet';
import CreateButton from '@/components/shared/CreateButton';
import EmptyStateWrapper from '@/components/shared/EmptyStateWrapper';
import { Box, View } from '@/components/ui';
import { useStore } from '@/store';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React from 'react';
import { RefreshControl } from 'react-native';

export default function MessageScreen() {
	const [friendsModal, setFriendsModal] = React.useState(false);
	const me = useStore((state) => state.me);
	const router = useRouter();
	const [loading, setLoading] = React.useState(false);
	const [refreshing, setRefreshing] = React.useState(false);
	const data = [
		{
			id: 'hbhdjbjhde',
			firstName: 'John',
			lastName: 'Daniels',
			message:
				'This is a test message, This is a long test message for testing',
			createdAt: new Date(Date.now()),
			unreadCount: 1,
		},
		{
			id: 'dnnmkedk',
			firstName: 'Mark',
			lastName: 'Jacobs',
			message: 'Listed property for sale, details below',
			createdAt: new Date(Date.now()),
			unreadCount: 4,
		},
		{
			id: 'djkkede',
			firstName: 'Humphrey',
			lastName: 'Mike',
			message: 'How is the family today?',
			createdAt: new Date(Date.now()),
			unreadCount: 9,
		},
		{
			id: 'jjjjjhjkjk',
			firstName: 'Anita',
			lastName: 'Smith',
			message: 'How is the weather over there',
			createdAt: new Date(Date.now()),
			unreadCount: 5,
		},
	];
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
	const isEmpty = false;
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
					<View className="flex-1">
						<FlashList
							data={data}
							refreshControl={
								<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
							}
							ListFooterComponent={<View className="h-16"></View>}
							keyExtractor={(item) => item.id}
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
				<StartChatBottomSheet
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
				/>
			)}
		</>
	);
}
