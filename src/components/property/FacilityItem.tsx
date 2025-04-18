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

type Props = {
	name: string;
	icon: string;
};

export default function FacilityItem({ name, icon }: Props) {
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
		<View className="flex-row gap-2 shrink-0 basis-[30%] items-center">
			<Icon size={18} color={'orange'} />
			<Text>{name}</Text>
		</View>
	);
}
