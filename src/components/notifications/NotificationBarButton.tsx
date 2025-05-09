import NotificationBadge from '@/components/notifications/NotificationBadge';
import { router, useFocusEffect, usePathname } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { useCallback } from 'react';
import { View } from 'react-native';
import { Button, Icon } from '../ui';
import { cn } from '@/lib/utils';
import * as Haptics from 'expo-haptics';

type Props = {
	className?: string;
};

export default function NotificationBarButton({ className }: Props) {
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
				Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
				router.push({
					pathname: '/notification',
					params: {
						ref: pathname,
					},
				});
			}}
			action="secondary"
			className={cn(
				'rounded-full h-14 px-4 justify-center items-center flex',
				className
			)}>
			<Icon size={'xl'} as={Bell} />
			<View className="absolute top-1 right-0">
				<NotificationBadge count={unseenNotificationsCount} />
			</View>
		</Button>
	);
}
