import { TouchableHighlight, TouchableOpacity, View as V } from 'react-native';
import { Pressable, Text, View, Icon } from '../ui';
import { cn } from '@/lib/utils';
import { ArrowRightIcon, ChevronRight } from 'lucide-react-native';

type MenuListItemProps = V['props'] & {
	title: React.ReactNode;
	description: string;
	icon: any;
	rightComponent?: React.ReactNode;
	withArrow?: boolean;
	iconColor?: string;
	iconBgColor?: string;
	onPress?: () => void;
	className?: string;
};
export function MenuListItem(props: MenuListItemProps) {
	const {
		title,
		description,
		icon,
		rightComponent,
		onPress,
		style,
		className,
		withArrow = true,
		iconColor,
		iconBgColor,
	} = props;
	return (
		<TouchableOpacity onPress={() => onPress?.()}>
			<View style={[style]} className={cn('flex-row items-center', className)}>
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
				<View className="flex-1 pl-3">
					<Text className="text-base font-medium">{title}</Text>
					<Text className="text-sm text-typography/80">{description}</Text>
				</View>
				{withArrow && <Icon as={ChevronRight} />}
			</View>
		</TouchableOpacity>
	);
}
