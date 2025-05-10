import * as React from 'react';
import {
	ActivityIndicator,
	FlatList,
	ListRenderItem,
	NativeScrollEvent,
	NativeSyntheticEvent,
	View,
} from 'react-native';
// import ChatRoomFooter from '@/components/chat/ChatRoomFooter'
// import ChatRoomMessage from '@/components/chat/ChatRoomMessage'
import { useChatStore, useStore } from '@/store';
// import { MockedMessage } from '@/components/chat/types'
import debounce from 'lodash-es/debounce';
// import { MessageStatus } from '@/graphql-types/index.gql'
// import useChatMessages from '@/components/chat/useChatMessages'
// import useMakeMessageDeliveredAndRead from '@/components/chat/useMakeMessageReadAndDelivered'
import { router, useFocusEffect } from 'expo-router';
// import MediaViewerScreen from '@/components/contents/MediaViewerScreen'
import useMessageActions from '@/components/chat/useMessageActions';
// import MessageActionsBottomSheet from '@/components/chat/MessageActionsBottomSheet'
import { cn } from '@/lib/utils';
// import EditOverlay from '@/components/chat/EditOverlay'
// import { EditorComponentRefHandle } from '@/components/form/Editor'
// import useClearChatPushNotification from '@/components/chat/useClearChatPushNotification'
// import useSuppressChatPushNotification from '@/components/chat/useSuppressChatPushNotification'
import eventBus from '@/lib/eventBus';
import { Text } from '../ui';
import ChatRoomMessage from './ChatRoomMessage';
import ChatRoomFooter from './ChatRoomFooter';
import EditOverlay from './EditOverlay';

/**
 * @note
 * All offsets are relative to the bottom of the FlatList container
 * (except otherwise implied by the binding name) because the Flatlist is inverted
 */

