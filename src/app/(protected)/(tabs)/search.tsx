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
import { useProductQueries } from "@/tanstack/queries/useProductQueries";
import { router, useLocalSearchParams } from "expo-router";
import { VoiceModal } from "@/components/modals/search/VoiceModal";
import { deduplicate } from "@/lib/utils";

const TABS = ["Map View", "List View"];

export default function SearchScreen() {
  const { search, propertyId } = useLocalSearchParams() as {
    search?: string;
    propertyId?: string;
  };
  const { height: totalHeight } = Dimensions.get("screen");
  const [showFilter, setShowFilter] = useState(false);
  const [activateVoice, setActivateVoice] = useState(false);
  const [audioProperties, setAudioProperties] = useState<Property[]>([]);
  const [locationBottomSheet, setLocationBottomSheet] = useState(false);
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filter, setFilter] = useState<SearchFilters>({
    use_geo_location: "true",
  });
  const {
    data,
    refetch,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProductQueries({ type: "search", filter, enabled: false });

  useEffect(() => {
    refetch();
  }, [filter]);
  useEffect(() => {
    if (search) {
      setLocationBottomSheet(true);
      router.setParams({});
    }
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
  return (
    <Box className="flex-1 relative">
      <SearchHeader
        filter={filter}
        setLocationBottomSheet={() => setLocationBottomSheet(true)}
        setShowFilter={() => setShowFilter(true)}
        setActivateVoice={() => setActivateVoice(true)}
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
                    properties={properties}
                    propertyId={propertyId}
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
      />
    </Box>
  );
}
