import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { getNearby } from "@/db/queries/property-list";
import { useLiveQuery } from "@/hooks/useLiveQuery";
import { mapPropertyList } from "@/lib/utils";
import { router } from "expo-router";
import { memo, useMemo } from "react";

interface SimilarPropertiesProps {
  property: Property;
}

function SimilarProperties({ property }: SimilarPropertiesProps) {
  const { data, isLoading } = useLiveQuery(
    () =>
      location
        ? getNearby({
            lat: property.address?.latitude,
            long: property.address?.longitude,
          })
        : Promise.resolve([]),
    [property.address?.latitude, property.address?.longitude]
  );

  const properties = useMemo(() => (data ? mapPropertyList(data) : []), [data]);
  return (
    <SectionHeaderWithRef
      title="Similar Properties"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={isLoading || properties?.length > 0}
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
        isRefetching={false}
      />
    </SectionHeaderWithRef>
  );
}

export default memo(SimilarProperties);
