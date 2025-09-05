import { Box } from "@/components/ui";
import { usePropertyStore } from "@/store/propertyStore";
import { useLayout } from "@react-native-community/hooks";
import { useMemo } from "react";
import PropertyCarousel from "@/components/property/PropertyCarousel";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Images() {
  const { getImages } = usePropertyStore();
  const { width, onLayout } = useLayout();
  const images = useMemo(() => getImages(), [getImages]);
  return (
    <>
      <Box onLayout={onLayout} className="flex-1">
        <SafeAreaView
          edges={["bottom"]}
          className="flex-1 justify-center items-center"
        >
          <PropertyCarousel
            width={width || 400}
            factor={1.5}
            media={images}
            withPagination
            stackMode={false}
            selectedIndex={0}
            showImages
          />
        </SafeAreaView>
      </Box>
    </>
  );
}
