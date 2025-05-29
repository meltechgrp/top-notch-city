import withRenderVisible from '@/components/shared/withRenderOpen';
import { useState } from 'react';
import { View } from 'react-native';
import { Badge, Slider, Text, Pressable, Button, ButtonText } from '../ui';
import { KeyboardDismissPressable } from '../shared/KeyboardDismissPressable';
import BottomSheet from '../shared/BottomSheet';
import { cn, formatMoney } from '@/lib/utils';
import CustomSelect from '../shared/CustomSelect';
import OptionsBottomSheet from '../shared/OptionsBottomSheet';
import { Cities } from '@/constants/Cities';
import { Filter } from '@/app/(protected)/(tabs)/search';

type Props = {
	show: boolean;
	onDismiss: () => void;
	onApply: (data: Filter) => void;
	filter: Filter;
};
function SearchFilterBottomSheet(props: Props) {
	const { show, onDismiss, onApply, filter: initialFilter } = props;
	const [filter, setFilter] = useState({ ...initialFilter });
	function handleApply() {
		onApply(filter);
		onDismiss();
	}
	return (
		<BottomSheet
			title="Filter"
			withHeader={true}
			withBackButton={false}
			snapPoint={'55%'}
			visible={show}
			onDismiss={onDismiss}>
			<KeyboardDismissPressable>
				<View className="flex-1 px-4 gap-8 py-5 pb-8 bg-background">
					<View className="gap-1">
						<Text className="text-lg font-medium mb-2">Listing Type</Text>
						<View className="flex-row gap-4">
							{['all', 'buy', 'rent'].map((type) => (
								<Pressable
									key={type}
									onPress={() => setFilter({ ...filter, type })}>
									<Badge
										className={cn(
											'rounded-3xl py-2 px-6',
											filter.type == type ? 'bg-primary' : 'bg-background-info'
										)}>
										<Text
											className={cn(
												'text-lg capitalize',
												filter.type == type && 'text-white'
											)}>
											{type}
										</Text>
									</Badge>
								</Pressable>
							))}
						</View>
					</View>
					<View className="gap-1">
						<Text className="text-lg font-medium mb-2">Cities</Text>
						<CustomSelect
							withDropIcon={true}
							BottomSheet={OptionsBottomSheet}
							value={filter.city}
							label="Cities"
							placeHolder="Select a city"
							valueParser={(value: any) => value?.label}
							onChange={(value) => {
								setFilter({
									...filter,
									city: value,
								});
							}}
							options={Cities}
						/>
					</View>
					<View className="gap-1">
						<Text className="text-lg font-medium mb-2">Price Range</Text>
						<View className="flex-row gap-2 mb-2 items-center justify-center">
							<Text size="xl">{formatMoney(100000, 'NGN')}</Text>
							<Text size="xl">-</Text>
							<Text size="xl">{formatMoney(filter.price.range, 'NGN')}</Text>
						</View>
						<View className="px-2 mt-2">
							<Slider
								value={filter.price.range}
								onChange={(value) => {
									setFilter({
										...filter,
										price: { ...filter.price, range: value },
									});
								}}
								minValue={filter.price.min}
								maxValue={filter.price.max}
							/>
						</View>
					</View>
					<View className="flex-row gap-4 px-4 mt-6 justify-center items-center">
						<Button
							onPress={() => {
								const reset = {
									type: 'all',
									city: { value: '', label: '' },
									price: {
										min: filter.price.min,
										max: filter.price.max,
										range: filter.price.min,
									},
									category: 'all',
								};
								setFilter(reset);
								onApply(reset);
							}}
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
			</KeyboardDismissPressable>
		</BottomSheet>
	);
}

export default withRenderVisible(SearchFilterBottomSheet);
