import {
	Avatar,
	AvatarFallbackText,
	AvatarImage,
	Box,
	Heading,
	Text,
	View,
} from '@/components/ui';
import { getImageUrl } from '@/lib/api';
import { fullName } from '@/lib/utils';
import { useStore } from '@/store';

export default function AdminSettings() {
	const me = useStore((s) => s.me);
	return (
		<Box className="flex-1">
			<View className="px-4 py-4 flex-row gap-4 items-center border-b border-outline/70">
				<Avatar className=" w-14 h-14">
					<AvatarFallbackText>Humphrey Joshua</AvatarFallbackText>
					<AvatarImage source={getImageUrl(me?.profile_image)} />
				</Avatar>
				<View className="flex-1">
					<Heading size="xl" className="">
						Hello 👋,
					</Heading>
					<Text className="text-lg text-typography/80">{fullName(me)}</Text>
				</View>
			</View>
		</Box>
	);
}
