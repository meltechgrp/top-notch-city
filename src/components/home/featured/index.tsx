import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { useHomeFeed } from "@/hooks/useHomeFeed";
import { router } from "expo-router";
import { memo } from "react";

function FeaturedProperties() {
  const { featured, loadingFeatured, refetchingFeatured } = useHomeFeed();
  return (
    <SectionHeaderWithRef
      title="Featured"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={loadingFeatured || refetchingFeatured || featured?.length > 0}
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
        isLoading={loadingFeatured}
        listType={["featured"]}
        isFeatured
        isRefetching={refetchingFeatured}
      />
    </SectionHeaderWithRef>
  );
}

export default memo(FeaturedProperties);
