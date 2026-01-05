import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { featured } from "@/store/homeFeed";
import { router } from "expo-router";

function FeaturedProperties() {
  const properties = featured.get();
  return (
    <SectionHeaderWithRef
      title="Featured"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={properties && properties?.length > 0}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            featured: "true",
          },
        });
      }}
    >
      <HorizontalProperties
        data={properties}
        isLoading={false}
        isRefetching={false}
        isFeatured
      />
    </SectionHeaderWithRef>
  );
}

export default FeaturedProperties;
