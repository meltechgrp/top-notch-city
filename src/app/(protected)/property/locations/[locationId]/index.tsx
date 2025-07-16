import { Box, Icon, Pressable, View } from "@/components/ui";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { ListFilter } from "lucide-react-native";
import VerticalProperties from "@/components/property/VerticalProperties";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import SearchFilterBottomSheet from "@/components/modals/search/SearchFilterBottomSheet";
import { useFilteredProperties } from "@/hooks/useFilteredProperties";

export default function PropertyLocations() {
  const { locationId } = useLocalSearchParams() as { locationId?: string };
  const [showFilter, setShowFilter] = useState(false);
  const [filter, setFilter] = useState<SearchFilters>({});
  const { data, isLoading, fetchNextPage, refetch } = useInfinityQueries({
    type: "state",
    state: locationId,
  });

  const propertysData = useMemo(() => {
    return data?.pages.flatMap((page) => page.results) ?? [];
  }, [data]);

  const filtered = useFilteredProperties(propertysData, filter);
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: locationId,
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
                  as={ListFilter}
                  size="xl"
                  className={showFilter ? "text-primary" : "text-typography"}
                />
              </Pressable>
            </View>
          ),
        }}
      />
      <Box className="flex-1 gap-4">
        <View className="px-4 flex-1">
          <VerticalProperties
            data={filtered}
            isLoading={isLoading}
            refetch={refetch}
            className="pt-4 pb-20"
          />
        </View>
      </Box>

      <SearchFilterBottomSheet
        show={showFilter}
        onDismiss={() => setShowFilter(false)}
        onApply={setFilter}
        filter={filter}
        properies={propertysData}
      />
    </>
  );
}
