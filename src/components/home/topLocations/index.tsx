import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import { router } from "expo-router";
import TopLocationsHorizontalList from "./TopLocationHozontalList";
import { memo } from "react";

const TopLocations = () => {
  return (
    <SectionHeaderWithRef
      title="Trending Locations"
      titleClassName="text-gray-400 text-base"
      subTitle="Explore"
      className=""
      hasData
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
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
