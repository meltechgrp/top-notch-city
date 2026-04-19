import FilterComponent from "@/components/admin/shared/FilterComponent";
import VerticalPropertyLoaderWrapper from "@/components/loaders/VerticalPropertyLoader";
import { EmptyState } from "@/components/property/EmptyPropertyCard";
import PropertyListItem from "@/components/property/PropertyListItem";
import { Box, View } from "@/components/ui";
import { transformServerProperty } from "@/db/normalizers/property";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { House } from "lucide-react-native";
import { useMemo, useState } from "react";
import { RefreshControl } from "react-native";

export default function FeaturedProperties() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search, 400);
  const {
    data,
    refetch,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isRefetching,
    isFetchingNextPage,
  } = useInfinityQueries({
    type: "featured",
    perPage: 10,
  });

  const properties = useMemo(() => {
    const featuredProperties = transformServerProperty(
      data?.pages.flatMap((page) => page.results) ?? [],
    );
    const query = debouncedSearch.trim().toLowerCase();

    if (!query) {
      return featuredProperties;
    }

    return featuredProperties.filter((property) =>
      [
        property.title,
        property.category,
        property.subcategory,
        property.address,
      ].some((value) => value?.toLowerCase().includes(query)),
    );
  }, [data, debouncedSearch]);

  return (
    <Box className="flex-1 px-2 pt-2">
      <FilterComponent
        search={search}
        onSearch={setSearch}
        filter={debouncedSearch}
        showTabs={false}
        searchPlaceholder="Search by location or category"
      />
      <View className="flex-1">
        <VerticalPropertyLoaderWrapper className="pb-40" loading={isLoading}>
          <FlashList
            data={properties}
            renderItem={({ item }) => (
              <PropertyListItem
                onPress={(property) =>
                  router.push({
                    pathname: "/property/[propertyId]",
                    params: {
                      propertyId: property.slug,
                    },
                  })
                }
                isList
                showLike={false}
                isFeatured
                property={item}
                rounded
              />
            )}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className="h-5" />}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={() => {
                  void refetch();
                }}
              />
            }
            onEndReached={() => {
              if (!hasNextPage || isFetchingNextPage) return;
              void fetchNextPage();
            }}
            onEndReachedThreshold={0.2}
            ListEmptyComponent={() => (
              <EmptyState
                icon={House}
                title="No Featured Properties"
                description="Featured properties will appear here once they are available."
                buttonLabel="Try again"
                onPress={() => {
                  void refetch();
                }}
              />
            )}
            contentContainerClassName="pb-40"
            removeClippedSubviews={false}
          />
        </VerticalPropertyLoaderWrapper>
      </View>
    </Box>
  );
}
