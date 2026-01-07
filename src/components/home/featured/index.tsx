import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { database } from "@/db";
import { Q } from "@nozbe/watermelondb";
import { withObservables } from "@nozbe/watermelondb/react";
import { router } from "expo-router";

function FeaturedProperties({ properties }: any) {
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

const enhance = withObservables([], () => ({
  properties: database
    .get("properties")
    .query(
      Q.where("status", "approved"),
      Q.where("is_featured", true),
      Q.sortBy("updated_at", Q.desc),
      Q.take(10)
    ),
}));

export default enhance(FeaturedProperties);
