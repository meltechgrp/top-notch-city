import SearchAutoCompleteView from '@/components/search/SearchAutoCompleteView';
import SearchFilterBottomSheet from '@/components/search/SearchFilterBottomSheet';
import { useSearchHistoryStorage } from '@/components/search/SearchHistory';
import SearchHistoryScreen from '@/components/search/SearchHistoryScreen';
import SearchResultsView from '@/components/search/SearchResultsView';
import { Box, Pressable, View } from '@/components/ui';
import { searchTypeAhead } from '@/lib/api';
import { cn, useLazyApiQuery } from '@/lib/utils';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import debounce from 'lodash-es/debounce';
import {
	ChevronLeftIcon,
	ListFilterIcon,
	SearchIcon,
	XIcon,
} from 'lucide-react-native';
import { useCallback, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SearchPage() {
	const { q } = useLocalSearchParams<{
		q?: string;
	}>();
	const [autocompleteSearch, { data, loading }] =
		useLazyApiQuery(searchTypeAhead);
	const [text, setText] = useState(q || '');
	const [typing, setTyping] = useState(false);
	const [showResults, setShowResults] = useState(!!q);
	const [showFilter, setShowFilter] = useState(false);
	const [filter, setFilter] = useState({
		state: null as string | null,
		towns: [] as string[],
	});
	const { addToList: addToSearchHistory } = useSearchHistoryStorage();

	const textInputRef = useRef<TextInput>(null);

	const debouncedAutocompleteSearch = useRef(
		debounce(autocompleteSearch, 500)
	).current;

	function onChangeText(text: string) {
		setText(text);
		setTyping(text.length > 0);
		setShowResults(false);
		if (filter.state) {
			debouncedAutocompleteSearch(text, { ...filter } as any);
		} else {
			debouncedAutocompleteSearch(text, {});
		}
	}
	function onSubmit() {
		addToSearchHistory(text);
		router.navigate(`/search?q=${text}`);
	}

	useFocusEffect(
		useCallback(() => {
			if (q) {
				setText(q);
				setTyping(false);
				setShowResults(true);
			} else {
				textInputRef.current?.focus();
			}
		}, [q])
	);

	return (
		<Box className="flex-1">
			<SafeAreaView edges={['top']} style={{ flex: 1 }}>
				<View className="flex-row items-center w-full h-[36px]">
					<View className="flex-row items-center gap-x-1 pr-4 h-full w-full">
						<Pressable
							onPress={() => {
								router.back();
							}}
							className="py-2 flex-row items-center pl-4 pr-3">
							<ChevronLeftIcon className="text-black-900 w-6 h-6" />
						</Pressable>
						<View className="h-10 border border-gray-300 flex-1 rounded-lg flex-row items-center px-2">
							<SearchIcon className="text-gray-500" width={24} height={24} />
							<TextInput
								ref={textInputRef}
								className="h-[36px] flex-1 px-2"
								placeholder={'Search property, type or city.'}
								value={text}
								onChangeText={onChangeText}
								onSubmitEditing={onSubmit}
								returnKeyLabel="Search"
								returnKeyType="search"
							/>
							{!!text && (
								<Pressable
									className="px-2 h-10 justify-center"
									onPress={() => onChangeText('')}>
									<View className="w-5 h-5 rounded-full bg-gray-200 items-center justify-center">
										<XIcon className="text-gray-400" width={9} height={8} />
									</View>
								</Pressable>
							)}
						</View>
						<Pressable
							className="pl-2 h-full items-center justify-center"
							onPress={() => setShowFilter(true)}>
							<ListFilterIcon
								className={cn(
									'w-6 h-6',
									filter.state ? 'text-primary-900' : 'text-black-900'
								)}
							/>
						</Pressable>
					</View>
				</View>
				{/* {!typing && !showResults && <SearchHistoryScreen service={service} />} */}
				{/* {showResults && <SearchResultsView filter={filter} />}
				{typing && !!data && (
					<SearchAutoCompleteView data={data} loading={loading} />
				)} */}
			</SafeAreaView>
			{/* <SearchFilterBottomSheet
				visible={showFilter}
				onDismiss={() => setShowFilter(false)}
				state={filter.state}
				towns={filter.towns}
				onApply={(state: string | null, towns: string[]) => {
					setFilter({ state, towns });
				}}
			/> */}
		</Box>
	);
}
