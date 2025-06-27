import withRenderVisible from '@/components/shared/withRenderOpen';
import { useState } from 'react';
import { View, ScrollView, Switch } from 'react-native';
import { Text, Pressable, Button, ButtonText } from '../ui';
import { KeyboardDismissPressable } from '../shared/KeyboardDismissPressable';
import BottomSheet from '../shared/BottomSheet';
import { cn } from '@/lib/utils';
import CustomSelect from '../shared/CustomSelect';
import OptionsBottomSheet from '../shared/OptionsBottomSheet';
import RangePicker from '../shared/RangePicker';
import { useCategoryQueries } from '@/tanstack/queries/useCategoryQueries';
import { Amenities } from '@/constants/Amenities';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
const now = new Date();

const publishOptions = [
	{ label: 'Any', value: 'any' },
	{
		label: '24 hrs',
		value: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
	},
	{
		label: '3 days',
		value: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
	},
	{
		label: '7 days',
		value: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
	},
	{
		label: '1 month',
		value: new Date(new Date().setMonth(now.getMonth() - 1)).toISOString(),
	},
];

type Props = {
	show: boolean;
	onDismiss: () => void;
	onApply: (data: SearchFilters) => void;
	filter: SearchFilters;
};

function SearchFilterBottomSheet({
	show,
	onDismiss,
	onApply,
	filter: initialFilter,
}: Props) {
	const [filter, setFilter] = useState({ ...initialFilter });
	const { subcategories } = useCategoryQueries();
	function handleApply() {
		onApply({ ...filter, use_geo_location: filter?.state ? 'false' : 'true' });
		onDismiss();
	}

	function handleReset() {
		setFilter({
			use_geo_location: filter?.state ? 'false' : 'true',
		});
		onApply({});
	}
	const purposes = [
		{ label: 'Rent', value: 'rent' },
		{ label: 'Buy', value: 'sell' },
	];
	return (
		<BottomSheet
			title="Filter"
			withHeader
			rounded={false}
			withBackButton={false}
			snapPoint={['60%', '70%']}
			visible={show}
			withScroll
			onDismiss={onDismiss}>
			<KeyboardDismissPressable>
				<ScrollView className="flex-1">
					<View className="flex-1 px-4 gap-4 py-5 pb-8 bg-background">
						<View className="gap-1.5">
							<Text className="text-sm">Listing Type</Text>
							<CustomSelect
								title="Listing Type"
								withDropIcon
								label="🤔 I'm looking to..."
								BottomSheet={OptionsBottomSheet}
								value={filter.purpose}
								valueParser={(value) =>
									purposes.find((item) => item.value == value)?.label ||
									`🤔 I'm looking to...`
								}
								onChange={(val) =>
									setFilter({ ...filter, purpose: val?.value })
								}
								options={purposes}
							/>
						</View>
						<View className="gap-1.5">
							<Text className="text-sm">Price range (₦)</Text>
							<RangePicker
								title="Price range"
								value={filter.min_price}
								value2={filter.max_price}
								double
								format
								options={['No Min', '100000', '200000', '500000', '1000000']}
								options2={['No Max', '100000', '200000', '500000', '1000000']}
								onChange={(min, max) => {
									setFilter((prev) => ({
										...prev,
										min_price: min,
										max_price: max,
									}));
								}}
							/>
						</View>
						<View className="gap-1.5">
							<Text className="text-sm">Bedrooms</Text>
							<RangePicker
								title="Bedroooms"
								value={filter.bedrooms}
								options={['Any', '1', '2', '3', '4', '5', '6']}
								onChange={(min) => setFilter({ ...filter, bedrooms: min })}
							/>
						</View>
						<View className="gap-1.5">
							<Text className="text-sm mb-2">Category</Text>
							<CustomSelect
								withDropIcon={true}
								BottomSheet={OptionsBottomSheet}
								value={filter.sub_category}
								label="types"
								placeHolder="Select a category"
								valueParser={(value: any) => value}
								onChange={(value) => {
									setFilter({
										...filter,
										sub_category: value.value,
									});
								}}
								options={subcategories.map(({ name }) => ({
									label: name,
									value: name?.trim(),
								}))}
							/>
						</View>

						<View className="gap-1.5">
							<Text className="text-sm">Published Within</Text>
							<BottomSheetScrollView
								horizontal
								showsHorizontalScrollIndicator={false}
								contentContainerClassName="gap-x-4 px-4">
								{publishOptions.map(({ label, value }) => {
									const isSelected =
										filter.createdAt === value ||
										(label === 'Any' && !filter.createdAt);
									return (
										<Pressable
											key={label}
											onPress={() => setFilter({ ...filter, createdAt: value })}
											className={cn(
												'px-5 items-center justify-center h-10 bg-background-muted rounded-xl border border-outline',
												isSelected
													? 'bg-primary'
													: 'bg-background-muted border-outline'
											)}>
											<Text
												className={
													filter.createdAt === value
														? 'text-white'
														: 'text-typography'
												}>
												{label}
											</Text>
										</Pressable>
									);
								})}
							</BottomSheetScrollView>
						</View>

						<View className="gap-1.5">
							<Text className="text-sm">Amenities</Text>
							<View className="gap-y-3 bg-background-muted rounded-xl p-4">
								{Amenities[2].data.map(({ label }) => {
									const isSelected = filter.amenities?.includes(label);

									return (
										<View
											key={label}
											className="flex-row items-center justify-between border-b border-outline/20 pb-2">
											<Text className="text-base text-typography">{label}</Text>
											<Switch
												value={isSelected}
												onValueChange={(val) => {
													let updatedAmenities = filter.amenities || [];

													if (val) {
														updatedAmenities = [...updatedAmenities, label];
													} else {
														updatedAmenities = updatedAmenities.filter(
															(item) => item !== label
														);
													}

													setFilter({ ...filter, amenities: updatedAmenities });
												}}
											/>
										</View>
									);
								})}
							</View>
						</View>

						<View className="gap-1.5">
							<Text className="text-sm">Others</Text>
							<View className="gap-y-3 bg-background-muted rounded-xl p-4">
								<View className="flex-row justify-between items-center">
									<Text>3D Tour</Text>
									<Switch
										value={filter?.tour === 'yes'}
										onValueChange={(val) =>
											setFilter({
												...filter,
												tour: val ? 'yes' : undefined,
											})
										}
									/>
								</View>
							</View>
						</View>

						<View className="flex-row gap-4 px-4 mt-6 justify-center items-center">
							<Button
								onPress={handleReset}
								className="h-14 flex-1"
								size="xl"
								variant="outline">
								<ButtonText>Reset</ButtonText>
							</Button>
							<Button
								onPress={handleApply}
								className="h-14 flex-1"
								size="xl"
								variant="solid">
								<ButtonText>Apply</ButtonText>
							</Button>
						</View>
					</View>
				</ScrollView>
			</KeyboardDismissPressable>
		</BottomSheet>
	);
}

export default withRenderVisible(SearchFilterBottomSheet);
