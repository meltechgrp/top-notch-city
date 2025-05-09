import BottomSheetTwo from '@/components/shared/BottomSheetTwo';

import * as React from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '../ui';

type Props = {
	visible: boolean;
	title: string;
	options: OptionType<{ icon?: any }>[];
	onDismiss: () => void;
	onChange: (value: OptionType) => void;
	snapPoint?: string;
};
export default function SimpleMenu(props: Props) {
	const { visible, onDismiss, title, options, onChange, snapPoint } = props;

	return (
		<BottomSheetTwo
			title={title}
			visible={visible}
			onDismiss={onDismiss}
			snapPoint={snapPoint}>
			<View style={{}}>
				{options.map((option) => (
					<Pressable
						key={option.value}
						onPress={() => onChange(option)}
						className="h-12 flex-row items-center px-4 active:bg-gray-200">
						{option.icon && <option.icon className="text-black-900 mr-4" />}
						<Text className="text-black-900 text-base">{option.label}</Text>
					</Pressable>
				))}
			</View>
		</BottomSheetTwo>
	);
}
