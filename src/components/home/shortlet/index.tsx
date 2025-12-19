import SectionHeaderWithRef from "@/components/home/SectionHeaderWithRef";
import HorizontalProperties from "@/components/property/HorizontalProperties";
import { useHomeList } from "@/hooks/useHomeList";
import { router } from "expo-router";
import { memo } from "react";

function ShortletProperties() {
  const { shortlet } = useHomeList();
  return (
    <SectionHeaderWithRef
      title="Shortlet/Hotels"
      titleClassName="text-gray-400 text-base"
      subTitle="See More"
      hasData={shortlet?.length > 0}
      onSeeAllPress={() => {
        router.push({
          pathname: "/explore",
          params: {
            list: "true",
          },
        });
      }}
    >
      <HorizontalProperties
        data={shortlet}
        isLoading={false}
        listType={["shortlet"]}
        isRefetching={false}
      />
    </SectionHeaderWithRef>
  );
}

export default memo(ShortletProperties);
