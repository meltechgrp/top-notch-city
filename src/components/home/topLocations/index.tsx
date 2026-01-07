import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { withObservables } from "@nozbe/watermelondb/react";
import { Q } from "@nozbe/watermelondb";
import { propertiesCollection } from "@/db/collections";
import { Property } from "@/db/models/properties";

const NearbyProperties = ({
  properties,
  latitude = 3.4,
  longitude = 4.1,
}: {
  properties: Property[];
  latitude: number;
  longitude: number;
}) => {
  return (
    <SectionHeaderWithRef
      title="Nearby"
      titleClassName="text-gray-400 text-base"
      subTitle="Explore"
      className=""
      hasData={location && properties && properties?.length > 0}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            latitude: latitude,
            longitude: longitude,
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
};

const enhance = withObservables(
  ["latitude", "longitude"],
  ({ latitude, longitude }) => ({
    properties: propertiesCollection.query(
      Q.where("status", "approved"),
      Q.or(
        Q.where("latitude", Q.gte(latitude)),
        Q.where("longitude", Q.gte(longitude))
      ),
      Q.sortBy("updated_at", Q.desc),
      Q.take(10)
    ),
  })
);

export default enhance(NearbyProperties);
