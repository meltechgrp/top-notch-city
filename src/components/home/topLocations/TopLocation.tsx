import {
	Avatar,
	AvatarFallbackText,
	AvatarImage,
	Badge,
	BadgeText,
	Text,
} from '@/components/ui';
import { TouchableHighlight } from 'react-native';

type Location = {
	id: string;
	name: string;
	image: any;
	onPress: () => void;
};

export default function TopLocation({ name, image, onPress }: Location) {
	return (
		<TouchableHighlight onPress={onPress} className="rounded-full">
			<Badge
				size="md"
				variant="solid"
				action="muted"
				className="flex flex-row p-2 px-2 pr-5 min-w-36 rounded-full items-center  gap-4">
				<Avatar size="md">
					<AvatarFallbackText>{name}</AvatarFallbackText>
					<AvatarImage source={image} />
				</Avatar>
				<Text className=" capitalize text-lg">{name}</Text>
			</Badge>
		</TouchableHighlight>
	);
}
