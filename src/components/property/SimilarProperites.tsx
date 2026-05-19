import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { toUiProperties, UiProperty } from "@/lib/propertyAdapter";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { router } from "expo-router";
import { useMemo } from "react";

interface SimilarPropertiesProps {
  property: UiProperty;
}

function SimilarProperties({ property }: SimilarPropertiesProps) {
  const filter = useMemo(
    () => ({
      category: property.category,
      latitude: property.latitude,
      longitude: property.longitude,
    }),
    [property.category, property.latitude, property.longitude],
  );
  const { data, isLoading, isRefetching } = useInfinityQueries({
    type: "search",
    filter,
    perPage: 10,
  });
  const properties = useMemo(
    () =>
      toUiProperties(data?.pages.flatMap((page) => page.results) ?? []).filter(
        (item) => item.id !== property.id,
      ),
    [data, property.id],
  );

  return (
    <SectionHeaderWithRef
      title="Similar Properties"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={properties.length > 0}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            latitude: property?.latitude?.toString(),
            longitude: property?.longitude?.toString(),
            category: property.category,
          },
        });
      }}
    >
      <HorizontalProperties
        data={properties}
        isLoading={isLoading}
        isRefetching={isRefetching}
      />
    </SectionHeaderWithRef>
  );
}

export default SimilarProperties;
