import { useMemo } from 'react';
import { Text, View } from '../ui';
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
	textClassname?: string;
	className?: string;
	iconSize?: number;
};

export default function FacilityItem({
	name,
	icon,
	className,
	textClassname,
	iconSize,
}: Props) {
	const Icon: LucideIcon = useMemo(() => {
		if (icon == 'bathroom') {
			return Bath;
		} else if (icon == 'bedroom') {
			return Bed;
		} else if (icon == 'parking') {
			return ParkingCircle;
		} else if (icon == 'laundry') {
			return WashingMachine;
		} else if (icon == 'garden') {
			return Flower2;
		} else {
			return Home;
		}
	}, [icon]);
	return (
		<View className={cn('flex-row gap-2 items-center', className)}>
			<Icon size={iconSize ?? 18} color={'#F8AA00'} />
			<Text numberOfLines={1} className={textClassname}>
				{name}
			</Text>
		</View>
	);
}
