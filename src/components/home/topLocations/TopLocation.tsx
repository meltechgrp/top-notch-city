import {
	Avatar,
	AvatarFallbackText,
	AvatarImage,
	Badge,
	BadgeText,
} from '@/components/ui';

type Location = {
	id: string;
	name: string;
	image: any;
};

export default function TopLocation({ name, image }: Location) {
	return (
		<Badge
			size="md"
			variant="solid"
			action="muted"
			className="flex flex-row p-2 pr-3 min-w-[150px] rounded-full items-center bg-gray-200  gap-2">
			<Avatar size="lg">
				<AvatarFallbackText>{name}</AvatarFallbackText>
				<AvatarImage source={image} />
			</Avatar>
			<BadgeText size="lg" className=" capitalize">
				{name}
			</BadgeText>
		</Badge>
	);
}
