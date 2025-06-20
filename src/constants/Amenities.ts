import {
	Bath,
	Bed,
	Droplet,
	LandPlot,
	ParkingCircle,
	Shirt,
	Trees,
	UtilityPole,
	LucideIcon,
} from 'lucide-react-native';
export const Amenities: {
	title: string;
	type: string;
	data: {
		label: string;
		icon: LucideIcon;
		iconName: string;
	}[];
}[] = [
	{
		title: 'Facilities',
		type: 'btn',
		data: [
			{ label: 'Bedroom', icon: Bed, iconName: 'Bed' },
			{ label: 'Bathroom', icon: Bath, iconName: 'Bath' },
		],
	},
	{
		title: 'Land Area',
		type: 'num',
		data: [{ label: 'Area', icon: LandPlot, iconName: 'LandPlot' }],
	},
	{
		title: 'Essential Amenities',
		type: 'bool',
		data: [
			{ label: 'Parking Area', icon: ParkingCircle, iconName: 'ParkingCircle' },
			{ label: 'Garden', icon: Trees, iconName: 'Trees' },
			{ label: 'Laundry Room', icon: Shirt, iconName: 'Shirt' },
			{ label: 'Water Supply', icon: Droplet, iconName: 'Droplet' },
			{ label: 'Electricity', icon: UtilityPole, iconName: 'UtilityPole' },
		],
	},
];
