import {
	Avatar,
	AvatarBadge,
	AvatarFallbackText,
	AvatarImage,
	Icon,
	Text,
	View,
} from '@/components/ui';
import SwipeableWrapper from '@/components/shared/SwipeableWrapper';
import { Pressable } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { getImageUrl } from '@/lib/api';
import { fullName } from '@/lib/utils';

type Props = {
	property: any;
	onPress: (property: Props['property']) => void;
};

export default function PropertyListItem({ property, onPress }: Props) {
	return (
		<>
			<SwipeableWrapper rightAction={() => {}} leftAction={() => {}}>
				<Pressable
					onPress={() => onPress(property)}
					className={
						'flex-row items-center px-4 py-3 bg-background-muted rounded-xl'
					}>
					<Avatar className=" w-12 h-12">
						<AvatarFallbackText>{fullName(property)}</AvatarFallbackText>
						<AvatarBadge size="md" />
						<AvatarImage source={getImageUrl(property?.profile_image)} />
					</Avatar>
					<View className="flex-1 pl-3">
						<Text className="text-base font-medium capitalize">
							{fullName(property)}
						</Text>
						<Text className="text-sm text-typography/80">
							{property?.email}
						</Text>
					</View>
					<Icon as={ChevronRight} className="text-primary" />
				</Pressable>
			</SwipeableWrapper>
		</>
	);
}
