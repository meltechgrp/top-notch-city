import { Pressable } from 'react-native';
import { Icon, Text } from '../ui';
import { Colors } from '@/constants/Colors';
import { ChevronRight } from 'lucide-react-native';

type SettingsItemListProps = {
	title: string;
	withBorder?: boolean;
	withArrow?: boolean;
	textColor?: string;
	onPress?: () => void;
};
export default function SettingsItemList(props: SettingsItemListProps) {
	const {
		withBorder = true,
		title,
		onPress,
		withArrow = true,
		textColor,
	} = props;
	return (
		<Pressable
			onPress={onPress}
			className={`h-[56px] px-4 flex-row items-center active:bg-background-info ${
				withBorder ? 'border-b border-outline' : ''
			} `}
			// pressed style
			android_ripple={{ color: Colors.light.tint }}>
			<Text className={`flex-1 ${textColor}`}>{title}</Text>
			{withArrow && <Icon as={ChevronRight} />}
		</Pressable>
	);
}
