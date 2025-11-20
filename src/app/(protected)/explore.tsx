import SearchHeader from "@/components/search/Searchheader";
import { Box, View } from "@/components/ui";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import SearchTabs from "@/components/search/SearchTabs";
import PagerView from "react-native-pager-view";
import SearchMapView from "@/components/search/SearchMapView";
import SearchListView from "@/components/search/SearchListView";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchLocationBottomSheet from "@/components/modals/search/SearchLocationBottomSheet";
import SearchFilterBottomSheet from "@/components/modals/search/SearchFilterBottomSheet";
import { RoomsFilterSheet } from "@/components/modals/search/RoomsFilterBottomSheet";
import { PriceFilterSheet } from "@/components/modals/search/PriceFilterBottomSheet";
import { useSearch } from "@/hooks/useSearch";
import PropertyTypeSheet from "@/components/modals/search/PropertyTypeSheet";
import { router, useFocusEffect, useGlobalSearchParams } from "expo-router";

const TABS = ["Map View", "List View"];

export default function SearchScreen() {
  const { latitude, longitude, reset, list, locate } =
    useGlobalSearchParams() as {
      latitude: string;
      longitude: string;
      reset: string;
      list: string;
      locate: string;
    };
  const { height: totalHeight } = Dimensions.get("screen");
  const [showFilter, setShowFilter] = useState(false);
  const { search, results, query, properties } = useSearch();
  const [activateVoice, setActivateVoice] = useState(false);
  const [roomfilter, setRoomsFilter] = useState(false);
  const [typefilter, setTypesFilter] = useState(false);
  const [priceFilter, setPriceFilter] = useState(false);
  const [locationBottomSheet, setLocationBottomSheet] = useState(false);
  const pagerRef = useRef<PagerView>(null);
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
        latitude: latitude,
        longitude: longitude,
      });
      query.refetchAndApply();
    }
    if (list) {
      onTabChange(1);
    }
    if (locate) {
      setLocationBottomSheet(true);
    }
    router.setParams({
      latitude: undefined,
      longitude: undefined,
      reset: undefined,
      list: undefined,
      locate: undefined,
    });
  }, [latitude, longitude, reset, list, locate]);
  return (
    <>
      <View className="flex-1 bg-background">
        <Box className="flex-1 relative">
          <SearchHeader
            filter={search.filter}
            setLocationBottomSheet={() => setLocationBottomSheet(true)}
            setShowFilter={() => setShowFilter(true)}
            setActivateVoice={() => setActivateVoice(true)}
            setRoomsFilter={() => setRoomsFilter(true)}
            setPriceFilter={() => setPriceFilter(true)}
            setTypesFilter={() => setTypesFilter(true)}
            onUpdate={search.setFilters}
            refetchAndApply={query.refetchAndApply}
          />

          <SearchTabs
            total={results.available}
            isLocation={search.isLocation}
            useMyLocation={search.useMyLocation}
            activeIndex={currentPage}
            onTabChange={onTabChange}
            loading={query.loading}
          />
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
                        latitude={
                          search.filter?.latitude
                            ? Number(search.filter.latitude)
                            : undefined
                        }
                        longitude={
                          search.filter?.longitude
                            ? Number(search.filter.longitude)
                            : undefined
                        }
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
                          headerOnlyHeight={110}
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
        onDismiss={() => setLocationBottomSheet(false)}
        onUpdate={search.setFilters}
        refetchAndApply={query.refetchAndApply}
      />
      {/* <VoiceModal
        visible={activateVoice}
        onClose={() => setActivateVoice(false)}
        onUpload={()=> {}}
      /> */}
      <SearchFilterBottomSheet
        show={showFilter}
        onDismiss={() => setShowFilter(false)}
        onApply={query.applyCachedResults}
        onReset={search.resetSome}
        onUpdate={search.setFilters}
        loading={query.loading}
        filter={search.filter}
        total={results.total}
        showPurpose
      />
      <RoomsFilterSheet
        visible={roomfilter}
        total={results.total}
        onDismiss={() => setRoomsFilter(false)}
        search={search.filter}
        loading={query.loading}
        onUpdate={search.setFilters}
        onApply={query.applyCachedResults}
        onReset={search.resetSome}
      />
      <PriceFilterSheet
        visible={priceFilter}
        total={results.total}
        onDismiss={() => setPriceFilter(false)}
        search={search.filter}
        onReset={search.resetSome}
        onUpdate={search.setFilters}
        loading={query.loading}
        onApply={query.applyCachedResults}
      />
      <PropertyTypeSheet
        visible={typefilter}
        total={results.total}
        loading={query.loading}
        onDismiss={() => setTypesFilter(false)}
        search={search.filter}
        onUpdate={search.setFilters}
        onApply={query.applyCachedResults}
        onReset={search.resetSome}
      />
    </>
  );
}
