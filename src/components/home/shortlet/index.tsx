import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { router } from "expo-router";
import { shortlets } from "@/store/homeFeed";

function ShortletProperties() {
  const properties = shortlets.get();
  return (
    <SectionHeaderWithRef
      title="Shortlets/Hotels"
      titleClassName=" text-base"
      subTitle="See More"
      hasData={!!properties?.length}
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

export default ShortletProperties;
