import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { Text } from '../ui';

type Props = {
	title: string;
	onSeeAllPress: () => void;
	children: React.ReactNode;
	style?: StyleProp<ViewStyle>;
};
export default function SectionHeaderWithRef(props: Props) {
	const { title, onSeeAllPress, children, style } = props;
	return (
		<View style={[style]} className="my-6">
			<View className="flex-row justify-between pb-4 px-4 items-center">
				<Text className="text- font-medium text-gray-500">{title}</Text>
				<Pressable
					style={[
						{
							width: 64,
							height: 34,
						},
					]}
					className="flex-row items-center  justify-center rounded-md"
					onPress={onSeeAllPress}>
					<Text className="text-sm text-primary-500">See all</Text>
				</Pressable>
			</View>
			{children}
		</View>
	);
}
