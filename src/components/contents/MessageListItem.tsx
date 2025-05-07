import React from 'react';
import {
	Avatar,
	AvatarFallbackText,
	AvatarImage,
	Icon,
	Pressable,
	Text,
	View,
} from '../ui';
import { cn, formatMessageTime, fullName } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { Trash2 } from 'lucide-react-native';
import ImageOutlineIcon from '../icons/ImageOutlineIcon';

type MessageListItemProps = {
	chat: any;

	me: any;
};
export function MessageListItem(props: MessageListItemProps) {
	const { chat, me } = props;
	const router = useRouter();
	const avatar = React.useMemo(() => {
		return (
			<View className="w-[60px] h-[60px] border-2 border-white rounded-full">
				<Avatar className="bg-background-muted w-20 h-20">
					<AvatarFallbackText>Humphrey Joshua</AvatarFallbackText>
					<AvatarImage
						source={{
							uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
						}}
					/>
				</Avatar>
			</View>
		);
	}, []);
	const lastMessage = React.useMemo(() => chat.messages?.[0], [chat]);
	const unreadCount = React.useMemo(() => {
		const c = chat._count?.messageRecipients || 0;
		return c > 99 ? '99+' : c;
	}, [chat]);

	const formatedTime = React.useMemo(
		() =>
			lastMessage
				? formatMessageTime(lastMessage.createdAt, {
						hideTimeForFullDate: true,
					})
				: '',
		[]
	);

	return (
		<Pressable
			onPress={() => {
				router.push({
					pathname: '/(protected)/message/[chatId]',
					params: {
						chatId: chat.id,
					},
				});
			}}
			className="active:bg-black-900/5  transparent"
			android_ripple={{ color: '#d5d4d5' }}>
			<View className=" h-[92px] w-full px-4">
				<View className="w-full h-full border-b border-gray-300  flex-row items-center">
					<View className="h-[60px] w-full flex-row items-center">
						<View className="w-[60px] h-[60px]">{avatar}</View>
						<View className="flex-1 pl-[10px] gap-1">
							<View className="flex-row items-center justify-between">
								<View className="flex-row items-center flex-1  pr-4">
									<Text numberOfLines={1} className="text-black-900 text-base">
										A lot
									</Text>
								</View>
								<Text className="text-gray-600 text-xs">{formatedTime}</Text>
							</View>
							<View className="flex flex-row gap-2 w-full">
								<View className="flex-1 flex-row items-center overflow-hidden">
									{lastMessage.files?.length ? (
										<View className="flex-row items-center">
											<ImageOutlineIcon className="text-gray-600 w-6 h-6 mr-1" />
											{!lastMessage.text && (
												<Text className="text-gray-600 text-sm ml-1">
													Image
												</Text>
											)}
										</View>
									) : null}
									{lastMessage.deletedAt ? (
										<DeletedMessage />
									) : (
										<Text
											className="text-gray-600 text-sm"
											ellipsizeMode="tail"
											numberOfLines={1}>
											{lastMessage.text}
										</Text>
									)}
								</View>
								<View className="flex-row items-center gap-1">
									{!!unreadCount && (
										<View
											className={cn(
												'flex-row items-center  h-[18px] bg-red-900 rounded-full justify-center ml-auto',
												unreadCount === '99+' ? 'w-[32px]' : 'w-[20px]'
											)}>
											<Text className="text-white text-xs">{unreadCount}</Text>
										</View>
									)}
								</View>
							</View>
						</View>
					</View>
				</View>
			</View>
		</Pressable>
	);
}

function DeletedMessage() {
	return (
		<View className="flex-row gap-1 items-center">
			<Icon as={Trash2} width={14} height={14.6} />
			<Text className="text-gray-500 text-sm">
				This message has been deleted
			</Text>
		</View>
	);
}
