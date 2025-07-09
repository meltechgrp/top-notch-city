import { Box, Icon, Pressable, View } from "@/components/ui";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { ListFilter } from "lucide-react-native";
import VerticalProperties from "@/components/property/VerticalProperties";
import { useProductQueries } from "@/tanstack/queries/useProductQueries";
import SearchFilterBottomSheet from "@/components/modals/search/SearchFilterBottomSheet";
import { useFilteredProperties } from "@/hooks/useFilteredProperties";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PropertySections() {
  const { title } = useLocalSearchParams() as { title?: string };
  const [showFilter, setShowFilter] = useState(false);
  const { data, isLoading, fetchNextPage, refetch } = useProductQueries({
    type: "all",
  });
  const [filter, setFilter] = useState<SearchFilters>({});

  const properties = useMemo(
    () => data?.pages.flatMap((page) => page?.results) || [],
    [data]
  );

  const filtered = useFilteredProperties(properties, filter);
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: title ?? "Properties",
          headerRight: () => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Pressable
                both
                onPress={() => {
                  setShowFilter(true);
                }}
                style={{ padding: 8 }}
              >
                <Icon
                  size="xl"
                  as={ListFilter}
                  className={showFilter ? "text-primary" : "text-typography"}
                />
              </Pressable>
            </View>
          ),
        }}
      />
      <Box className="flex-1 px-4">
        <SafeAreaView edges={["bottom"]} className="flex-1">
          <VerticalProperties
            data={filtered}
            isLoading={isLoading}
            className="pb-20 pt-4"
            refetch={refetch}
            fetchNextPage={fetchNextPage}
          />
        </SafeAreaView>
      </Box>
      <SearchFilterBottomSheet
        show={showFilter}
        onDismiss={() => setShowFilter(false)}
        onApply={setFilter}
        filter={filter}
        properies={properties}
      />
    </>
  );
}
