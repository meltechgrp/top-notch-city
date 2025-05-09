import { useProfileContext } from '@/components/profile/context/ProfileContext';
import { View } from 'react-native';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallbackText, Text } from '../ui';

export default function ProfileTopSection() {
	const { profile, isGuest, addMenu, actionStatuses, onRefresh } =
		useProfileContext();
	// const { me } = useStore((v) => ({ me: v.me }));

	return (
		<>
			<View className="px-4 bg-background py-4 border-t border-outline">
				<View className={cn('flex-row gap-4 items-center')}>
					<Avatar size="lg" className="relative items-center justify-center">
						<AvatarFallbackText>Humphrey Joshua</AvatarFallbackText>
					</Avatar>
					<View className="gap-1">
						<Text className=" text-lg leading-5">Humphrey Joshua</Text>
						<Text className="text-typography/70 text-sm">
							joshuahumphrey579@gmail.com
						</Text>
					</View>
				</View>
			</View>
		</>
	);
}
