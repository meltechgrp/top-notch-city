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
	const messages = React.useMemo(() => [] as any, []);
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

	return (
		<View className="flex-1 w-full">
			<View className="flex-1 w-full">
				<FlatList
					scrollEnabled={refreshing ? false : true}
					keyboardShouldPersistTaps="handled"
					// ref={(r) => (listRef.current = r)}
					keyExtractor={(item) => item.id}
					contentContainerStyle={{
						justifyContent: 'flex-end',
						flexGrow: 1,
					}}
					renderItem={renderItem}
					data={messages}
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
				{/* <EditOverlay
          visible={isEditing}
          onDismiss={() => exitEditMode()}
          activeMessage={selectedMessage}
        /> */}
			</View>
			{/* <ChatRoomFooter
        onUpdate={onRefreshChat}
        chatId={chatId}
        onPost={(msg, isEdit) => {
          handleSendMessage(msg, isEdit)
          exitEditMode()
          if (!isEdit) {
            scrollToBottom()
          }
        }}
        activeQuoteMsg={activeQuoteMessage}
        clearActiveQuoteMsg={() => {
          setActiveQuoteMessage(undefined)
        }}
        ref={editorRef}
        isEditing={isEditing}
        selectedMessage={selectedMessage}
        {...ChatRoomFooterProps}
        className="pb-0 bg-white border-t border-gray-200"
      /> */}
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
