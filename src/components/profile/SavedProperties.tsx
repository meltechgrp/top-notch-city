import React, { useMemo, useCallback } from "react";
import { View } from "react-native";
import VerticalPropertyLoaderWrapper from "@/components/loaders/VerticalPropertyLoader";
import PropertyListItem from "@/components/property/PropertyListItem";
import { router } from "expo-router";
import { EmptyState } from "@/components/property/EmptyPropertyCard";
import { House } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchWishlist } from "@/actions/property";
import { deduplicate } from "@/lib/utils";

type IProps = {
  showStatus?: boolean;
};

export default function SavedPropertiesTabView({ showStatus = false }: IProps) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
  });
  const list = useMemo(() => data || [], [data]);
  const handlePress = useCallback((property: { slug: string }) => {
    router.push({
      pathname: `/property/[propertyId]`,
      params: { propertyId: property.slug },
    });
  }, []);

  if (!isLoading && list.length === 0) {
    return (
      <EmptyState
        icon={House}
        title="No Saved Properties"
        description="New properties will appear here soon."
        className="px-4"
        buttonLabel="Explore Properties"
        onPress={() => router.push("/explore")}
      />
    );
  }

  return (
    <VerticalPropertyLoaderWrapper className="flex-1" loading={isLoading}>
      <View className="gap-4 px-4">
        {deduplicate(list, "id").map((property) => (
          <PropertyListItem
            key={property.id}
            onPress={() => handlePress(property)}
            isList
            showStatus={showStatus}
            data={property}
            rounded
          />
        ))}
      </View>
    </VerticalPropertyLoaderWrapper>
  );
}
