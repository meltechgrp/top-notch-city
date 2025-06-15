import { View } from 'react-native';
import { Text } from '../ui';
import { cn } from '@/lib/utils';

type NotificationBadgeProps = {
	count?: number | null;
	className?: string;
	textClassName?: string;
};

export default function NotificationBadge({
	count,
	className,
	textClassName,
}: NotificationBadgeProps) {
	if (!count) {
		return null;
	}

	const exceeds9 = count > 9;
	const _count = exceeds9 ? '9+' : count;

	return (
		<View
			className={cn(
				'flex flex-row items-center justify-center w-5 h-5 px-1 bg-primary rounded-full',
				className
			)}>
			<Text
				style={[
					{
						fontSize: exceeds9 ? 9 : 12,
					},
				]}
				className={cn('text-white', textClassName)}>
				{_count}
			</Text>
		</View>
	);
}
