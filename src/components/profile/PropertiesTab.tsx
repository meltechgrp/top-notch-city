import React, { useMemo } from "react";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { router } from "expo-router";
import { EmptyState } from "@/components/property/EmptyPropertyCard";
import { House } from "lucide-react-native";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import { getAgentList } from "@/db/queries/property-list";
import { mapPropertyList } from "@/lib/utils";

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
  const { data, isLoading } =
    useLiveQuery(
      () =>
        getAgentList({
          agentId: profileId,
          isOwner: isOwner && isAgent,
          page: 1,
        }),
      [profileId, isOwner, isAgent]
    ) ?? [];

  const list = useMemo(() => mapPropertyList(data || []), [data]);
  if (!isLoading && list.length === 0) {
    const propertyLabel = "Properties";

    if (isOwner && isAgent) {
      return (
        <EmptyState
          icon={House}
          className="px-0"
          title={`You have no ${propertyLabel} listed yet`}
          description="Start listing properties to reach potential buyers and renters."
        />
      );
    }

    if (isOwner && !isAgent) {
      return (
        <EmptyState
          icon={House}
          className="px-0"
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
          className="px-0"
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
        className="px-0"
        title={`No ${propertyLabel} Found`}
        description="New properties will appear here soon."
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
