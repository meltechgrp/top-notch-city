import { ChevronRight } from 'lucide-react-native';

import { Pressable } from 'react-native';
import { Text, View } from '../ui';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SettingsItemListProps = {
	title: string;
	withBorder?: boolean;
	withArrow?: boolean;
	textColor?: string;
	onPress?: () => void;
	className?: string;
	Icon?: ReactNode;
};
export default function SettingsItemList(props: SettingsItemListProps) {
	const {
		withBorder = true,
		title,
		onPress,
		withArrow = true,
		textColor,
		Icon,
		className,
	} = props;
	return (
		<Pressable
			onPress={onPress}
			className={cn(
				'h-[48px] px-4 gap-3 rounded-xl flex-row items-center active:bg-gray-600',
				className
			)}
			// pressed style
			android_ripple={{ color: 'gray' }}>
			{Icon && Icon}
			<View
				className={cn(
					'flex-row flex-1 gap-3 bg-transparent h-full items-center',
					withBorder && 'border-b border-border '
				)}>
				<Text className={cn('flex-1 text-base ', textColor)}>{title}</Text>
				{withArrow && <ChevronRight color={'orange'} width={20} height={20} />}
			</View>
		</Pressable>
	);
}
