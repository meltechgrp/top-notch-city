import SearchHeader from "@/components/search/Searchheader";
import { Box, View } from "@/components/ui";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import SearchMapView from "@/components/search/SearchMapView";
import SearchLocationBottomSheet from "@/components/modals/search/SearchLocationBottomSheet";
import SearchFilterBottomSheet from "@/components/modals/search/SearchFilterBottomSheet";
import { useSearch } from "@/hooks/useSearch";
import { router, useGlobalSearchParams } from "expo-router";
import SearchListBottomSheet from "@/components/modals/search/SearchListView";
import { SafeAreaView } from "react-native-safe-area-context";

interface SearchWrapperProps {
  disableBack?: boolean;
  isTab?: boolean;
}

export default function SearchWrapper({
  disableBack = false,
  isTab = false,
}: SearchWrapperProps) {
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
  const [locationBottomSheet, setLocationBottomSheet] = useState(false);

  useEffect(() => {
    if (latitude && longitude) {
      search.setFilters({
        latitude: latitude,
        longitude: longitude,
      });
      query.refetchAndApply();
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
        <SafeAreaView edges={["bottom"]} className="flex-1 bg-background">
          <Box className="flex-1 relative">
            <SearchHeader
              filter={search.filter}
              setLocationBottomSheet={() => setLocationBottomSheet(true)}
              setShowFilter={() => setShowFilter(true)}
              disableBack={disableBack}
            />

            <View style={StyleSheet.absoluteFill}>
              <SearchMapView
                height={totalHeight}
                properties={properties}
                latitude={
                  search.filter?.latitude
                    ? Number(search.filter.latitude)
                    : undefined
                }
                onUpdate={search.setFilters}
                onApply={query.applyCachedResults}
                longitude={
                  search.filter?.longitude
                    ? Number(search.filter.longitude)
                    : undefined
                }
              />
            </View>
          </Box>

          <SearchListBottomSheet
            setShowFilter={() => setShowFilter(true)}
            isLoading={query.loading}
            refetch={query.refetchAndApply}
            hasNextPage={query.hasNextPage}
            filter={search.filter}
            fetchNextPage={query.fetchNextPage}
            properties={properties}
            useMyLocation={search.useMyLocation}
            total={results.available}
            isTab={isTab}
          />
        </SafeAreaView>
      </View>
      <SearchLocationBottomSheet
        show={locationBottomSheet}
        filter={search.filter}
        onDismiss={() => setLocationBottomSheet(false)}
        onUpdate={search.setFilters}
        refetchAndApply={query.refetchAndApply}
      />
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
    </>
  );
}
