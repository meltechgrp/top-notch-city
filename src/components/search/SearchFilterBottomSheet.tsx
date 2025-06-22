import withRenderVisible from '@/components/shared/withRenderOpen';
import { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Badge, Text, Pressable, Button, ButtonText, Heading } from '../ui';
import { KeyboardDismissPressable } from '../shared/KeyboardDismissPressable';
import BottomSheet from '../shared/BottomSheet';
import { cn } from '@/lib/utils';
import CustomSelect from '../shared/CustomSelect';
import OptionsBottomSheet from '../shared/OptionsBottomSheet';
import RangePicker from '../shared/RangePicker';
import { useCategoryQueries } from '@/tanstack/queries/useCategoryQueries';
import { Amenities } from '@/constants/Amenities';

const publishOptions = [
	{ label: 'Any', value: 'any' },
	{ label: '24 hrs', value: '24h' },
	{ label: '3 days', value: '3d' },
	{ label: '7 days', value: '7d' },
	{ label: '1 month', value: '1m' },
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
		onApply(filter);
		onDismiss();
	}

	function handleReset() {
		setFilter({});
		onApply({});
	}

	return (
		<BottomSheet
			title="Filter"
			withHeader
			withBackButton={false}
			snapPoint="90%"
			visible={show}
			withScroll
			onDismiss={onDismiss}>
			<KeyboardDismissPressable>
				<ScrollView className="flex-1 px-4 gap-8 py-5 pb-8 bg-background">
					<View className="gap-3">
						<Text className="text-lg font-medium">Listing Type</Text>
						<CustomSelect
							withDropIcon
							label="🤔 I'm looking to..."
							BottomSheet={OptionsBottomSheet}
							value={filter.purpose}
							valueParser={(value) => value || 'Select'}
							onChange={(val) => setFilter({ ...filter, purpose: val })}
							options={[
								{ label: 'Rent', value: 'rent' },
								{ label: 'Buy', value: 'sell' },
							]}
						/>
					</View>

					<View className="gap-3">
						<Text className="text-lg font-medium">Price Range (₦)</Text>
						<RangePicker
							value={filter.min_price}
							options={[]}
							onChange={(min) => setFilter({ ...filter, min_price: min })}
						/>
					</View>

					<View className="gap-3">
						<Text className="text-lg font-medium">Bedrooms</Text>
						<RangePicker
							value={filter.max_price}
							options={[]}
							onChange={(min) => setFilter({ ...filter, max_price: min })}
						/>
					</View>

					<View className="gap-1">
						<Text className="text-lg font-medium mb-2">Property Type</Text>
						<CustomSelect
							withDropIcon={true}
							BottomSheet={OptionsBottomSheet}
							value={filter.city}
							label="types"
							placeHolder="Select a property style"
							valueParser={(value: any) => value?.label}
							onChange={(value) => {
								setFilter({
									...filter,
									sub_category: value.value,
								});
							}}
							options={subcategories.map(({ name }) => ({
								label: name,
								value: name,
							}))}
						/>
					</View>

					<View className="gap-3">
						<Text className="text-lg font-medium">Published Within</Text>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							className="flex-row gap-2">
							{publishOptions.map(({ label, value }) => (
								<Pressable
									key={value}
									// onPress={() => setFilter({ ...filter, published: value })}
									className={cn(
										'px-4 py-2 rounded-full border'
										// filter.published === value
										// 	? 'bg-primary text-white'
										// 	: 'bg-transparent'
									)}>
									<Text
									// className={
									// 	filter.published === value
									// 		? 'text-white'
									// 		: 'text-typography'
									// }
									>
										{label}
									</Text>
								</Pressable>
							))}
						</ScrollView>
					</View>

					<View className="gap-3">
						<Text className="text-lg font-medium">Amenities</Text>

						<CustomSelect
							withDropIcon={true}
							BottomSheet={OptionsBottomSheet}
							value={filter.city}
							label="types"
							placeHolder="Select a property style"
							valueParser={(value: any) => value?.label}
							onChange={(value) => {
								setFilter({
									...filter,
									sub_category: value.value,
								});
							}}
							options={Amenities.map(({ title }) => ({
								label: title,
								value: title,
							}))}
						/>
					</View>

					<View className="gap-3">
						<Text className="text-lg font-medium">3D Tour</Text>
						<Pressable className="flex-row items-center gap-2">
							{/* onPress={() => setFilter({ ...filter, has3d: !filter?.has3d })}>
							<Badge variant={filter?.has3d ? 'solid' : 'outline'}>
								{filter?.has3d ? 'Enabled' : 'Disabled'}
							</Badge> */}
						</Pressable>
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
				</ScrollView>
			</KeyboardDismissPressable>
		</BottomSheet>
	);
}

export default withRenderVisible(SearchFilterBottomSheet);
