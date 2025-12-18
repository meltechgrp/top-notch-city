import React, { useMemo, useCallback } from "react";
import { View } from "react-native";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import VerticalPropertyLoaderWrapper from "@/components/loaders/VerticalPropertyLoader";
import PropertyListItem from "@/components/property/PropertyListItem";
import { router } from "expo-router";
import { EmptyState } from "@/components/property/EmptyPropertyCard";
import { House } from "lucide-react-native";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";

type IProps = {
  profileId: string;
  showStatus?: boolean;
  isOwner?: boolean;
  isAgent?: boolean;
};

export default function PropertiesTabView({
  profileId,
  showStatus = false,
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
  if (!isLoading && list.length === 0) {
    const propertyLabel = "Properties";

    if (isOwner && isAgent) {
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
          onPress={() => router.push(`/forms/agent`)}
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
    <SectionHeaderWithRef
      title="Properties"
      titleClassName="text-gray-400 text-base"
      subTitle="See All"
      className="px-0 bg-background-muted rounded-xl -mx-4 pb-5"
      hasData={isLoading || list?.length > 0}
      onSeeAllPress={() => {
        router.push({
          pathname: "/agents/[userId]/properties",
          params: {
            userId: profileId,
          },
        });
      }}
    >
      <HorizontalProperties
        data={list}
        isLoading={isLoading}
        className="w-[19rem] bg-background"
        contentContainerClassName={"px-3"}
        imageStyle={{ height: 130 }}
        isRefetching={false}
        snapToInterval={180}
        showTitle={false}
        showLike={false}
        showStatus={showStatus}
        subClassName="pb-1"
      />
    </SectionHeaderWithRef>
  );
}
