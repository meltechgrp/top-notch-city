import { useMemo } from 'react';
import { Icon, Text, View } from '../ui';
import {
	Bath,
	Bed,
	Flower2,
	Home,
	LucideIcon,
	ParkingCircle,
	WashingMachine,
} from 'lucide-react-native';
import { cn } from '@/lib/utils';

type Props = {
	name: string;
	icon: string;
	hideText?: boolean;
	textClassname?: string;
	className?: string;
	iconSize?: '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

export default function FacilityItem({
	name,
	icon,
	className,
	textClassname,
	hideText,
	iconSize,
}: Props) {
	const Shape: LucideIcon = useMemo(() => {
		if (icon == 'Bath') {
			return Bath;
		} else if (icon == 'Bed') {
			return Bed;
		} else if (icon == 'ParkingCircle') {
			return ParkingCircle;
		} else if (icon == 'WashingMachine') {
			return WashingMachine;
		} else if (icon == 'garden') {
			return Flower2;
		} else {
			return Home;
		}
	}, [icon]);
	return (
		<View className={cn('flex-row gap-2 items-center', className)}>
			<Icon as={Shape} size={iconSize ?? 'sm'} className="text-primary" />
			{!hideText && (
				<Text numberOfLines={1} className={textClassname}>
					{name}
				</Text>
			)}
		</View>
	);
}
