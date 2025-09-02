import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import TopLocationsHorizontalList from "./TopLocationHozontalList";
import { memo } from "react";

const TopLocations = () => {
  return (
    <SectionHeaderWithRef
      title="Top Locations"
      subTitle="Explore"
      className=""
      onSeeAllPress={() => {
        router.push({
          pathname: "/search",
          params: {
            locate: "true",
          },
        });
      }}
    >
      <TopLocationsHorizontalList />
    </SectionHeaderWithRef>
  );
};

export default memo(TopLocations);
