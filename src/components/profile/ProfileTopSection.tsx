import { fullName } from '@/lib/utils';
import { Avatar, AvatarFallbackText, AvatarImage, Text, View } from '../ui';
import { getImageUrl } from '@/lib/api';
import { useStore } from '@/store';

export function ProfileTopSection() {
	const { me } = useStore();
	return (
		<View className={'px-4 py-2 mt-2 bg-background'}>
			<View className={'flex-row items-center'}>
				<Avatar className=" w-16 h-16">
					<AvatarFallbackText>{fullName(me)}</AvatarFallbackText>
					<AvatarImage source={getImageUrl(me?.profile_image)} />
				</Avatar>
				<View className="flex-1 pl-3">
					<Text className="text-xl font-medium">{fullName(me)}</Text>
					<Text className="text-sm text-typography/80">{me?.email}</Text>
				</View>
			</View>
		</View>
	);
}
