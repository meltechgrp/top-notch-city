import { Eye, ThumbsUp } from 'lucide-react-native';
import { Icon, Text, View } from '../ui';
import { cn } from '@/lib/utils';

interface Props {
	interaction: Property['interaction'];
	className?: string;
}

export function PropertyInteractions({ interaction, className }: Props) {
	return (
		<View className={cn('gap-4 pr-8', className)}>
			<View className="flex-row gap-2 items-center">
				<Icon as={Eye} size="sm" color="white" />
				<Text className="text-white text-lg">{interaction?.viewed}</Text>
			</View>
			<View className="flex-row gap-2 items-center">
				<Icon as={ThumbsUp} size="sm" color={'white'} />
				<Text className="text-white text-lg">{interaction?.liked}</Text>
			</View>
		</View>
	);
}
