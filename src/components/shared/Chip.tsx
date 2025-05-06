import { Pressable, View } from 'react-native';
import { CloseIcon, Icon, Text } from '../ui';

export type ChipProps = {
	text: string;
	onRemove: (text: string) => void;
	onPress: (text: string) => void;
};

export default function Chip(props: ChipProps) {
	const { text, onRemove, onPress } = props;

	return (
		<Pressable
			className="bg-gray-200 rounded-lg flex-row items-center gap-[2px]"
			onPress={() => onPress(text)}
			style={{
				zIndex: 1000,
			}}>
			<View className="p-2">
				<Text>{text}</Text>
			</View>
			<Pressable
				className="active:bg-gray-300 p-2 items-center justify-center self-stretch rounded-lg"
				onPress={() => onRemove(text)}>
				<Icon as={CloseIcon} width={12} height={12} />
			</Pressable>
		</Pressable>
	);
}
