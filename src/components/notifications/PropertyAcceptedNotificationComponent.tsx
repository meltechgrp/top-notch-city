import { router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Avatar, AvatarBadge, AvatarImage, Icon, Text } from '../ui';
import { format } from 'date-fns';
import logo from '@/assets/images/32.png';
import { ChevronRight } from 'lucide-react-native';
import NotificationItemWrapper from './NotificationItemWrapper';

export default function PropertyAcceptedNotificationComponent({
	data,
	setScrollEnabled,
}: {
	data: any;
	setScrollEnabled: () => void;
}) {
	const [isRead, setIsRead] = React.useState(false);

	const handleRead = () => {
		setIsRead(!isRead);
	};

	return (
		<NotificationItemWrapper
			isRead={isRead}
			setScrollEnabled={setScrollEnabled}
			onRead={handleRead}
			onDelete={() => console.log('deleted')}>
			<Pressable
				// onPress={() =>
				// 	router.push({
				// 		pathname: '/(protected)/property/[propertyId]',
				// 		params: { propertyId: data.propertyId },
				// 	})
				// }
				className="p-4 rounded-2xl min-h-28 bg-background-info ">
				<View className="flex-1 gap-1">
					<View className="flex-1 border-b gap-1 pb-1 border-outline">
						<View className="flex-row gap-2 items-start">
							<Avatar size="xs" className="ios:mt-[2px]">
								<AvatarImage source={logo} />
								{!isRead && (
									<AvatarBadge
										className="bg-primary -top-2.5 -right-1.5"
										size="md"
									/>
								)}
							</Avatar>
							<Text size="lg" numberOfLines={1} className="">
								{data.title}
							</Text>
						</View>
						<Text className="text-sm font-light">{data.description}</Text>
					</View>
					<View className="flex-row items-center justify-between gap-2">
						<Text size="sm">
							{format(new Date(data.createdAt), 'dd MMM yyyy')}
						</Text>
						<Icon as={ChevronRight} className="text-primary" />
					</View>
				</View>
			</Pressable>
		</NotificationItemWrapper>
	);
}
