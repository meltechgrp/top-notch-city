import { ChatRoomMessageProps } from '@/components/chat/ChatRoomMessage';
import Editor, { EditorComponentRefHandle } from '@/components/shared/Editor';
import { useStore } from '@/store';
import React, { useMemo as useCallback } from 'react';
import { TextInput, View } from 'react-native';

type Props = View['props'] & {
	chatId: string;
	onPost: (msg: any, isEdit: boolean) => void;
	onUpdate: (data: any) => void;
	placeholder?: string;
	defaultText?: string;
	activeQuoteMsg: ChatRoomMessageProps['message'] | undefined;
	clearActiveQuoteMsg: () => void;
	isEditing: boolean;
	selectedMessage: ChatRoomMessageProps['message'] | undefined;
};

const ChatRoomFooter = React.forwardRef<EditorComponentRefHandle, Props>(
	(props, ref) => {
		const {
			chatId,
			onPost,
			className,
			placeholder,
			activeQuoteMsg,
			clearActiveQuoteMsg,
			isEditing,
			selectedMessage,
		} = props;
		const me = useStore((s) => s.me);
		function onSubmit({ text, files }: { text: string; files: any[] }) {
			if (me) {
				const tempId = 'endjejkdnjenj';
				const mock = {
					__typename: 'Message',
					id: isEditing ? selectedMessage?.id! : tempId,
					createdAt: new Date(),
					text,
					mocked: true,
					sender: {
						__typename: 'User',
						id: me.id,
					},
					chat: {
						__typename: 'Chat',
						id: chatId,
					},
					qoute: activeQuoteMsg || null,
					status: 'pending',
					files,
				};
				onPost(mock, isEditing);
				clearActiveQuoteMsg();
			}
		}

		return (
			<View>
				<Editor
					headerComponent={null}
					onSend={onSubmit}
					placeholder={placeholder}
					className={className}
					autoFocus={false}
					value={props.defaultText}
					ref={ref}
					noMedia={isEditing}
				/>
			</View>
		);
	}
);

export default ChatRoomFooter;
