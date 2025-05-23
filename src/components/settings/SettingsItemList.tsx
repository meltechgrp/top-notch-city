import { Pressable } from 'react-native';
import { Icon, Text, View } from '../ui';
import { Colors } from '@/constants/Colors';
import { ChevronRight } from 'lucide-react-native';
import { cn } from '@/lib/utils';

type SettingsItemListProps = {
	title: string;
	withBorder?: boolean;
	withArrow?: boolean;
	icon?: any;
	iconColor?: string;
	iconBgColor?: string;
	textColor?: string;
	onPress?: () => void;
	className?: string;
};
export default function SettingsItemList(props: SettingsItemListProps) {
	const {
		withBorder = true,
		title,
		onPress,
		icon,
		iconColor,
		iconBgColor,
		withArrow = true,
		textColor,
		className,
	} = props;
	return (
		<Pressable
			onPress={onPress}
			className={`h-14 py-4 px-4 pl-0 flex-row items-center active:bg-background-info ${
				withBorder ? 'border-b border-outline' : ''
			} ${className} `}
			// pressed style
			android_ripple={{ color: Colors.light.tint }}>
			{icon && (
				<View
					className={cn(
						'w-10 h-10 rounded-full items-center justify-center',
						iconBgColor ? `bg-${iconBgColor}` : 'bg-background-info'
					)}>
					<Icon
						as={icon}
						className={cn('text-typography', iconColor && `text-${iconColor}`)}
					/>
				</View>
			)}
			<Text size="md" className={`flex-1 ${textColor}`}>
				{title}
			</Text>
			{withArrow && <Icon as={ChevronRight} className="text-primary" />}
		</Pressable>
	);
}
