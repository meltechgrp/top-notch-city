import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { database } from "@/db";
import { Property } from "@/db/models/properties";
import { Q } from "@nozbe/watermelondb";
import { withObservables } from "@nozbe/watermelondb/react";
import { router } from "expo-router";

interface SimilarPropertiesProps {
  property: Property;
  properties: any[];
}

function SimilarProperties({ property, properties }: SimilarPropertiesProps) {
  return (
    <SectionHeaderWithRef
      title="Similar Properties"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={properties && properties?.length > 0}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            latitude: property?.latitude.toString(),
            longitude: property?.longitude.toString(),
            category: property.category,
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

const enhance = withObservables(["property"], ({ property }) => ({
  properties: database
    .get("properties")
    .query(
      Q.where("status", "approved"),
      Q.where("category", property.category),
      Q.sortBy("updated_at", Q.desc),
      Q.take(10)
    ),
}));

export default enhance(SimilarProperties);
