import WheelPicker from 'react-native-wheely';
import * as Haptics from 'expo-haptics';
import {
	Button,
	ButtonText,
	CloseIcon,
	Heading,
	Icon,
	Pressable,
	Text,
	useResolvedTheme,
	View,
} from '../ui';
import { useEffect, useMemo, useState } from 'react';
import BottomSheetPlain from '../shared/BottomSheetPlain';
import { Colors } from '@/constants/Colors';
import { cn, formatMoney, parseFormat } from '@/lib/utils';
import { ChevronDown } from 'lucide-react-native';

interface RangePickerProps {
	value?: string;
	value2?: string;
	title: string;
	format?: boolean;
	options: Array<string>;
	options2?: Array<string>;
	double?: boolean;
	onChange: (val: string, val2?: string) => void;
}

export default function RangePicker({
	value,
	options,
	onChange,
	title,
	double = false,
	options2,
	value2,
	format = false,
}: RangePickerProps) {
	const theme = useResolvedTheme();
	const [visible, setVisible] = useState(false);
	const [min, setMin] = useState(0);
	const [max, setMax] = useState(0);
	function handleReset() {
		if (double && options2) onChange(options[0], options2[0]);
		else onChange(options[0]);
		setVisible(false);
	}
	function handleDone() {
		if (double && options2) onChange(options[min], options2[max]);
		else onChange(options[min]);
		setVisible(false);
	}
	useEffect(() => {
		setMin(
			Math.max(
				options.findIndex((item) => item === value),
				0
			)
		);
		if (double && options2 && value2) {
			const selectedMax = Math.max(
				options2.findIndex((item) => item === value2),
				0
			);
			setMax(selectedMax);
		}
	}, [value, value2, options, options2]);

	return (
		<>
			<View className=" flex-row gap-6">
				<Pressable
					onPress={() => setVisible(true)}
					className=" p-4 rounded-xl flex-1 h-14 justify-between flex-row items-center bg-background-muted">
					<Text className="text-sm font-normal">
						{double ? parseFormat(options[min]) : options[min]}
					</Text>
					<Icon as={ChevronDown} className="text-primary" />
				</Pressable>
				{double && options2 && (
					<Pressable
						onPress={() => setVisible(true)}
						className=" p-4 rounded-xl flex-1 h-14 justify-between flex-row items-center bg-background-muted">
						<Text className="text-sm font-normal">
							{parseFormat(options2[max])}
						</Text>
						<Icon as={ChevronDown} className="text-primary" />
					</Pressable>
				)}
			</View>
			<BottomSheetPlain
				withClose={false}
				withBackground={false}
				visible={visible}
				onDismiss={() => setVisible(false)}>
				<View
					style={{ height: 400 }}
					className=" bg-background-muted p-4 py-6 gap-4 rounded-t-2xl">
					<Pressable onPress={() => setVisible(false)} className="px-2">
						<Icon className="w-8 h-8" as={CloseIcon} />
					</Pressable>
					<View className="px-2">
						<Heading size="2xl">{title}</Heading>
					</View>
					<View className="flex-row flex-1 items-center gap-6">
						<View className={cn(!double ? ' w-3/4 mx-auto' : 'flex-1')}>
							<WheelPicker
								selectedIndex={min}
								options={options.map((item) =>
									format ? parseFormat(item) : item
								)}
								itemTextStyle={{
									fontSize: !double ? 22 : undefined,
									color:
										theme === 'dark' ? Colors.dark.text : Colors.light.text,
								}}
								selectedIndicatorStyle={{
									backgroundColor: Colors.primary,
									borderRadius: 15,
								}}
								decelerationRate={'fast'}
								onChange={(i) => {
									setMin(i);
									Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // subtle vibration
								}}></WheelPicker>
						</View>
						{double && options2 && (
							<View className="flex-1">
								<WheelPicker
									selectedIndex={max}
									options={options2.map((item) => parseFormat(item))}
									itemTextStyle={{
										color:
											theme === 'dark' ? Colors.dark.text : Colors.light.text,
									}}
									selectedIndicatorStyle={{
										backgroundColor: Colors.primary,
										borderRadius: 15,
									}}
									decelerationRate={'fast'}
									onChange={(i) => {
										setMax(i);
										Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); // subtle vibration
									}}
								/>
							</View>
						)}
					</View>
					<View className="flex-row gap-6 px-4">
						<Button
							onPress={handleReset}
							variant="outline"
							className=" flex-1 h-12 rounded-2xl">
							<ButtonText className="">Reset</ButtonText>
						</Button>
						<Button onPress={handleDone} className=" flex-1 h-12 rounded-2xl">
							<ButtonText className="">Done</ButtonText>
						</Button>
					</View>
				</View>
			</BottomSheetPlain>
		</>
	);
}
