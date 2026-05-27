import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { toUiProperties } from "@/lib/propertyAdapter";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { useMemo } from "react";

const Lands = () => {
  const { data, isLoading, isRefetching } = useInfinityQueries({
    type: "trending-lands",
    perPage: 10,
  });
  const properties = useMemo(
    () =>
      toUiProperties(
        (data?.pages ?? []).flatMap((page) => page?.results ?? []),
      ),
    [data],
  );

  return (
    <SectionHeaderWithRef
      title="Lands"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={properties.length > 0}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            category: "Land",
          },
        });
      }}
    >
      <HorizontalProperties
        data={properties}
        isLoading={isLoading}
        isRefetching={isRefetching}
        likeQueryKey={["trending-lands"]}
      />
    </SectionHeaderWithRef>
  );
};

export default Lands;
