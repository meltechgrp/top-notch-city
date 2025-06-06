// import SearchAutoCompleteView from '@/components/search/SearchAutoCompleteView';
import SearchFilterBottomSheet from '@/components/search/SearchFilterBottomSheet';
import Map, { MarkerData } from '@/components/location/map';
import { SearchHeader } from '@/components/search/Searchheader';
import { useSearchHistoryStorage } from '@/components/search/SearchHistory';
import { KeyboardDismissPressable } from '@/components/shared/KeyboardDismissPressable';
// import SearchHistoryScreen from '@/components/search/SearchHistoryScreen';
// import SearchResultsView from '@/components/search/SearchResultsView';
import { Box } from '@/components/ui';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import debounce from 'lodash-es/debounce';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, TextInput } from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { markersMapData } from '@/constants/DeleteLater';
import PropertyBottomSheet from '@/components/location/PropertyBottomSheet';

export type Filter = {
	type: string;
	city: {
		value: string;
		label: string;
	};
	price: {
		min: number;
		max: number;
		range: number;
	};
	category: string;
};

export default function SearchScreen() {
	const { q, propertyId } = useLocalSearchParams<{
		q?: string;
		propertyId?: string;
	}>();

	const { height: totalHeight } = Dimensions.get('screen');
	const [text, setText] = useState(q || '');
	const [typing, setTyping] = useState(false);
	const [showResults, setShowResults] = useState(!!q);
	const [showFilter, setShowFilter] = useState(false);
	const [selectedMarker, setSelectedMarker] = useState<MarkerData | null>(null);
	const [filter, setFilter] = useState<Filter>({
		type: 'all',
		city: {
			value: '',
			label: '',
		},
		price: {
			min: 100000,
			max: 1000000,
			range: 100000,
		},
		category: 'all',
	});
	const { addToList: addToSearchHistory } = useSearchHistoryStorage();

	const textInputRef = useRef<TextInput>(null);

	function onChangeText(text: string) {
		setText(text);
		setTyping(text.length > 0);
		// setShowResults(false);
		// if (filter.state) {
		// 	debouncedAutocompleteSearch(text, { ...filter } as any);
		// } else {
		// 	debouncedAutocompleteSearch(text, {});
		// }
	}
	function onSubmit() {
		addToSearchHistory(text);
		router.navigate(`/search?q=${text}`);
	}

	useEffect(() => {
		if (Platform.OS == 'android') {
			SystemNavigationBar.setNavigationColor('translucent');
		}
	}, []);
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
	useEffect(() => {
		if (propertyId) {
			const property = markersMapData.find((p) => p.id === propertyId);
			if (property) {
				setSelectedMarker(property);
			}
		}
	}, [propertyId]);

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
					markers={markersMapData}
					onMarkerPress={(marker) => setSelectedMarker(marker)}
				/>

				{selectedMarker && (
					<PropertyBottomSheet
						visible={!!selectedMarker}
						data={selectedMarker}
						onContinue={() => {
							setSelectedMarker(null);
							router.push({
								pathname: '/(protected)/property/[propertyId]',
								params: { propertyId: selectedMarker.name },
							});
						}}
						onDismiss={() => setSelectedMarker(null)}
					/>
				)}
			</KeyboardDismissPressable>
		</Box>
	);
}
