import withRenderVisible from '@/components/shared/withRenderOpen';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import {
	Badge,
	Slider,
	Text,
	Select,
	SelectTrigger,
	SelectInput,
	SelectIcon,
	SelectPortal,
	SelectBackdrop,
	SelectContent,
	SelectDragIndicator,
	SelectDragIndicatorWrapper,
	SelectItem,
	Pressable,
	Button,
	ButtonText,
} from '../ui';
import { KeyboardDismissPressable } from '../shared/KeyboardDismissPressable';
import { Filter } from '@/app/(protected)/search';
import BottomSheet from '../shared/BottomSheet';
import { cn, formatMoney } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react-native';
import { BottomSheetFlashList } from '@gorhom/bottom-sheet';

type Props = {
	show: boolean;
	onDismiss: () => void;
	onApply: (state: string | null, towns: string[]) => void;
	filter: Filter;
};
function SearchFilterBottomSheet(props: Props) {
	const { show, onDismiss, onApply, filter: initialFilter } = props;
	const [filter, setFilter] = useState({ ...initialFilter });
	const data = useMemo(
		() =>
			Array(50)
				.fill('lagos')
				.map((item, index) => `${item}-${index}`),
		[]
	);
	return (
		<BottomSheet
			title="Filter"
			withHeader={true}
			withBackButton={false}
			snapPoint={['60%', '80%']}
			visible={show}
			onDismiss={onDismiss}>
			<KeyboardDismissPressable>
				<View className="flex-1 px-4 gap-4 py-5 bg-background-muted">
					<View className="gap-2">
						<Text className="text-lg font-medium mb-2">Listing Type</Text>
						<View className="flex-row gap-4">
							{['all', 'buy', 'rent'].map((type) => (
								<Pressable
									key={type}
									onPress={() => setFilter({ ...filter, type })}>
									<Badge
										className={cn(
											'rounded-3xl bg-background-info py-2 px-6',
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
					<View className="gap-2">
						<Text className="text-lg font-medium mb-2">Locations</Text>
					</View>
					<View className="gap-1">
						<Text className="text-lg font-medium mb-2">Price Range</Text>
						<View className="flex-row gap-2 items-center justify-center">
							<Text>{formatMoney(100000, 'NGN')}</Text>
							<Text>-</Text>
							<Text>{formatMoney(filter.price.max, 'NGN')}</Text>
						</View>
						<View className="px-2 mt-2">
							<Slider
								value={filter.price.max}
								onChange={(value) => {
									setFilter({
										...filter,
										price: { ...filter.price, max: value },
									});
								}}
								minValue={100000}
								maxValue={10000 * 100}
							/>
						</View>
					</View>
					<View className="flex-row gap-4 mt-6 justify-center items-center">
						<Button size="xl" variant="outline">
							<ButtonText>Reset</ButtonText>
						</Button>
						<Button size="xl" variant="solid">
							<ButtonText>Apply</ButtonText>
						</Button>
					</View>
				</View>
			</KeyboardDismissPressable>
		</BottomSheet>
	);
}

export default withRenderVisible(SearchFilterBottomSheet);
