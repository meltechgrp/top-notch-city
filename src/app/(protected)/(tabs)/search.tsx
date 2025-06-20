import SearchFilterBottomSheet from '@/components/search/SearchFilterBottomSheet';
import Map from '@/components/location/map';
import { SearchHeader } from '@/components/search/Searchheader';
import { useSearchHistoryStorage } from '@/components/search/SearchHistory';
import { KeyboardDismissPressable } from '@/components/shared/KeyboardDismissPressable';
import { Box } from '@/components/ui';
import { router } from 'expo-router';
import debounce from 'lodash-es/debounce';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, Platform, TextInput } from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import PropertyBottomSheet from '@/components/location/PropertyBottomSheet';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { searchProperties } from '@/actions/search';

export default function SearchScreen() {
	const { height: totalHeight } = Dimensions.get('screen');
	const [text, setText] = useState('');
	const [showResults, setShowResults] = useState(false);
	const [selectedItem, setSeletedItem] = useState<Property | null>(null);
	const [showFilter, setShowFilter] = useState(false);
	const [filter, setFilter] = useState<SearchFilters>({});

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
		useInfiniteQuery({
			queryKey: ['search', filter],
			queryFn: ({ pageParam = 1 }) => searchProperties(filter, pageParam),
			getNextPageParam: (lastPage) => {
				const { page, pages } = lastPage;
				return page < pages ? page + 1 : undefined;
			},
			initialPageParam: 1,
			enabled: false,
		});
	const { addToList: addToSearchHistory } = useSearchHistoryStorage();

	const textInputRef = useRef<TextInput>(null);

	const debouncedSearch = useRef(debounce(refetch, 500)).current;

	function onChangeText(value: string) {
		setText(value);
		// optionally use value to update filter as well (if searching by text)
		// setFilter({ ...filter, keyword: value })
		debouncedSearch();
	}
	function onSubmit() {
		addToSearchHistory(text);
		refetch();
	}

	const properties = useMemo(
		() => data?.pages.flatMap((page) => page.results) || [],
		[data]
	);
	return (
		<Box className="flex-1 relative">
			<KeyboardDismissPressable>
				<SearchHeader
					text={text}
					onChangeText={onChangeText}
					onSubmit={onSubmit}
					textInputRef={textInputRef}
					setShowFilter={setShowFilter}
					filter={filter}
					setFilter={(cat) => setFilter({ ...filter, category: cat })}
				/>
				<SearchFilterBottomSheet
					show={showFilter}
					onDismiss={() => setShowFilter(false)}
					filter={filter}
					onApply={setFilter}
				/>

				{/* {!typing && !showResults && <SearchHistoryScreen service={service} />} */}
				{/* {showResults && <SearchResultsView filter={filter} />}
        {typing && !!data && (
          <SearchAutoCompleteView data={data} loading={loading} />
        )} */}

				<Map
					scrollEnabled={true}
					height={totalHeight}
					showUserLocation={true}
					markers={properties}
					onMarkerPress={(marker) => setSeletedItem(marker)}
				/>

				{selectedItem && (
					<PropertyBottomSheet
						visible={!!selectedItem}
						data={selectedItem}
						onContinue={() => {
							router.push({
								pathname: '/(protected)/property/[propertyId]',
								params: { propertyId: selectedItem.id },
							});
						}}
						onDismiss={() => setSeletedItem(null)}
					/>
				)}
			</KeyboardDismissPressable>
		</Box>
	);
}
