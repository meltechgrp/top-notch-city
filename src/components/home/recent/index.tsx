import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { apartments } from "@/store/homeFeed";
import { router } from "expo-router";

function ApartmentsProperties() {
  const properties = apartments.get();
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

export default ApartmentsProperties;
