import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { database } from "@/db";
import { Q } from "@nozbe/watermelondb";
import { withObservables } from "@nozbe/watermelondb/react";
import { router } from "expo-router";

function ApartmentsProperties({ properties }: any) {
  return (
    <SectionHeaderWithRef
      title="Properties"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={properties && properties?.length > 0}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            category: "Residential",
          },
        });
      }}
    >
      <HorizontalProperties
        data={properties}
        isLoading={false}
        isRefetching={false}
      />
    </SectionHeaderWithRef>
  );
}

const enhance = withObservables([], () => ({
  properties: database
    .get("properties")
    .query(
      Q.where("status", "approved"),
      Q.or(
        Q.where("category", "Residential"),
        Q.where("category", "Commercial")
      ),
      Q.sortBy("updated_at", Q.desc),
      Q.take(10)
    ),
}));

export default enhance(ApartmentsProperties);
