import WheelPicker from 'react-native-wheely';
import { Text, View } from '../ui';
import { useMemo } from 'react';

interface RangePickerProps {
	value?: string;
	options: Array<string>;
	onChange: (val: string) => void;
}

export default function RangePicker({
	value,
	options,
	onChange,
}: RangePickerProps) {
	const selected =
		useMemo(() => options.findIndex((item) => item == value), [value]) || 0;
	return (
		<View className="items-center">
			<WheelPicker
				selectedIndex={selected}
				options={options}
				onChange={(i) => onChange(options[i])}
			/>
		</View>
	);
}
