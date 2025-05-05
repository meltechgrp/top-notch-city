import {
	Avatar,
	AvatarFallbackText,
	AvatarImage,
	Badge,
	BadgeText,
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
				className="flex flex-row p-2 pr-3 min-w-[150px] rounded-full items-center  gap-2">
				<Avatar size="lg">
					<AvatarFallbackText>{name}</AvatarFallbackText>
					<AvatarImage source={image} />
				</Avatar>
				<BadgeText size="lg" className=" capitalize">
					{name}
				</BadgeText>
			</Badge>
		</TouchableHighlight>
	);
}
