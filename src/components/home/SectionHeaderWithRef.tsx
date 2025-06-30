import { Pressable, StyleProp, View, ViewStyle } from 'react-native';
import { Heading, Text } from '../ui';
import { cn } from '@/lib/utils';

type Props = {
	title: string;
	onSeeAllPress?: () => void;
	children: React.ReactNode;
	subTitle?: string;
	style?: StyleProp<ViewStyle>;
	className?: string
};
export default function SectionHeaderWithRef(props: Props) {
	const { title, onSeeAllPress, children, style, subTitle, className } = props;
	return (
		<View style={[style]} className={cn("my-4 bg-transparent", className)}>
			<View className="flex-row justify-between py-2 mb-3 px-4 items-center">
				<Heading className="text-2xl font-bold text-typography/80">
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
						<Text className="text-base font-heading text-primary">
							{subTitle ?? 'See all'}
						</Text>
					</Pressable>
				)}
			</View>
			{children}
		</View>
	);
}
