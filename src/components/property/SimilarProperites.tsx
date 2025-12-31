import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { router } from "expo-router";
import { memo } from "react";

interface SimilarPropertiesProps {
  property: Property;
}

function SimilarProperties({ property }: SimilarPropertiesProps) {
  return (
    <SectionHeaderWithRef
      title="Similar Properties"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={false}
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
        data={[]}
        isLoading={false}
        showLike={false}
        isRefetching={false}
      />
    </SectionHeaderWithRef>
  );
}

export default memo(SimilarProperties);
