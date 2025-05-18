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
	function addToFeatures(label: string) {
		const prev = listing.features?.includes(label);
		let prevFeat = listing?.features ? listing.features : [];
		if (!prev)
			updateListing({
				...listing,
				features: [...prevFeat, label],
			});
		else {
			prevFeat = prevFeat.filter((feat) => feat !== label);
			updateListing({
				...listing,
				features: prevFeat,
			});
		}
	}
	function checkFacItem(item: string) {
		return listing.facilities?.find((fac) => fac.label === item)?.value ?? 0;
	}
	function checkFeatItem(item: string) {
		return listing.features?.includes(item);
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
										const prev = item.withNumber
											? listing.facilities?.find(
													(fac) => fac.label === item.label
												)
											: listing.features?.find((fac) => fac === item.label);
										return (
											<View
												key={item.label}
												className={cn(
													' gap-2 p-4 flex-row justify-between items-center rounded-2xl border-b border-outline'
												)}>
												<View className="flex-row gap-4 items-center">
													<Icon
														as={item.icon}
														className="text-primary w-4 h-4"
													/>
													<Text size="lg">{item.label}</Text>
												</View>
												<View>
													{item.withNumber ? (
														<View className="flex-row gap-3 items-center">
															<Pressable
																onPress={() =>
																	item.withNumber &&
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
																<Text size="xl">
																	{checkFacItem(item.label)}
																</Text>
															</View>
															<Pressable
																onPress={() =>
																	item.withNumber &&
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
													) : (
														<Checkbox
															size="md"
															value=""
															isChecked={checkFeatItem(item.label)}
															onChange={() => addToFeatures(item.label)}
															isInvalid={false}
															isDisabled={false}>
															<CheckboxIndicator>
																<CheckboxIcon as={CheckIcon} />
															</CheckboxIndicator>
														</Checkbox>
													)}
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
				withNumber: true,
				icon: Bed,
			},
			{
				label: 'Bathroom',
				value: 'bathrrom',
				withNumber: true,
				icon: Bath,
			},
			{
				label: 'Home Office',
				value: 'home-office',
				withNumber: false,
				icon: Home,
			},
			{
				label: 'Laundry Room',
				value: 'laundry-room',
				withNumber: false,
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
				withNumber: true,
				icon: LandPlot,
			},
			{
				label: 'Width',
				value: 'width',
				withNumber: true,
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
				withNumber: false,
				icon: ParkingCircle,
			},
			{
				label: 'Garden',
				value: 'garden',
				withNumber: false,
				icon: Trees,
			},
			{
				label: 'Water Supply',
				value: 'water-supply',
				withNumber: false,
				icon: Droplet,
			},
			{
				label: 'Electricity',
				value: 'electricity',
				withNumber: false,
				icon: UtilityPole,
			},
		],
	},
];
