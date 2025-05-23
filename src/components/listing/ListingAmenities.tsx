import {
	Box,
	Checkbox,
	CheckboxGroup,
	CheckboxIcon,
	CheckboxIndicator,
	CheckIcon,
	Heading,
	Icon,
	Pressable,
	Text,
	View,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { useTempStore } from '@/store';
import {
	Bath,
	Bed,
	Droplet,
	Home,
	LandPlot,
	Minus,
	ParkingCircle,
	Plus,
	Shirt,
	Trees,
	UtilityPole,
} from 'lucide-react-native';

export default function ListingAmenities() {
	const { listing, updateListing } = useTempStore();
	function addToFacilities(label: string, action: 'add' | 'minus') {
		const prev = listing.facilities?.find((fac) => fac.label === label);
		let prevFac = listing?.facilities ? listing.facilities : [];
		if (!prev && action == 'add')
			updateListing({
				...listing,
				facilities: [...prevFac, { label: label, value: 1 }],
			});
		else {
			prevFac = prevFac.map((fac) =>
				fac.label !== label
					? fac
					: {
							...fac,
							value:
								action == 'add'
									? fac.value + 1
									: fac.value < 2
										? fac.value
										: fac.value - 1,
						}
			);
			updateListing({
				...listing,
				facilities: prevFac,
			});
		}
	}
	function checkFacItem(item: string) {
		return listing.facilities?.find((fac) => fac.label === item)?.value ?? 0;
	}
	return (
		<>
			<Box className="flex-1 py-2 px-4">
				<View className="  gap-2 flex-1">
					<Heading size="xl">Share Details About Your Property</Heading>
					<View className="py-4 gap-8">
						{data.map((section) => (
							<View key={section.title} className="gap-3">
								<View className="">
									<Text size="xl" className="font-light">
										{section.title}
									</Text>
								</View>
								<View className="gap-4">
									{section.data.map((item) => {
										listing.features?.find((fac) => fac === item.label);
										return (
											<View
												key={item.label}
												className={cn(
													' gap-2 p-4 flex-row justify-between items-center rounded-2xl bg-background-muted'
												)}>
												<View className="flex-row gap-4 items-center">
													<Icon
														as={item.icon}
														className="text-primary w-4 h-4"
													/>
													<Text size="lg">{item.label}</Text>
												</View>
												<View>
													<View className="flex-row gap-3 items-center">
														<Pressable
															onPress={() =>
																addToFacilities(item.label, 'minus')
															}>
															<View
																className={cn(
																	' p-3 border border-outline-100 rounded-full'
																)}>
																<Icon as={Minus} />
															</View>
														</Pressable>
														<View>
															<Text size="xl">{checkFacItem(item.label)}</Text>
														</View>
														<Pressable
															onPress={() =>
																addToFacilities(item.label, 'add')
															}>
															<View
																className={cn(
																	' p-3 border border-outline-100 rounded-full'
																)}>
																<Icon as={Plus} />
															</View>
														</Pressable>
													</View>
												</View>
											</View>
										);
									})}
								</View>
							</View>
						))}
					</View>
				</View>
			</Box>
		</>
	);
}

const data = [
	{
		title: ' Facilities',
		data: [
			{
				label: 'Bedroom',
				value: 'bedroom',
				icon: Bed,
			},
			{
				label: 'Bathroom',
				value: 'bathrrom',
				icon: Bath,
			},
			{
				label: 'Home Office',
				value: 'home-office',
				icon: Home,
			},
			{
				label: 'Laundry Room',
				value: 'laundry-room',
				icon: Shirt,
			},
		],
	},
	{
		title: 'Land Area',
		data: [
			{
				label: 'Lenght',
				value: 'lenght',
				icon: LandPlot,
			},
			{
				label: 'Width',
				value: 'width',
				icon: LandPlot,
			},
		],
	},
	{
		title: 'Essential Amenities',
		data: [
			{
				label: 'Parking Area',
				value: 'parking-area',
				icon: ParkingCircle,
			},
			{
				label: 'Garden',
				value: 'garden',
				icon: Trees,
			},
			{
				label: 'Water Supply',
				value: 'water-supply',
				icon: Droplet,
			},
			{
				label: 'Electricity',
				value: 'electricity',
				icon: UtilityPole,
			},
		],
	},
];
