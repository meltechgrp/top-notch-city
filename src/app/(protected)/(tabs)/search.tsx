import { SearchHeader } from '@/components/search/Searchheader';
import { Box, View } from '@/components/ui';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import SearchTabs from '@/components/search/SearchTabs';
import PagerView from 'react-native-pager-view';
import { SearchMapView } from '@/components/search/SearchMapView';
import SearchListView from '@/components/search/SearchListView';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchLocationBottomSheet from '@/components/search/SearchLocationBottomSheet';
import SearchFilterBottomSheet from '@/components/search/SearchFilterBottomSheet';
import { useProductQueries } from '@/tanstack/queries/useProductQueries';

const TABS = ['Map View', 'List View'];

export default function SearchScreen() {
	const { height: totalHeight } = Dimensions.get('screen');
	const [showFilter, setShowFilter] = useState(false);
	const [locationBottomSheet, setLocationBottomSheet] = useState(false);
	const pagerRef = useRef<PagerView>(null);
	const [currentPage, setCurrentPage] = useState(0);
	const [filter, setFilter] = useState<SearchFilters>({
		use_geo_location: 'true',
	});
	const {
		data,
		refetch,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useProductQueries({ type: 'search', filter, enabled: false });

	useEffect(() => {
		refetch();
	}, [filter]);

	const onTabChange = React.useCallback((index: number) => {
		setCurrentPage(index);
		pagerRef.current?.setPage(index);
	}, []);
	const properties = useMemo(
		() => data?.pages.flatMap((page) => page.results) || [],
		[data]
	);
	return (
		<Box className="flex-1 relative">
			<SearchHeader
				filter={filter}
				setLocationBottomSheet={() => setLocationBottomSheet(true)}
				setShowFilter={() => setShowFilter(true)}
			/>
			<SearchTabs activeIndex={currentPage} onTabChange={onTabChange} />

			<PagerView
				initialPage={0}
				style={StyleSheet.absoluteFill}
				ref={pagerRef}
				scrollEnabled={false}
				onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}>
				{TABS.map((tab, index) => {
					switch (tab) {
						case 'Map View':
							return (
								<View style={{ flex: 1 }} key={index}>
									<SearchMapView
										key={index}
										height={totalHeight}
										properties={properties}
									/>
								</View>
							);
						case 'List View':
							return (
								<View style={{ flex: 1 }} key={index}>
									<SafeAreaView
										style={{ flex: 1, backgroundColor: 'transparent' }}
										edges={['top']}>
										<SearchListView
											key={index}
											headerOnlyHeight={60}
											isLoading={isLoading || isFetchingNextPage}
											refetch={refetch}
											hasNextPage={hasNextPage}
											fetchNextPage={fetchNextPage}
											properties={properties}
										/>
									</SafeAreaView>
								</View>
							);
						default:
							return null;
					}
				})}
			</PagerView>

			<SearchLocationBottomSheet
				show={locationBottomSheet}
				onDismiss={() => setLocationBottomSheet(false)}
				onUpdate={setFilter}
			/>

			<SearchFilterBottomSheet
				show={showFilter}
				onDismiss={() => setShowFilter(false)}
				filter={filter}
				onApply={() => {}}
			/>
		</Box>
	);
}
