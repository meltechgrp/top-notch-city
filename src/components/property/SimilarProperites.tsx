import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { router } from "expo-router";
import { memo, useMemo } from "react";

interface SimilarPropertiesProps {
  property: Property;
}

function SimilarProperties({ property }: SimilarPropertiesProps) {
  const { data, isLoading, isFetching } = useInfinityQueries({
    type: "search",
    filter: {
      use_geo_location: "true",
      latitude: property.address?.latitude?.toString(),
      longitude: property.address?.longitude?.toString(),
      category: property.category?.name,
    },
  });

  const properties = useMemo(
    () => data?.pages.flatMap((r) => r.results) || [],
    [data]
  );
  return (
    <SectionHeaderWithRef
      title="Similar Properties"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={isLoading || isFetching || properties?.length > 0}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            latitude: property.address?.latitude.toString(),
            longitude: property.address?.longitude.toString(),
          },
        });
      }}
    >
      <HorizontalProperties
        data={properties}
        isLoading={isLoading}
        showLike={false}
        isRefetching={isFetching}
      />
    </SectionHeaderWithRef>
  );
}

export default memo(SimilarProperties);
