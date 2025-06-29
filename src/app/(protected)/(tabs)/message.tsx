import { MessageListItem } from '@/components/contents/MessageListItem';
import SmartphoneChatIcon from '@/components/icons/SmartphoneChatIcon';
import StartChatBottomSheet from '@/components/modals/StartChatBottomSheet';
import CreateButton from '@/components/shared/CreateButton';
import EmptyStateWrapper from '@/components/shared/EmptyStateWrapper';
import { Box, View } from '@/components/ui';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { useStore } from '@/store';
import { FlashList } from '@shopify/flash-list';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { RefreshControl } from 'react-native';

export default function MessageScreen() {
	const { chat } = useLocalSearchParams() as { chat: string };
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
	useEffect(() => {
		console.log(chat);
		if (chat && chat == 'new') {
			setFriendsModal(true);
		}
	}, [chat]);
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
					<View className="flex-1">
						<FlashList
							data={[]}
							refreshControl={
								<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
			{me && <CreateButton onPress={onNewChat} />}
			{me && friendsModal && (
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
					me={me}
				/>
			)}
		</>
	);
}
