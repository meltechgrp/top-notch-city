import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { withObservables } from "@nozbe/watermelondb/react";
import { database } from "@/db";
import { Q } from "@nozbe/watermelondb";

const Lands = ({ properties }: any) => {
  return (
    <SectionHeaderWithRef
      title="Lands"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={properties && properties?.length > 0}
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
        isLoading={false}
        isRefetching={false}
        listType={["trending-lands"]}
      />
    </SectionHeaderWithRef>
  );
};

const enhance = withObservables([], () => ({
  properties: database
    .get("properties")
    .query(
      Q.where("status", "approved"),
      Q.where("category", "Land"),
      Q.sortBy("updated_at", Q.desc),
      Q.take(10)
    ),
}));

export default enhance(Lands);
