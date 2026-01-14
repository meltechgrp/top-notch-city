import SearchHeader from "@/components/search/Searchheader";
import { Box, View } from "@/components/ui";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import SearchMapView from "@/components/search/SearchMapView";
import SearchLocationBottomSheet from "@/components/modals/search/SearchLocationBottomSheet";
import SearchFilterBottomSheet from "@/components/modals/search/SearchFilterBottomSheet";
import { router, useFocusEffect, useGlobalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSearch } from "@/hooks/useSearch";
import PagerView from "react-native-pager-view";
import SearchListView from "@/components/search/SearchListView";
import SearchTabs from "@/components/search/SearchTabs";

interface SearchWrapperProps {
  disableBack?: boolean;
  isTab?: boolean;
}

const TABS = ["Map View", "List View"];

export default function SearchWrapper({
  disableBack = false,
  isTab = false,
}: SearchWrapperProps) {
  const { latitude, longitude, reset, category, locate } =
    useGlobalSearchParams() as {
      latitude: string;
      longitude: string;
      reset: string;
      category: string;
      locate: string;
    };
  const { search, results, query, properties } = useSearch();
  const { height: totalHeight } = Dimensions.get("screen");
  const [showFilter, setShowFilter] = useState(false);
  const pagerRef = useRef<PagerView>(null);
  const [locationBottomSheet, setLocationBottomSheet] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const onTabChange = React.useCallback((index: number) => {
    setCurrentPage(index);
    pagerRef.current?.setPage(index);
  }, []);

  useFocusEffect(
    useCallback(() => {
      onTabChange(0);
    }, [])
  );
  useEffect(() => {
    if (latitude && longitude) {
      search.setFilters({
        latitude: Number(latitude),
        longitude: Number(longitude),
      });
      query.refetchAndApply();
    } else if (locate) {
      setLocationBottomSheet(true);
    } else if (category) {
      search.setFilters({
        category: category,
      });
      query.refetchAndApply();
    }
    router.setParams({
      latitude: undefined,
      longitude: undefined,
      reset: undefined,
      category: undefined,
      locate: undefined,
    });
  }, [latitude, longitude, reset, category, locate]);
  return (
    <>
      <View className="flex-1 bg-background">
        <Box className="flex-1 relative">
          <SearchHeader
            filter={search.filter}
            setLocationBottomSheet={() => setLocationBottomSheet(true)}
            setShowFilter={() => setShowFilter(true)}
            disableBack={disableBack}
          />
          <SearchTabs
            total={results.available}
            isLocation={search.isLocation}
            useMyLocation={search.useMyLocation}
            activeIndex={currentPage}
            onTabChange={onTabChange}
            loading={query.loading}
          />

          <View style={StyleSheet.absoluteFill}>
            <SearchMapView
              properties={properties}
              height={totalHeight}
              filters={search.filter}
            />
          </View>
          <PagerView
            initialPage={0}
            style={StyleSheet.absoluteFill}
            ref={pagerRef}
            scrollEnabled={false}
            onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
          >
            {TABS.map((tab, index) => {
              switch (tab) {
                case "Map View":
                  return (
                    <View style={{ flex: 1 }} key={index}>
                      <SearchMapView
                        key={index}
                        height={totalHeight}
                        properties={properties}
                        filters={search.filter}
                      />
                    </View>
                  );
                case "List View":
                  return (
                    <View style={{ flex: 1 }} key={index}>
                      <SafeAreaView
                        style={{ flex: 1, backgroundColor: "transparent" }}
                        edges={["top"]}
                      >
                        <SearchListView
                          key={index}
                          setShowFilter={() => setShowFilter(true)}
                          headerOnlyHeight={50}
                          isLoading={query.loading}
                          refetch={query.refetchAndApply}
                          hasNextPage={query.hasNextPage}
                          fetchNextPage={query.fetchNextPage}
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
        </Box>
      </View>
      <SearchLocationBottomSheet
        show={locationBottomSheet}
        filter={search.filter}
        onDismiss={() => setLocationBottomSheet(false)}
        onUpdate={search.setFilters}
        refetchAndApply={query.refetchAndApply as any}
      />
      <SearchFilterBottomSheet
        show={showFilter}
        onDismiss={() => setShowFilter(false)}
        onApply={query.applyCachedResults as any}
        onReset={search.resetSome as any}
        onUpdate={search.setFilters}
        loading={query.loading}
        filter={search.filter}
        total={results.total}
        showPurpose
      />
    </>
  );
}
