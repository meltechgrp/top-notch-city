import { Box, Icon, Pressable, View } from "@/components/ui";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import { ListFilter } from "lucide-react-native";
import VerticalProperties from "@/components/property/VerticalProperties";
import { useProductQueries } from "@/tanstack/queries/useProductQueries";
import SearchFilterBottomSheet from "@/components/modals/search/SearchFilterBottomSheet";

export default function PropertySections() {
  const { title } = useLocalSearchParams() as { title?: string };
  const [showFilter, setShowFilter] = useState(false);
  const { data, isLoading, fetchNextPage, refetch } = useProductQueries({
    type: "all",
  });

  const properties = useMemo(
    () => data?.pages.flatMap((page) => page?.results) || [],
    [data]
  );
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
        <VerticalProperties
          data={properties}
          isLoading={isLoading}
          className="pb-20"
          refetch={refetch}
          fetchNextPage={fetchNextPage}
        />
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
