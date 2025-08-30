import { SearchHeader } from "@/components/search/Searchheader";
import { Box, View } from "@/components/ui";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import SearchTabs from "@/components/search/SearchTabs";
import PagerView from "react-native-pager-view";
import { SearchMapView } from "@/components/search/SearchMapView";
import SearchListView from "@/components/search/SearchListView";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchLocationBottomSheet from "@/components/modals/search/SearchLocationBottomSheet";
import SearchFilterBottomSheet from "@/components/modals/search/SearchFilterBottomSheet";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { VoiceModal } from "@/components/modals/search/VoiceModal";
import { useFilteredProperties } from "@/hooks/useFilteredProperties";
import useGetLocation from "@/hooks/useGetLocation";
import { useRefreshOnFocus } from "@/hooks/useRefreshOnFocus";
import { useStore } from "@/store";

const TABS = ["Map View", "List View"];

export default function SearchScreen() {
  const { height: totalHeight } = Dimensions.get("screen");
  const [showFilter, setShowFilter] = useState(false);
  const { location } = useStore();
  const [activateVoice, setActivateVoice] = useState(false);
  const [audioProperties, setAudioProperties] = useState<Property[]>([]);
  const [locationBottomSheet, setLocationBottomSheet] = useState(false);
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState<SearchFilters>({});
  const [search, setSearch] = useState<SearchFilters>({
    use_geo_location: "true",
  });
  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinityQueries({
    type: "search",
    filter: {
      ...search,
      ...(!search.state || !search.city
        ? {
            latitude: location?.latitude?.toString(),
            longitude: location?.longitude?.toString(),
          }
        : {}),
    },
    enabled: true,
  });

  useEffect(() => {
    refetch();
    setFilter({});
  }, [search]);

  const onTabChange = React.useCallback((index: number) => {
    setCurrentPage(index);
    pagerRef.current?.setPage(index);
  }, []);

  const properties = useMemo(() => {
    if (audioProperties?.length) {
      return audioProperties;
    }
    return data?.pages.flatMap((page) => page.results) || [];
  }, [data, audioProperties]);

  const filtered = useFilteredProperties(properties, filter);
  return (
    <Box className="flex-1 relative">
      <SearchHeader
        filter={filter}
        setLocationBottomSheet={() => setLocationBottomSheet(true)}
        setShowFilter={() => setShowFilter(true)}
        setActivateVoice={() => setActivateVoice(true)}
        onApply={setFilter}
        properies={properties}
        activeIndex={currentPage}
      />
      <SearchTabs activeIndex={currentPage} onTabChange={onTabChange} />

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
                    properties={filtered}
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
                      headerOnlyHeight={60}
                      isLoading={isLoading || isFetchingNextPage}
                      refetch={refetch}
                      hasNextPage={hasNextPage}
                      fetchNextPage={fetchNextPage}
                      properties={filtered}
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
        onUpdate={setSearch}
      />
      <VoiceModal
        visible={activateVoice}
        onClose={() => setActivateVoice(false)}
        onUpload={setAudioProperties}
      />
      <SearchFilterBottomSheet
        show={showFilter}
        onDismiss={() => setShowFilter(false)}
        onApply={setFilter}
        filter={filter}
        properies={properties}
        showPurpose
      />
    </Box>
  );
}
