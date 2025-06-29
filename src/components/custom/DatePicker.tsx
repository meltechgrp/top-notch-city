import React, { useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';
import DatePickerLib, { DatePickerProps } from 'react-native-date-picker';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Icon, Text, useResolvedTheme } from '../ui';
import { CalendarIcon } from 'lucide-react-native';

type IProps = Partial<DatePickerProps> & {
	value?: string | number | Date | null;
	label?: string;
	onChange?: (value: string | number | Date) => void;
	placeholder?: string;
	formatPattern?: string; //'dd/MM/yyyy'
	textClassName?: string;
	startDate?: Date;
	modal?: boolean;
};
export default function DatePicker(props: IProps) {
	const {
		value,
		onChange,
		placeholder,
		label,
		formatPattern = 'dd/MM/yyyy',
		textClassName,
		startDate,
		modal = true,
		...rest
	} = props;
	const theme = useResolvedTheme();
	const [show, setShow] = useState(false);
	const formattedValue = useMemo(() => {
		if (value === undefined || value === null) {
			return placeholder;
		}
		const date = new Date(value);

		return format(date, formatPattern);
	}, [value]);
	const onPress = () => {
		setShow(true);
	};
	return (
		<>
			{modal && (
				<Pressable
					onPress={onPress}
					className="h-[52px] border border-outline rounded-lg flex-row items-center px-4">
					<View className="flex-1 pb-2 pt-1">
						<Text className="text-xs ">{label}</Text>
						<Text className={cn(' text-base', textClassName)}>
							{formattedValue}
						</Text>
					</View>
					<Icon as={CalendarIcon} />
				</Pressable>
			)}
			<DatePickerLib
				date={new Date(value || startDate || Date.now())}
				modal={modal}
				open={show}
				theme={theme}
				className={cn(!modal && 'mx-auto bg-blue-500')}
				onDateChange={(date) => {
					if (modal) return;
					console.log(date);
					onChange?.(date);
					setShow(false);
				}}
				onConfirm={(date) => {
					onChange?.(date);
					setShow(false);
				}}
				onCancel={() => {
					setShow(false);
				}}
				maximumDate={new Date()}
				{...rest}
			/>
		</>
	);
}
