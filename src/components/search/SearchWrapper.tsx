import SearchHeader from "@/components/search/Searchheader";
import { Box, View } from "@/components/ui";
import React, { useEffect, useState, useDeferredValue } from "react";
import { Dimensions, StyleSheet } from "react-native";
import SearchMapView from "@/components/search/SearchMapView";
import SearchLocationBottomSheet from "@/components/modals/search/SearchLocationBottomSheet";
import SearchFilterBottomSheet from "@/components/modals/search/SearchFilterBottomSheet";
import { router, useGlobalSearchParams } from "expo-router";
import SearchListBottomSheet from "@/components/modals/search/SearchListView";
import { SafeAreaView } from "react-native-safe-area-context";
import { buildLocalQuery, searchStore } from "@/store/searchStore";
import { use$ } from "@legendapp/state/react";
import { database } from "@/db";
import { Q } from "@nozbe/watermelondb";

interface SearchWrapperProps {
  disableBack?: boolean;
  isTab?: boolean;
}

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
  const {
    total,
    loading,
    filter,
    updateFilter,
    resetFilter,
    useMyLocation,
    pagination,
    nextPage,
    search,
    saveFilter,
  } = use$(searchStore);
  const { height: totalHeight } = Dimensions.get("screen");
  const [showFilter, setShowFilter] = useState(false);
  const [locationBottomSheet, setLocationBottomSheet] = useState(false);
  const deferredText = useDeferredValue(filter);
  useEffect(() => {
    if (latitude && longitude) {
      updateFilter({
        latitude: Number(latitude),
        longitude: Number(longitude),
      });
    } else if (locate) {
      setLocationBottomSheet(true);
    } else if (category) {
      updateFilter({
        category: category,
      });
    } else {
      useMyLocation();
    }
    router.setParams({
      latitude: undefined,
      longitude: undefined,
      reset: undefined,
      category: undefined,
      locate: undefined,
    });
  }, [latitude, longitude, reset, category, locate]);
  useEffect(() => {
    const count = async () => {
      searchStore.loading.set(true);
      try {
        const count = await database
          .get("properties")
          .query(...buildLocalQuery(deferredText))
          .fetchCount();
        searchStore.total.set(count);
      } finally {
        searchStore.loading.set(false);
      }
    };
    count();
  }, [deferredText]);
  return (
    <>
      <View className="flex-1 bg-background">
        <SafeAreaView edges={["bottom"]} className="flex-1 bg-background">
          <Box className="flex-1 relative">
            <SearchHeader
              filter={filter}
              setLocationBottomSheet={() => setLocationBottomSheet(true)}
              setShowFilter={() => setShowFilter(true)}
              disableBack={disableBack}
            />

            <View style={StyleSheet.absoluteFill}>
              <SearchMapView height={totalHeight} filter={search} />
            </View>
          </Box>

          <SearchListBottomSheet
            setShowFilter={() => setShowFilter(true)}
            isLoading={loading}
            hasNextPage={false}
            total={total}
            onReset={resetFilter}
            filter={search}
            fetchNextPage={async () => nextPage()}
            pagination={pagination}
            useMyLocation={useMyLocation}
            isTab={isTab}
          />
        </SafeAreaView>
      </View>
      <SearchLocationBottomSheet
        show={locationBottomSheet}
        filter={filter}
        onDismiss={() => setLocationBottomSheet(false)}
        onUpdate={updateFilter}
      />
      <SearchFilterBottomSheet
        show={showFilter}
        onDismiss={() => {
          saveFilter();
          setShowFilter(false);
        }}
        onReset={resetFilter}
        onUpdate={updateFilter}
        loading={loading}
        filter={filter}
        total={total}
        showPurpose
      />
    </>
  );
}
