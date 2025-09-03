import { Box } from "@/components/ui";
import { usePropertyStore } from "@/store/propertyStore";
import { useLayout } from "@react-native-community/hooks";
import { useMemo } from "react";
import PropertyCarousel from "@/components/property/PropertyCarousel";

export default function Images() {
  const { getImages } = usePropertyStore();
  const { width, onLayout } = useLayout();
  const images = useMemo(() => getImages(), [getImages]);
  return (
    <>
      <Box onLayout={onLayout} className="flex-1">
        <PropertyCarousel
          width={width || 400}
          fullScreen
          media={images}
          withPagination
          stackMode={false}
          selectedIndex={0}
        />
      </Box>
    </>
  );
}
