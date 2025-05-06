import BottomSheetTwo from '@/components/shared/BottomSheetTwo';

import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Button, ButtonText, Radio, Text } from '../ui';

type SortBottomSheetProps = {
	selected: OptionType;
	visible: boolean;
	onApply: (sortType: OptionType) => void;
	onDismiss: () => void;
	sortTypes: OptionType[];
};

export default function SortBottomSheet(props: SortBottomSheetProps) {
	const { visible, onApply, onDismiss, sortTypes, selected } = props;
	const [_selected, setSelected] = useState<OptionType>(selected);

	return (
		<BottomSheetTwo
			visible={visible}
			onDismiss={onDismiss}
			title="Sort"
			snapPoint="30%">
			<View className="px-4">
				<View className="gap-4">
					{sortTypes.map((sortType) => (
						<Pressable
							className="flex-row justify-between items-center"
							key={sortType.value}
							onPress={() => {
								setSelected(sortType);
							}}>
							<Text className="text-black-900 text-sm">{sortType.label}</Text>
							<Radio
								// value={_selected.value === sortType.value}
								value={_selected.value}
								onChange={() => setSelected(sortType)}
							/>
						</Pressable>
					))}
				</View>
				<Button
					onPress={() => {
						onApply(_selected);
						onDismiss();
					}}>
					<ButtonText>Apply</ButtonText>
				</Button>
			</View>
		</BottomSheetTwo>
	);
}
