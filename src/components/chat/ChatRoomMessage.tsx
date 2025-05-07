import { Icon, Text } from '@/components/ui';
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
	const isMine = React.useMemo(() => message?.sender?.id === me.id, []);
	const formatedTime = React.useMemo(
		() => formatMessageTime(message.editedAt || message.createdAt),
		[]
	);
	const qoute = React.useMemo(() => message.qoute, []);
	const messageInfo = React.useMemo(
		() => (
			<View
				className={cn(
					'flex-row items-end pb-1 px-2',
					isMine ? 'justify-end' : 'justify-start'
				)}>
				{message.editedAt && (
					<Text className="text-[8px] text-gray-600 mr-1">Edited</Text>
				)}
				<Text className="text-[8px] text-gray-600">{formatedTime}</Text>
				{message.status === 'Pending' && (
					<ClockIcon width={12} height={12} className="ml-1 text-gray-600 " />
				)}
			</View>
		),
		[formatedTime, message.status, message.editedAt, message.text]
	);

	const pressProps = {
		onLongPress: () => {
			if (message.status === 'Pending' || message.deletedAt) {
				return;
			}

			onLongPress(message);
		},
		delayLongPress: 400,
	};

	const previewLink = message?.tokenizedText?.find(
		(t: any) => t?.type === 'link'
	);
	const renderMentions = () => {
		if (!previewLink?.value) return null;
		return (
			<View
				className="bg-primary-50"
				style={{ width: Math.round(Layout.window.width * 0.8) }}>
				{/* {previewLink?.value && !community?.value && !split?.value ? (
          <View>
            <PostLinkPreview url={previewLink?.value} />
          </View>
        ) : null} */}
			</View>
		);
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
					{!isMine && !!sender && (
						<View className="pb-2 flex-row items-center">
							{/* <Avatar
                size={40}
                path={sender?.photo?.path || ''}
                onPress={() => {
                  router.push(`/(protected)/profile/${sender.id}`)
                }}
              /> */}
							<Pressable
							// onPress={() => {
							//   router.push(`/(protected)/profile/${sender.id}`)
							// }}
							>
								<Text className="ml-2 text-sm text-black-900">
									{fullName(sender)}
								</Text>
							</Pressable>
						</View>
					)}

					{message.files?.length ? (
						<View
							className={cn('gap-y-1', isMine ? 'items-end' : 'items-start')}>
							{/* <MediaPreviewComponent
                media={message.files as any}
                className={cn([
                  'rounded-2xl p-1.5 w-full mb-1',
                  isMine ? 'bg-primary-200' : 'bg-gray-50',
                ])}
              /> */}
						</View>
					) : null}
					<Pressable
						className={cn([
							'rounded-lg overflow-hidden gap-2',
							isMine
								? 'bg-primary-200  active:bg-primary-300'
								: 'bg-gray-50 active:bg-gray-200',
							message.text &&
								!message.text.trim() &&
								!message.files &&
								'hidden',
						])}
						{...pressProps}>
						{renderMentions()}
						<View className="p-2">
							{/* {!!qoute && <QuoteMessage quote={qoute as any} />} */}
							{/* {message.deletedAt ? (
                <DeletedMessage message={message} />
              ) : (
                <PostTextContent
                  text={message.text || ''}
                  tokenizedText={message.tokenizedText as any}
                  fullText={true}
                  trimLink={false}
                />
              )} */}
						</View>
					</Pressable>
					{messageInfo}
					{!isMine && <View className="flex-1" />}
				</View>
			</Pressable>
		</>
	);
}

type DeletedMessageProps = {
	message: ChatRoomMessageProps['message'];
};

function DeletedMessage(props: DeletedMessageProps) {
	const { message } = props;

	return (
		<View className="flex-row gap-2 items-center">
			<Icon as={Trash2} />
			<Text className="text-gray-500">{message.text}</Text>
		</View>
	);
}
