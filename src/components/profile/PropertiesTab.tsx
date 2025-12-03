import React, { useMemo, useCallback } from "react";
import { View } from "react-native";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import VerticalPropertyLoaderWrapper from "@/components/loaders/VerticalPropertyLoader";
import PropertyListItem from "@/components/property/PropertyListItem";
import { router } from "expo-router";
import { EmptyState } from "@/components/property/EmptyPropertyCard";
import { House } from "lucide-react-native";

type IProps = {
  profileId: string;
  showStatus?: boolean;
  type?: "houses" | "lands";
  isOwner?: boolean;
  isAgent?: boolean;
};

export default function PropertiesTabView({
  profileId,
  showStatus = false,
  type = "houses",
  isOwner = false,
  isAgent = false,
}: IProps) {
  const { data, isLoading, refetch } = useInfinityQueries({
    type: isOwner && isAgent ? "agent-property" : "user",
    profileId,
  });

  const list = useMemo(
    () => (data?.pages ? data.pages.flatMap((page) => page.results) : []),
    [data]
  );
  const filtered = useMemo(() => {
    if (type == "lands") {
      return list.filter((p) => p.category.name == "Land");
    } else {
      return list;
    }
  }, [list, type]);
  const handlePress = useCallback((property: { slug: string }) => {
    router.push({
      pathname: `/property/[propertyId]`,
      params: { propertyId: property.slug },
    });
  }, []);

  if (!isLoading && filtered.length === 0) {
    const propertyLabel = type === "lands" ? "Landed Properties" : "Properties";

    if (isAgent) {
      return (
        <EmptyState
          icon={House}
          title={`You don't have any ${propertyLabel} listed yet`}
          description="Start listing properties to reach potential buyers and renters."
          buttonLabel="Add Property"
          onPress={() => router.push("/property/add")}
        />
      );
    }

    if (isOwner && !isAgent) {
      return (
        <EmptyState
          icon={House}
          title={`You don't have any ${propertyLabel} yet`}
          description="Become an agent to start listing your properties."
          buttonLabel="Become Agent"
          onPress={() => router.push(`/forms/${profileId}/agent`)}
        />
      );
    }

    if (!isOwner) {
      return (
        <EmptyState
          icon={House}
          title={`No ${propertyLabel} Found`}
          description="New listings will appear here soon."
          buttonLabel="Browse Listings"
          onPress={() => router.push("/explore")}
        />
      );
    }

    return (
      <EmptyState
        icon={House}
        title={`No ${propertyLabel} Found`}
        description="New properties will appear here soon."
        className="px-4"
        buttonLabel="Try again"
        onPress={() => refetch()}
      />
    );
  }
  return (
    <VerticalPropertyLoaderWrapper loading={isLoading}>
      <View className="gap-4 px-4">
        {filtered.map((property) => (
          <PropertyListItem
            key={property.id}
            onPress={() => handlePress(property)}
            isList
            showStatus={isOwner && isAgent}
            data={property}
            rounded
          />
        ))}
      </View>
    </VerticalPropertyLoaderWrapper>
  );
}
