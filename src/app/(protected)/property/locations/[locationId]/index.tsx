import { Box, Icon, Pressable, View } from "@/components/ui";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { ListFilter } from "lucide-react-native";
import VerticalProperties from "@/components/property/VerticalProperties";
import { useProductQueries } from "@/tanstack/queries/useProductQueries";
import SearchFilterBottomSheet from "@/components/modals/search/SearchFilterBottomSheet";

export default function PropertyLocations() {
  const { locationId } = useLocalSearchParams() as { locationId?: string };
  const [showFilter, setShowFilter] = useState(false);
  const { data, isLoading, fetchNextPage, refetch } = useProductQueries({
    type: "state",
    state: locationId,
  });

  const propertysData = useMemo(() => {
    return data?.pages.flatMap((page) => page.results) ?? [];
  }, [data]);

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
            data={propertysData}
            isLoading={isLoading}
            refetch={refetch}
          />
        </View>
      </Box>

      <SearchFilterBottomSheet
        show={showFilter}
        onDismiss={() => setShowFilter(false)}
        onApply={() => {}}
        filter={{}}
      />
    </>
  );
}
