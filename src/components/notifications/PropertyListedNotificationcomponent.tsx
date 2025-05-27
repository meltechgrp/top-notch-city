import { router } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';
import { Avatar, AvatarBadge, AvatarImage, Icon, Text } from '../ui';
import { format } from 'date-fns';
import logo from '@/assets/images/icon.png';
import { ChevronRight } from 'lucide-react-native';
import NotificationItemWrapper from './NotificationItemWrapper';
import { cn } from '@/lib/utils';

export default function PropertyListedNotificationComponent({
	data,
}: {
	data: any;
}) {
	const [isRead, setIsRead] = React.useState(false);
	const handleRead = () => {
		setIsRead(!isRead);
	};
	return (
		<NotificationItemWrapper
			isRead={isRead}
			onRead={handleRead}
			onDelete={() => console.log('deleted')}>
			<Pressable
				// onPress={() =>
				// 	router.push({
				// 		pathname: '/(protected)/property/[propertyId]',
				// 		params: { propertyId: data.propertyId },
				// 	})
				// }
				className={cn(
					'p-4 min-h-28 rounded-2xl bg-background-info ',
					data.description?.length > 50 && 'min-h-[145px]'
				)}>
				<View className="flex-1 gap-1">
					<View className="flex-1 border-b gap-1 pb-1 border-outline">
						<View className="flex-row gap-4 items-start">
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
						<Text numberOfLines={3} className="text-sm font-light">
							{data.description}
						</Text>
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
