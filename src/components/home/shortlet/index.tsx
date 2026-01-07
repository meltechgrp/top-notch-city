import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { router } from "expo-router";
import { withObservables } from "@nozbe/watermelondb/react";
import { Q } from "@nozbe/watermelondb";
import { propertiesCollection } from "@/db/collections";
import { Property } from "@/db/models/properties";

function ShortletProperties({ properties }: { properties: Property[] }) {
  return (
    <SectionHeaderWithRef
      title="Shortlets/Hotels"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={properties && properties?.length > 0}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            category: "Shortlet",
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
  properties: propertiesCollection.query(
    Q.where("status", "approved"),
    Q.or(Q.where("category", "Hotel"), Q.where("category", "Shortlet")),
    Q.sortBy("updated_at", Q.desc),
    Q.take(10)
  ),
}));

export default enhance(ShortletProperties);
