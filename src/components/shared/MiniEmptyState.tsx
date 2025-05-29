import { View } from 'react-native';
import { Text } from '../ui';
import BeachPersonWaterParasolIcon from '../icons/BeachPersonWaterParasolIcon';
import { cn } from '@/lib/utils';

interface Props {
	title: string;
	className?: string;
	mainClassName?: string;
}

export function MiniEmptyState({ title, className, mainClassName }: Props) {
	return (
		<View className={cn('flex-1 items-center justify-center pt-20', className)}>
			<View
				className={cn(
					'bg-background-muted justify-center items-center p-6 rounded-xl',
					mainClassName
				)}>
				<View>
					<BeachPersonWaterParasolIcon
						height={64}
						width={64}
						className="text-primary"
					/>
				</View>
				<Text className=" text-md text-center pt-2">{title}</Text>
			</View>
		</View>
	);
}
