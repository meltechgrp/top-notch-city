import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { withObservables } from "@nozbe/watermelondb/react";
import { database } from "@/db";
import { Q } from "@nozbe/watermelondb";

const NearbyProperties = ({
  properties,
  location,
}: {
  properties: any;
  location?: Address;
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
            latitude: location?.latitude,
            longitude: location?.longitude,
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

const enhance = withObservables(["state"], ({ state }) => ({
  properties: database
    .get("properties")
    .query(
      Q.where("status", "approved"),
      Q.where("state", state),
      Q.sortBy("updated_at", Q.desc),
      Q.take(10)
    ),
}));

export default enhance(NearbyProperties);
