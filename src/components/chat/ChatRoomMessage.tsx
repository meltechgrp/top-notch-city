import { Avatar, AvatarFallbackText, Icon, Text } from '@/components/ui';
// import QuoteMessage from '@/components/chat/ChatRoomQuoteMessage'
// import MediaPreviewComponent from '@/components/chat/MediaPreviewComponent'
// import PostLinkPreview from '@/components/contents/PostLinkPreview'
// import PostTextContent from '@/components/contents/PostTextContent'
// import { SplitListItemEmbedWithDataFetching } from '@/components/splits/SplitListItemEmbed'
import Layout from '@/constants/Layout';
// import { ChatMessagesQuery, ChatQuery } from '@/graphql-types/chat.queries.gql'
// import { MessageStatus } from '@/graphql-types/index.gql'
// import { MeQuery } from '@/graphql-types/queries.gql'
import { cn } from '@/lib/utils';
import { formatMessageTime, fullName } from '@/lib/utils';
import { router } from 'expo-router';
import { ClockIcon, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import PostTextContent from './PostTextContent';

export type ChatRoomMessageProps = View['props'] & {
	message: any;
	isGroupChat?: boolean;
	me: any;
	sender: any;
	qouteSender?: any;
	onLongPress: (message: any) => void;
	isDeleting?: boolean;
};
export default function ChatRoomMessage(props: ChatRoomMessageProps) {
	const {
		message,
		isGroupChat = false,
		me,
		sender,
		qouteSender,
		onLongPress,
		isDeleting,
		...others
	} = props;
	const isMine = React.useMemo(() => message?.sender?.id === 'user2', []);
	const formatedTime = React.useMemo(
		() => formatMessageTime(message?.editedAt || message.createdAt),
		[]
	);
	const messageInfo = React.useMemo(
		() => (
			<View
				className={cn(
					'flex-row items-end pb-1 px-2',
					isMine ? 'justify-end' : 'justify-start'
				)}>
				{message.editedAt && (
					<Text className="text-[8px] text-typography/70 mr-1">Edited</Text>
				)}
				<Text className="text-[8px] text-typography/70">{formatedTime}</Text>
				{message.status === 'Pending' && (
					<ClockIcon
						width={12}
						height={12}
						className="ml-1 text-typography/70 "
					/>
				)}
			</View>
		),
		[formatedTime, message.status, message.editedAt, message.text]
	);

	const pressProps = {
		onLongPress: () => {
			// if (message.status === 'Pending' || message.deletedAt) {
			// 	return;
			// }
			// onLongPress(message);
		},
		delayLongPress: 400,
	};

	return (
		<>
			<Pressable
				{...pressProps}
				{...others}
				className={cn([
					'w-full px-4 flex-row py-2',
					isDeleting && 'opacity-30',
				])}>
				{isMine && <View className="flex-1" />}
				<View
					className={cn('max-w-[80%]', isMine ? 'items-end' : 'items-start')}>
					{/* {!isMine && (
						<View className="pb-2 flex-row items-center">
							<Avatar>
								<AvatarFallbackText>A F</AvatarFallbackText>
							</Avatar>
							<Pressable>
								<Text className="ml-2 text-sm">{fullName(sender)}</Text>
							</Pressable>
						</View>
					)} */}

					<Pressable
						className={cn([
							'rounded-lg overflow-hidden gap-2',
							isMine
								? 'bg-primary  active:bg-primary'
								: 'bg-background-muted active:bg-bg-background-info',
						])}
						{...pressProps}>
						<View className="p-2">
							<PostTextContent
								text={message.text || ''}
								tokenizedText={message.tokenizedText as any}
								fullText={true}
								trimLink={false}
								isMine={isMine}
							/>
						</View>
					</Pressable>
					{messageInfo}
					{!isMine && <View className="flex-1" />}
				</View>
			</Pressable>
		</>
	);
}
