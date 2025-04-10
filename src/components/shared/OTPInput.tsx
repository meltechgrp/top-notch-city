import * as React from 'react';
import {
	NativeSyntheticEvent,
	TextInput,
	TextInputKeyPressEventData,
} from 'react-native';
import Layout from '@/constants/Layout';
// import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { cn } from '@/lib/utils';
import { View } from '../ui';
type Props = {
	inputStyle?: TextInput['props']['style'];
	onTextChange?: (text: string) => void;
	onTextComplete?: (text: string) => void;
	inputRange?: number[];
	inputProps?: TextInput['props'];
	hasError?: boolean;
	inModal?: boolean;
	className?: string;
};

export default function OTPInput(props: Props) {
	const {
		inputStyle,
		onTextChange,
		onTextComplete,
		inputRange = [0, 1, 2, 3, 4, 5],
		inputProps = {},
		hasError,
		inModal,
		className,
	} = props;
	const [value, setValue] = React.useState<{ [k: number]: string }>({});
	const [focused, setFocused] = React.useState<number>(-1);
	const Input = TextInput;
	// prettier-ignore
	const w = React.useMemo( ()=>(Layout.window.width - ((inputRange.length - 1 ) * 18) - 48) / inputRange.length,[inputRange])

	const refs = React.useRef<React.MutableRefObject<TextInput>[]>([]);
	refs.current = inputRange.map<React.MutableRefObject<TextInput>>(
		(_, index) => (refs.current[index] = React.createRef() as any)
	);
	async function onChange(text: string, id: number) {
		if (id == 0) {
			// Only check for paste when at the first input
			if (new RegExp(`^(\\d{${inputRange.length}})$`).test(text)) {
				setValue(
					inputRange.reduce((obj, id) => ({ ...obj, [id]: text[id] }), {})
				);
				refs.current[inputRange.length - 1].current?.focus();
				return;
			}
		}
		// incase there are more than one characters in clipboard (text) pick the last
		// character
		text = text.length > 1 ? text.slice(-1) : text;

		if (/^(\d{1})$/.test(text)) {
			setValue((v) => ({ ...v, [id]: text }));
			if (id != inputRange.length - 1 && text) {
				refs.current[id + 1].current.focus();
			}
		} else {
			setValue((v) => ({ ...v, [id]: '' }));
		}
	}

	function onKeyPress(
		ev: NativeSyntheticEvent<TextInputKeyPressEventData>,
		id: number
	) {
		const key = ev.nativeEvent.key;
		const val = value[id];
		if (key === 'Backspace' && id !== 0) {
			setValue((v) => ({ ...v, [id]: '' }));
			!val && refs.current[id - 1].current.focus();
		}
	}
	React.useEffect(() => {
		onTextChange?.(Object.values(value).join(''));
		if (Object.values(value).length === inputRange.length) {
			onTextComplete?.(Object.values(value).join(''));
		}
	}, [value]);

	return (
		<View className="justify-between flex-row w-full">
			{inputRange.map((id) => {
				return (
					<View
						className={cn(
							'text-center rounded-md text-lg border  leading-tight justify-center items-center flex',
							{
								'border-gray-500': id != focused,
								'border-primary': id == focused,
								'border-red-500': !!hasError,
							},
							className
						)}
						style={[
							inputStyle,
							{
								width: w,
								height: w,
							},
						]}
						key={id}>
						<Input
							value={value[id]}
							ref={refs.current[id]}
							{...(id ? {} : { autoFocus: true })}
							key={id}
							textAlign="center"
							className="text-center"
							keyboardType="phone-pad"
							onChangeText={(v) => onChange(v, id)}
							onKeyPress={(v) => onKeyPress(v, id)}
							onFocus={() => setFocused(id)}
							{...inputProps}
						/>
					</View>
				);
			})}
		</View>
	);
}
