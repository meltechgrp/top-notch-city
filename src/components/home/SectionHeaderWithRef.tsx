import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { Heading, Text } from '../ui';

type Props = {
	title: string;
	onSeeAllPress?: () => void;
	children: React.ReactNode;
	subTitle?: string;
	style?: StyleProp<ViewStyle>;
};
export default function SectionHeaderWithRef(props: Props) {
	const { title, onSeeAllPress, children, style, subTitle } = props;
	return (
		<View style={[style]} className="my-6 bg-transparent">
			<View className="flex-row justify-between pb-4 px-4 items-center">
				<Heading className="text- font-medium text-typography/80">
					{title}
				</Heading>
				{onSeeAllPress && (
					<Pressable
						style={[
							{
								width: 64,
								height: 34,
							},
						]}
						className="flex-row items-center  justify-center rounded-md"
						onPress={onSeeAllPress}>
						<Text className="text-sm font-heading text-blue-500">
							{subTitle ?? 'See all'}
						</Text>
					</Pressable>
				)}
			</View>
			{children}
		</View>
	);
}
