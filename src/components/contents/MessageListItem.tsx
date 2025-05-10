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

type MessageListItemProps = {
	chat: any;

	me: any;
};
export function MessageListItem(props: MessageListItemProps) {
	const { chat, me } = props;
	const router = useRouter();
	const avatar = React.useMemo(() => {
		return (
			<View className=" rounded-full">
				<Avatar className="bg-background-muted w-20 h-20">
					<AvatarFallbackText className="text-typography">
						{fullName(chat)}
					</AvatarFallbackText>
				</Avatar>
			</View>
		);
	}, []);
	const unreadCount = React.useMemo(() => {
		const c = chat.unreadCount || 0;
		return c > 99 ? '99+' : c;
	}, [chat]);

	const formatedTime = React.useMemo(
		() =>
			chat
				? formatMessageTime(chat.createdAt, {
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
			className="active:bg-background/5  transparent"
			android_ripple={{ color: '#d5d4d5' }}>
			<View className=" h-[92px] w-full px-4">
				<View className="w-full h-full border-b border-outline  flex-row items-center">
					<View className="h-[60px] gap-4 w-full flex-row items-center">
						<View className="w-[60px] h-[60px]">{avatar}</View>
						<View className="flex-1 pl-[10px] gap-1">
							<View className="flex-row items-center justify-between">
								<View className="flex-row items-center flex-1  pr-4">
									<Text numberOfLines={1} className=" text-base">
										{fullName(chat)}
									</Text>
								</View>
								<Text className="text-typography/60 text-xs">
									{formatedTime}
								</Text>
							</View>
							<View className="flex flex-row gap-2 w-full">
								<View className="flex-1 flex-row items-center overflow-hidden">
									<Text
										className="text-typography/60 text-sm"
										ellipsizeMode="tail"
										numberOfLines={1}>
										{chat.message}
									</Text>
								</View>
								<View className="flex-row items-center gap-1">
									{!!unreadCount && (
										<View
											className={cn(
												'flex-row items-center  h-[18px] bg-primary rounded-full justify-center ml-auto',
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
