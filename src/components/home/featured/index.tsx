import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { useHomeList } from "@/hooks/useHomeList";
import { router } from "expo-router";
import { memo } from "react";

function FeaturedProperties() {
  const { featured, isLoading } = useHomeList();
  return (
    <SectionHeaderWithRef
      title="Featured"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={isLoading || featured?.length > 0}
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
        data={featured}
        isLoading={isLoading}
        listType={["featured"]}
        isFeatured
        isRefetching={false}
      />
    </SectionHeaderWithRef>
  );
}

export default memo(FeaturedProperties);
