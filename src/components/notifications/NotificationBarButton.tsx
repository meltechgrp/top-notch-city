import NotificationBadge from '@/components/notifications/NotificationBadge';
import { router, useFocusEffect, usePathname } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { useCallback } from 'react';
import { View } from 'react-native';
import { Button, Icon } from '../ui';

export default function NotificationBarButton() {
	const unseenNotificationsCount = 5;

	useFocusEffect(
		useCallback(() => {
			// fetchUnseenNotificationsCount()
		}, [])
	);
	const pathname = usePathname();
	return (
		<Button
			onPress={() => {
				router.push({
					pathname: '/notification',
					params: {
						ref: pathname,
					},
				});
			}}
			action="secondary"
			className="rounded-full h-14 px-4 justify-center items-center  active:opacity-50 flex">
			<Icon size={'xl'} as={Bell} />
			<View className="absolute top-1 right-0">
				<NotificationBadge count={unseenNotificationsCount} />
			</View>
		</Button>
	);
}
