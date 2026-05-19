import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { toUiProperties } from "@/lib/propertyAdapter";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { router } from "expo-router";
import { useMemo } from "react";

function FeaturedProperties() {
  const { data, isLoading, isRefetching } = useInfinityQueries({
    type: "featured",
    perPage: 10,
  });
  const properties = useMemo(
    () => toUiProperties(data?.pages.flatMap((page) => page.results) ?? []),
    [data],
  );

  return (
    <SectionHeaderWithRef
      title="Featured"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={properties.length > 0}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            featured: "true",
          },
        });
      }}
    >
      <HorizontalProperties
        data={properties}
        isLoading={isLoading}
        isRefetching={isRefetching}
        isFeatured
      />
    </SectionHeaderWithRef>
  );
}

export default FeaturedProperties;
