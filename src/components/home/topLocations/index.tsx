import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { toUiProperties } from "@/lib/propertyAdapter";
import { useInfinityQueries } from "@/tanstack/queries/useInfinityQueries";
import { useMemo } from "react";

const NearbyProperties = ({
  latitude = 3.4,
  longitude = 4.1,
}: {
  latitude: number;
  longitude: number;
}) => {
  const filter = useMemo(
    () => ({
      latitude,
      longitude,
    }),
    [latitude, longitude],
  );
  const { data, isLoading, isRefetching } = useInfinityQueries({
    type: "search",
    filter,
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
      title="Nearby"
      titleClassName="text-gray-400 text-base"
      subTitle="Explore"
      className=""
      hasData={properties.length > 0}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            latitude: latitude,
            longitude: longitude,
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
};

export default NearbyProperties;
