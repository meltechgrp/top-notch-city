import { hapticFeed } from "@/components/HapticTab";
import PropertyMedia from "@/components/property/PropertyMedia";
import { PropertyModalMediaViewer } from "@/components/modals/property/PropertyModalMediaViewer";
import { Box, View } from "@/components/ui";
import { usePropertyStore } from "@/store/propertyStore";
import { useLayout } from "@react-native-community/hooks";
import { FlashList } from "@shopify/flash-list";
import { useState } from "react";

export default function Images() {
  const { getVideos } = usePropertyStore();
  const { width, onLayout } = useLayout();
  const videos = getVideos();

  const [visible, setVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleOpen = (index: number) => {
    hapticFeed(true);
    setSelectedIndex(index);
    setVisible(true);
  };
  return (
    <>
      <Box onLayout={onLayout} className="flex-1 px-4">
        <FlashList
          data={videos}
          contentContainerClassName="py-4"
          renderItem={({ item, index }) => (
            <PropertyMedia
              style={{ flex: 1, height: 250 }}
              rounded
              className={" bg-background-muted"}
              source={item}
              canPlayVideo={false}
              nativeControls
              onPress={() => handleOpen(index)}
            />
          )}
          ListFooterComponent={() => <View className=" h-16" />}
          ItemSeparatorComponent={() => <View className="h-6" />}
          estimatedItemSize={230}
          keyExtractor={(item) => item.id}
        />
      </Box>
      <PropertyModalMediaViewer
        width={width}
        media={videos}
        visible={visible}
        stackMode={false}
        enabled={false}
        setVisible={setVisible}
        selectedIndex={selectedIndex}
      />
    </>
  );
}
