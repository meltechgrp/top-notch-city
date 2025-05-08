import { Pressable, Text, View } from '../ui';

type TrendingProps = {
	onSelectKeyword: (keyword: string) => void;
};

const keywords = ['Canva pro', 'Yam', 'Netflix', 'youtube music', 'vpn'];

export default function Trending(props: TrendingProps) {
	const { onSelectKeyword: onSelect } = props;

	return (
		<View className="px-4">
			<Text className="text-black">Trending keywords </Text>
			<View className="mt-4 flex-row gap-2 flex-wrap">
				{keywords.map((keyword, i) => (
					<Pressable
						key={i}
						className="p-2 rounded-lg items-center justify-between bg-primary-200 active:bg-primary-300"
						onPress={() => onSelect(keyword)}>
						<Text className="text-sm text-primary-dark">{keyword}</Text>
					</Pressable>
				))}
			</View>
		</View>
	);
}
