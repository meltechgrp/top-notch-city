import SearchHeader from "@/components/search/Searchheader";
import { Box, View } from "@/components/ui";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import SearchMapView from "@/components/search/SearchMapView";
import SearchLocationBottomSheet from "@/components/modals/search/SearchLocationBottomSheet";
import SearchFilterBottomSheet from "@/components/modals/search/SearchFilterBottomSheet";
import { router, useGlobalSearchParams } from "expo-router";
import SearchListBottomSheet from "@/components/modals/search/SearchListView";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSearch } from "@/hooks/useSearch";

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
  const { search, results, query, properties } = useSearch();
  const { height: totalHeight } = Dimensions.get("screen");
  const [showFilter, setShowFilter] = useState(false);
  const [locationBottomSheet, setLocationBottomSheet] = useState(false);
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
  }, [latitude, longitude, reset, category, locate, location]);
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
                properties={properties}
                height={totalHeight}
                filters={search.filter}
              />
            </View>
          </Box>

          <SearchListBottomSheet
            setShowFilter={() => setShowFilter(true)}
            isLoading={query.loading}
            refetch={query.refetchAndApply}
            hasNextPage={query.hasNextPage}
            filter={search.filter}
            fetchNextPage={query.fetchNextPage as any}
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
