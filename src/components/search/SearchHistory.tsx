import Chip from '@/components/shared/Chip';
import { storage } from '@/lib/asyncStorage';
import trim from 'lodash-es/trim';
import { Pressable, ScrollView, View } from 'react-native';
import { useMMKVString } from 'react-native-mmkv';
import { Text } from '../ui';

type SearchHistoryProps = {
	setSearchText: (text: string, service?: any) => void;
	service?: any;
};

export default function SearchHistory(props: SearchHistoryProps) {
	const { setSearchText, service } = props;

	const { getList, removeFromList, clearList } = useSearchHistoryStorage();

	console.log('[SearchHistory] ', { service });

	const historyItems = getList(service);

	return (
		<>
			{!!historyItems.length && (
				<View className="">
					<View className="flex-row justify-between mb-3 px-4">
						<Text>Search history</Text>
						<Pressable
							className="active:opacity:80"
							onPress={() => clearList()}>
							<Text className="text-primary-900">Clear all</Text>
						</Pressable>
					</View>
					<View className="relative">
						<ScrollView
							horizontal
							contentContainerClassName="flex-row gap-4 pl-4"
							// hide scrollbar
							showsHorizontalScrollIndicator={false}
							// for ios - https://stackoverflow.com/questions/74370879/scrollview-fadeingedgelength-equivalent-for-ios-in-react-native
							fadingEdgeLength={102}
							keyboardShouldPersistTaps="handled">
							{historyItems.map((item) => (
								<Chip
									key={item.text}
									text={item.text}
									onRemove={() => removeFromList(item.text)}
									onPress={() => setSearchText(item.text, service)}
								/>
							))}
							<View className="w-10" collapsable={false} />
						</ScrollView>
					</View>
				</View>
			)}
		</>
	);
}

// todo: change to 'searchHistoryV2' before pushing
const searchHistoryStorageKey = 'searchHistory_temp_1';

type TextObj = {
	text: string;
	service?: any;
};
export function useSearchHistoryStorage() {
	const [textObjList, setTextObjList] = useMMKVString(
		searchHistoryStorageKey,
		storage
	);

	const addToList = (text: string, service?: any) => {
		const list = textObjList
			? JSON.parse(textObjList).filter(
					(item: TextObj) => item.text.toLowerCase() !== text.toLowerCase()
				)
			: [];
		setTextObjList(
			JSON.stringify([
				{ text: trim(text), ...(service && { service }) },
				...list,
			])
		);
	};

	const removeFromList = (text: string) => {
		const list = textObjList
			? JSON.parse(textObjList).filter((item: TextObj) => item.text !== text)
			: [];
		setTextObjList(JSON.stringify(list));
	};

	const getList: (service?: any) => TextObj[] = (service) => {
		if (!textObjList) return [];

		const parsedTextObjList: TextObj[] = JSON.parse(textObjList);

		if (service) {
			return parsedTextObjList.filter((textObj) => textObj.service === service);
		} else {
			return parsedTextObjList;
		}
	};

	const clearList = () => {
		setTextObjList('');
	};

	return {
		addToList,
		removeFromList,
		getList,
		clearList,
	};
}
