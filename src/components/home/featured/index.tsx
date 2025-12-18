import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { router } from "expo-router";
import { memo } from "react";

function FeaturedProperties({ data = [] }: { data: PropertyListItem[] }) {
  return (
    <SectionHeaderWithRef
      title="Featured"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={data?.length > 0}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            list: "true",
          },
        });
      }}
    >
      <HorizontalProperties
        data={data}
        isLoading={false}
        listType={["featured"]}
        isFeatured
        isRefetching={false}
      />
    </SectionHeaderWithRef>
  );
}

export default memo(FeaturedProperties);
