import { cn } from '@/lib/utils';

import { Pressable, View } from 'react-native';
import { Icon } from '../ui';
import { MessageCircleMore } from 'lucide-react-native';

type CreateButtonProps = {
	onPress: () => void;
	className?: string;
};

function CreateButton(props: CreateButtonProps) {
	return (
		<View className={cn('absolute bottom-[100px] right-3', props.className)}>
			<Pressable
				className="bg-primary rounded-2xl p-1 flex w-16 h-16 flex-row items-center justify-center z-30 shadow "
				accessibilityRole="button"
				accessibilityLabel="Create"
				onPress={props.onPress}>
				<Icon size="xl" as={MessageCircleMore} className="text-white" />
			</Pressable>
		</View>
	);
}

export default CreateButton;
