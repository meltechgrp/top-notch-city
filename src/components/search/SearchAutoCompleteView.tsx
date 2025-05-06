import Loading from '@/components/search/Loading';
import { useSearchHistoryStorage } from '@/components/search/SearchHistory';
import { cn } from '@/lib/utils';
import type { TypeAheadResponse } from '@/lib/api';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { ArrowUpIcon, SearchIcon, Text } from '../ui';

type Props = {
	data: TypeAheadResponse;
	loading: boolean;
};
export default function SearchAutoCompleteView(props: Props) {
	const { data, loading } = props;
	const { addToList: addToSearchHistory } = useSearchHistoryStorage();

	function renderHighlights(d: TypeAheadResponse[0]['highlight']) {
		return d.map((item, index) => (
			<Text
				key={index}
				className={cn(item.isHighlighted ? 'text-gray-900' : 'text-gray-500')}>
				{item.value}
			</Text>
		));
	}

	function flattenHighlightToString(d: TypeAheadResponse[0]['highlight']) {
		return [...d].reverse().reduce((prev, cur) => cur.value + prev, '');
	}

	return (
		<View className="flex-1 bg-white">
			{loading ? (
				<Loading />
			) : (
				<ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
					{data?.length
						? data.map((item) => (
								<Pressable
									key={item.id}
									className="h-[48px] flex-row px-4 gap-x-2 active:bg-gray-200"
									onPress={() => {
										addToSearchHistory(
											flattenHighlightToString(item.highlight)
										);
									}}>
									<View className="w-8 items-center justify-center">
										<SearchIcon className="w-6 h-6 text-gray-500" />
									</View>
									<View className="flex-1 justify-center">
										<Text numberOfLines={1}>
											{renderHighlights(item.highlight)}
										</Text>
									</View>
									<View className="items-center justify-center">
										<ArrowUpIcon className="w-6 h-6 text-gray-500" />
									</View>
								</Pressable>
							))
						: null}
				</ScrollView>
			)}
		</View>
	);
}
