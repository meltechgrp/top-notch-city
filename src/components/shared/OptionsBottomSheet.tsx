import { cn } from '@/lib/utils';
import * as React from 'react';
import { Pressable, TouchableWithoutFeedback, View } from 'react-native';
import { Text } from '../ui';
import BottomSheetPlain from './BottomSheetPlain';
import { FlashList } from '@shopify/flash-list';
type OptionProps = {
	option: OptionType;
	onChange: (value: OptionType) => void;
	value: OptionType;
	index: number;
	selected: boolean;
};
export type Props = {
	value: OptionType;
	onChange: (value: OptionType) => void;
	onDismiss: () => void;
	withBackground?: boolean;
	isOpen: boolean;
	options: OptionType[];
	OptionComponent?: React.ComponentType<
		TouchableWithoutFeedback['props'] & OptionProps
	>;
};
export default function OptionsBottomSheet(props: Props) {
	const {
		isOpen,
		onDismiss,
		onChange,
		value,
		options,
		OptionComponent,
		withBackground = true,
	} = props;
	return (
		<BottomSheetPlain
			withBackground={withBackground}
			visible={isOpen}
			onDismiss={onDismiss}>
			<View
				style={{ height: options.length < 8 ? options.length * 53 : 450 }}
				className={
					withBackground
						? 'bg-background-muted py-2 rounded-2xl overflow-hidden '
						: ''
				}>
				<FlashList
					data={options}
					showsVerticalScrollIndicator={false}
					keyExtractor={(item) => item.label}
					estimatedItemSize={40}
					renderItem={({ item: option, index }) =>
						OptionComponent ? (
							<OptionComponent
								key={option.label}
								option={option}
								onChange={() => {
									onChange(option);
									onDismiss();
								}}
								value={value}
								index={index}
								className={cn('p-4', {
									'border-outline border-t ': !!index,
								})}
								selected={value?.value === option.value}
							/>
						) : (
							<Pressable
								key={option.label}
								onPress={() => {
									onChange(option);
									onDismiss();
								}}
								className={cn(
									'px-4 h-14 flex-row  items-center',
									!!index && withBackground && 'border-outline border-t ',
									!withBackground && 'bg-background-muted rounded-xl'
								)}>
								<Text
									className={cn(
										'text-base text-center flex-1',
										option.mode === 'destructive'
											? 'text-red-900'
											: value?.value === option.value && 'text-primary'
									)}>
									{option.label}
								</Text>
							</Pressable>
						)
					}
				/>
			</View>
		</BottomSheetPlain>
	);
}
