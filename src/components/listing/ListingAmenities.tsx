import { Box, Heading, Icon, Pressable, Text, View } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useTempStore } from '@/store';
import {
	Bath,
	Bed,
	Droplet,
	Home,
	LandPlot,
	LucideIcon,
	Minus,
	ParkingCircle,
	Plus,
	Shirt,
	Trees,
	UtilityPole,
} from 'lucide-react-native';

export default function ListingAmenities() {
	const { listing, updateListing } = useTempStore();
	function addToFacilities(
		{
			label,
			iconName,
		}: {
			label: string;
			icon: LucideIcon;
			iconName: string;
		},
		action: 'add' | 'minus'
	) {
		const prevFacilities = listing.facilities ?? [];
		const existing = prevFacilities.find((fac) => fac.label === label);

		let updatedFacilities;

		if (!existing && action === 'add') {
			// Add new facility with value 1
			updatedFacilities = [
				...prevFacilities,
				{ label, value: 1, icon: iconName },
			];
		} else if (existing) {
			const newValue =
				action === 'add' ? existing.value + 1 : existing.value - 1;

			if (newValue > 0) {
				// Update value
				updatedFacilities = prevFacilities.map((fac) =>
					fac.label === label ? { ...fac, value: newValue } : fac
				);
			} else {
				// Remove item when value becomes 0
				updatedFacilities = prevFacilities.filter((fac) => fac.label !== label);
			}
		} else {
			// No change if action is 'minus' and item doesn't exist
			updatedFacilities = prevFacilities;
		}

		updateListing({
			...listing,
			facilities: updatedFacilities,
		});
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
															onPress={() => addToFacilities(item, 'minus')}>
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
															onPress={() => addToFacilities(item, 'add')}>
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
				icon: Bed,
				iconName: 'Bed',
			},
			{
				label: 'Bathroom',
				icon: Bath,
				iconName: 'Bath',
			},
			{
				label: 'Home Office',
				icon: Home,
				iconName: 'Home',
			},
			{
				label: 'Laundry Room',
				icon: Shirt,
				iconName: 'Shirt',
			},
		],
	},
	// {
	// 	title: 'Land Area',
	// 	data: [
	// 		{
	// 			label: 'Lenght',
	// 			icon: LandPlot,
	// 		},
	// 		{
	// 			label: 'Width',
	// 			icon: LandPlot,
	// 		},
	// 	],
	// },
	{
		title: 'Essential Amenities',
		data: [
			{
				label: 'Parking Area',
				icon: ParkingCircle,
				iconName: 'ParkingCircle',
			},
			{
				label: 'Garden',
				icon: Trees,
				iconName: 'Trees',
			},
			{
				label: 'Water Supply',
				icon: Droplet,
				iconName: 'Droplet',
			},
			{
				label: 'Electricity',
				icon: UtilityPole,
				iconName: 'UtilityPole',
			},
		],
	},
];