const InitialNumToRender = 30;
type Props = {
	isGroupChat?: boolean;
	chatId: string;
	ChatRoomFooterProps?: any;
	forceUpdate?: 'true';
	inTab?: boolean;
	isTabActive?: boolean;
};
export default function ChatRoom(props: Props) {
	const {
		isGroupChat,
		ChatRoomFooterProps = {},
		chatId: id,
		forceUpdate,
		inTab,
		isTabActive,
	} = props;
	const [chatId, setChatId] = React.useState(id);
	const me = useStore((s) => s.me);
	const { updateChat } = useChatStore();
	const [refreshing, setRefreshing] = React.useState(false);
	const layouts = React.useRef<{
		[key: string]: { width: number; height: number };
	}>({});
	const listRef = React.useRef<FlatList<any> | null>(null);

	// useClearChatPushNotification(chatId)
	// useSuppressChatPushNotification(chatId)

	function isCompositeId(_chatId: string) {
		return _chatId.includes('#');
	}
	const messages = React.useMemo(
		() =>
			[
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
			] as any,
		[]
	);
	// React.useEffect(() => {
	//   if (isCompositeId(chatId) && chat?.id) {
	//     setChatId(chat?.id)
	//   }
	// }, [chatId, chat])

	// make last received message delivered and read in chatroom
	// React.useEffect(() => {
	//   // don't mark read if split chat tab isn't active
	//   if (inTab && !isTabActive) return

	//   if (messages?.length) {
	//     const latestMessage = messages[0]
	//     const latestMessageId = latestMessage.id

	//     if (
	//       latestMessage.status === MessageStatus.Sent &&
	//       latestMessage.sender?.id !== me?.id
	//     ) {
	//       makeMessageReadAndDelivered({
	//         messageId: latestMessageId,
	//         chatId,
	//       })
	//     }
	//   }
	// }, [messages, chatId, inTab, isTabActive])

	const [listContainerHeight, setListContainerHeight] = React.useState(0);

	// const getSender = React.useCallback(
	//   (message: Message) => {
	//     if (!message) return null
	//     return chat?.members.find((m) => m.user.id === message?.sender?.id)?.user
	//   },
	//   [chat]
	// )

	const getOffset = React.useCallback(
		(index: number) => {
			return Object.keys(layouts.current).reduce((acc, cur) => {
				if (+cur <= index) {
					return acc + layouts.current[cur].height;
				}
				return acc;
			}, 0);
		},
		[layouts]
	);

	function watchScroll(ev: NativeSyntheticEvent<NativeScrollEvent>) {
		if (messages.length >= InitialNumToRender) {
			const { y } = ev.nativeEvent.contentOffset;
			const earliestMessageOffset = getOffset(messages.length - 1);
			const scrollOffsetFromTop =
				earliestMessageOffset - (y + listContainerHeight);

			if (scrollOffsetFromTop < 200 && !refreshing) {
				// ! This causes the component to freeze until the refresh is complete.
				// ! This is because we are updating the `refreshing` state in the `onRefresh` function and also accessing it here (afaik)
			}
		}
	}

	// onScroll
	const onScroll = React.useCallback(debounce(watchScroll, 100), [
		messages,
		refreshing,
		listContainerHeight,
	]);

	const scrollToBottom = () => {
		listRef.current?.scrollToOffset({ animated: true, offset: 0 });
	};

	function onRefreshChat() {
		// refetch()
	}

	const {
		activeQuoteMessage,
		handleMessageLongPress,
		selectedMessage,
		setActiveQuoteMessage,
		showMessageActionsModal,
		handleReply,
		setShowMessageActionsModal,
		handleDelete,
		isDeletingMessageId,
		isEditing,
		exitEditMode,
		handleEdit,
	} = useMessageActions({ focusEditor, setEditorText });
	async function refetch() {}
	const editorRef = React.useRef<any>(null);
	function focusEditor() {
		editorRef.current?.focus && editorRef.current?.focus();
	}
	function setEditorText(text: string) {
		editorRef.current?.setText(text);
	}
	const getSender = React.useCallback((message: any) => {
		if (!message) return null;
		return null;
	}, []);
	const renderItem: ListRenderItem<any> = React.useCallback(
		({ item, index }) => {
			return (
				<ChatRoomMessage
					key={item.id}
					sender={getSender(item as any) as any}
					qouteSender={getSender((item as any).qoute as any) as any}
					me={me as any}
					message={item as any}
					isGroupChat={isGroupChat}
					className={cn(index === messages.length - 1 ? 'mt-4' : '')}
					onLongPress={handleMessageLongPress}
					isDeleting={isDeletingMessageId === item.id}
				/>
			);
		},
		[messages, isDeletingMessageId]
	);

	// React.useEffect(() => {
	//   if (data?.chat) {
	//     updateChat?.(data.chat)
	//   }
	// }, [data])

	React.useEffect(() => {
		console.log('refreshing chat');
		eventBus.addEventListener('REFRESH_CHAT', refetch);

		return () => {
			eventBus.removeEventListener('REFRESH_CHAT', refetch);
		};
	}, []);

	useFocusEffect(
		React.useCallback(() => {
			if (forceUpdate) {
				refetch();
			}
		}, [])
	);

	const chatMessages = [
		{
			id: '1',
			text: 'Hey, how are you doing?',
			createdAt: '2025-05-09T09:00:00Z',
			status: 'sent',
			sender: {
				id: 'user1',
				firstName: 'Divine',
				lastName: 'Okoro',
			},
		},
		{
			id: '2',
			text: "I'm good, just got home. You?",
			createdAt: '2025-05-09T09:01:00Z',
			status: 'delivered',
			sender: {
				id: 'user2',
				firstName: 'Humphrey',
				lastName: 'James',
			},
		},
		{
			id: '3',
			text: "That's great. I'm just relaxing.",
			createdAt: '2025-05-09T09:02:00Z',
			status: 'seen',
			sender: {
				id: 'user1',
				firstName: 'Divine',
				lastName: 'Okoro',
			},
		},
		{
			id: '4',
			text: 'Did you eat already?',
			createdAt: '2025-05-09T09:03:00Z',
			status: 'seen',
			sender: {
				id: 'user1',
				firstName: 'Divine',
				lastName: 'Okoro',
			},
		},
		{
			id: '5',
			text: 'Not yet. Was waiting to hear from you first 😊',
			createdAt: '2025-05-09T09:04:00Z',
			status: 'seen',
			sender: {
				id: 'user2',
				firstName: 'Humphrey',
				lastName: 'James',
			},
		},
		{
			id: '6',
			text: 'Awww, that’s sweet of you 😍',
			createdAt: '2025-05-09T09:05:00Z',
			status: 'seen',
			sender: {
				id: 'user1',
				firstName: 'Divine',
				lastName: 'Okoro',
			},
		},
		{
			id: '7',
			text: 'Let’s order something?',
			createdAt: '2025-05-09T09:06:00Z',
			status: 'sent',
			sender: {
				id: 'user1',
				firstName: 'Divine',
				lastName: 'Okoro',
			},
		},
		{
			id: '8',
			text: 'Sure! What do you feel like eating?',
			createdAt: '2025-05-09T09:07:00Z',
			status: 'delivered',
			sender: {
				id: 'user2',
				firstName: 'Humphrey',
				lastName: 'James',
			},
		},
		{
			id: '9',
			text: 'Maybe something spicy today!',
			createdAt: '2025-05-09T09:08:00Z',
			status: 'seen',
			sender: {
				id: 'user1',
				firstName: 'Divine',
				lastName: 'Okoro',
			},
		},
		{
			id: '10',
			text: 'Great choice. I’ll check JumiaFood now.',
			createdAt: '2025-05-09T09:09:00Z',
			status: 'seen',
			sender: {
				id: 'user2',
				firstName: 'Humphrey',
				lastName: 'James',
			},
		},
		{
			id: '11',
			text: 'Found anything yet?',
			createdAt: '2025-05-09T09:10:00Z',
			status: 'sent',
			sender: {
				id: 'user1',
				firstName: 'Divine',
				lastName: 'Okoro',
			},
		},
		{
			id: '12',
			text: 'Yes, there’s this suya platter with jollof 😋',
			createdAt: '2025-05-09T09:11:00Z',
			status: 'delivered',
			sender: {
				id: 'user2',
				firstName: 'Humphrey',
				lastName: 'James',
			},
		},
		{
			id: '13',
			text: 'Order it then 😍',
			createdAt: '2025-05-09T09:12:00Z',
			status: 'seen',
			sender: {
				id: 'user1',
				firstName: 'Divine',
				lastName: 'Okoro',
			},
		},
		{
			id: '14',
			text: 'Done! ETA 30 mins.',
			createdAt: '2025-05-09T09:13:00Z',
			status: 'seen',
			sender: {
				id: 'user2',
				firstName: 'Humphrey',
				lastName: 'James',
			},
		},
		{
			id: '15',
			text: 'You’re the best ❤️',
			createdAt: '2025-05-09T09:14:00Z',
			status: 'seen',
			sender: {
				id: 'user1',
				firstName: 'Divine',
				lastName: 'Okoro',
			},
		},
		{
			id: '16',
			text: 'Only for you 😉',
			createdAt: '2025-05-09T09:15:00Z',
			status: 'seen',
			sender: {
				id: 'user2',
				firstName: 'Humphrey',
				lastName: 'James',
			},
		},
		{
			id: '17',
			text: 'Let’s watch something while we wait?',
			createdAt: '2025-05-09T09:16:00Z',
			status: 'sent',
			sender: {
				id: 'user1',
				firstName: 'Divine',
				lastName: 'Okoro',
			},
		},
		{
			id: '18',
			text: 'Yesss, pick something nice on Netflix.',
			createdAt: '2025-05-09T09:17:00Z',
			status: 'delivered',
			sender: {
				id: 'user2',
				firstName: 'Humphrey',
				lastName: 'James',
			},
		},
		{
			id: '19',
			text: 'Romcom or action?',
			createdAt: '2025-05-09T09:18:00Z',
			status: 'seen',
			sender: {
				id: 'user1',
				firstName: 'Divine',
				lastName: 'Okoro',
			},
		},
		{
			id: '20',
			text: 'Romcom! I wanna laugh with you 🤭',
			createdAt: '2025-05-09T09:19:00Z',
			status: 'seen',
			sender: {
				id: 'user2',
				firstName: 'Humphrey',
				lastName: 'James',
			},
		},
		{
			id: '21',
			text: 'Still there?. i want to tell you something. it is not that serious but i want to tell you something. it is not that serious but i want to tell you something. it is not that serious but i want to tell you something. it is not that serious but i want to tell you something. it is not that serious but i want to tell you something. it is not that serious but i want to tell you something. it is not that serious but i want to tell you something. it is not that serious but i want to tell you something. it is not that serious but i want to tell you something. it is not that serious but i want to tell you something. it is not that serious but i want to tell you something. it is not that serious but i want to tell you something. it is not that serious but i want to tell you something. it is not that serious but i want to tell you something. it is not that serious but i want to tell you something. it is not that serious but i want to tell you something',
			createdAt: '2025-05-09T09:20:00Z',
			status: 'sent',
			sender: {
				id: 'user2',
				firstName: 'Humphrey',
				lastName: 'James',
			},
		},
	];

	return (
		<View className="flex-1 w-full">
			<View className="flex-1 w-full">
				<FlatList
					scrollEnabled={refreshing ? false : true}
					keyboardShouldPersistTaps="handled"
					ref={(r) => (listRef.current = r)}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{
						justifyContent: 'flex-end',
						flexGrow: 1,
						paddingBottom: 10,
					}}
					renderItem={renderItem}
					data={chatMessages.reverse()}
					initialNumToRender={InitialNumToRender}
					onScroll={(ev) => {
						ev.persist();
						onScroll(ev);
					}}
					inverted
					ListFooterComponent={
						<View className="w-full">
							{refreshing && (
								<View className="  justify-center items-center w-full z-50">
									<ActivityIndicator
										size="large"
										className="text-primary-900"
									/>
								</View>
							)}
						</View>
					}
					onLayout={(e) => {
						const { height } = e.nativeEvent.layout;
						setListContainerHeight(height);
					}}
				/>
				{/* {(isLoadingChat || isLoadingMessages) && !messages.length ? (
          <View className="h-full justify-center items-center w-full z-50">
            <ActivityIndicator size="large" className="text-primary-900" />
            <Text className="text-gray-700 text-sm mt-2">
              Loading messages...
            </Text>
          </View>
        ) : null} */}
				{!messages.length && <EmptyScreen message={'This space is empty'} />}
				<EditOverlay
					visible={isEditing}
					onDismiss={() => exitEditMode()}
					activeMessage={selectedMessage}
				/>
			</View>
			<ChatRoomFooter
				onUpdate={onRefreshChat}
				chatId={chatId}
				onPost={(msg, isEdit) => {
					// handleSendMessage(msg, isEdit)
					exitEditMode();
					if (!isEdit) {
						scrollToBottom();
					}
				}}
				activeQuoteMsg={activeQuoteMessage}
				clearActiveQuoteMsg={() => {
					setActiveQuoteMessage(undefined);
				}}
				ref={editorRef}
				isEditing={isEditing}
				selectedMessage={selectedMessage}
				{...ChatRoomFooterProps}
				className="pb-0 bg-background-info border-t border-outline"
			/>
			{/* <MessageActionsBottomSheet
        visible={showMessageActionsModal}
        onDismiss={() => setShowMessageActionsModal(false)}
        handleReply={handleReply}
        handleDelete={() =>
          handleDelete((message) => {
            updateStoreAndCacheAfterDelete({
              chatId: message.chat?.id!,
              messageId: message.id,
            })
          })
        }
        handleEdit={handleEdit}
        message={selectedMessage}
      /> */}
			{/* <MediaViewerScreen /> */}
		</View>
	);
}

function EmptyScreen({ message }: { message?: string }) {
	return (
		<View className="flex-row justify-center items-center flex-1">
			<Text>{message ?? 'Be the first to say hi!'}</Text>
		</View>
	);
}
