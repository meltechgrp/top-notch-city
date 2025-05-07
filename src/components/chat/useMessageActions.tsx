// import { ChatRoomMessageProps } from '@/components/chat/ChatRoomMessage'
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Alert } from 'react-native';
// import { useDeleteChatMessageMutation } from '@/graphql-types/chat.mutations.gql'
// import { showSnackbar } from '@/utils'

type Message = any;

type Args = {
	focusEditor: () => void;
	setEditorText: (text: string) => void;
};

export default function useMessageActions(args: Args) {
	const { focusEditor, setEditorText } = args;
	const [selectedMessage, setSelectedMessage] = useState<Message>();
	const [activeQuoteMessage, setActiveQuoteMessage] = useState<Message>();

	const [showMessageActionsModal, setShowMessageActionsModal] = useState(false);
	function handleMessageLongPress(message: Message) {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
		setShowMessageActionsModal(true);
		setSelectedMessage(message);
	}

	function handleReply() {
		setActiveQuoteMessage(selectedMessage);
		focusEditor();
	}

	const [isDeletingMessageId, setIsDeletingMessageId] = useState<string | null>(
		null
	);
	// const [deleteMessage, { loading }] = useDeleteChatMessageMutation()
	async function handleDelete(onDone: (message: Message) => void) {
		if (!selectedMessage?.id) return;

		Alert.alert(
			'Confirm delete',
			'Delete message for yourself and others in this chat?',
			[
				{
					text: 'Cancel',
				},
				{
					text: 'Yes',
					style: 'destructive',
					onPress: async () => {
						// deleteMessage({
						//   variables: {
						//     id: selectedMessage?.id,
						//   },
						//   onCompleted() {
						//     onDone(selectedMessage)
						//     showSnackbar({
						//       type: 'success',
						//       duration: 3000,
						//       message: 'Message deleted.',
						//     })
						//     setIsDeletingMessageId(null)
						//   },
						//   onError: (err) => {
						//     showSnackbar({
						//       type: 'error',
						//       duration: 3000,
						//       message: err.message || 'Could not delete message!',
						//     })
						//     setIsDeletingMessageId(null)
						//   },
						// })
					},
				},
			]
		);
	}

	async function handleEdit() {
		setIsEditing(true);
		focusEditor();
		setEditorText(selectedMessage?.text || '');
	}
	const [isEditing, setIsEditing] = useState(false);
	function exitEditMode() {
		setIsEditing(false);
		setEditorText('');
	}

	return {
		selectedMessage,
		activeQuoteMessage,
		setActiveQuoteMessage,
		showMessageActionsModal,
		setShowMessageActionsModal,
		handleReply,
		handleMessageLongPress,
		handleDelete,
		isDeletingMessageId,
		isEditing,
		exitEditMode,
		handleEdit,
	};
}
