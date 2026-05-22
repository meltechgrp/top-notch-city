import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { toUiProperties } from "@/lib/propertyAdapter";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { router } from "expo-router";
import { useMemo } from "react";

function ApartmentsProperties() {
  const { data, isLoading, isRefetching } = useInfinityQueries({
    type: "latest",
    perPage: 10,
  });
  const properties = useMemo(
    () =>
      toUiProperties(
        (data?.pages ?? []).flatMap((page) => page?.results ?? []),
      ).filter(
        (property) =>
          property.category === "Residential" ||
          property.category === "Commercial",
      ),
    [data],
  );

  return (
    <SectionHeaderWithRef
      title="Properties"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={properties.length > 0}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            category: "Residential",
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

export default ApartmentsProperties;
