import { hapticFeed } from "@/components/HapticTab";
import PropertyMedia from "@/components/property/PropertyMedia";
import { PropertyModalMediaViewer } from "@/components/modals/property/PropertyModalMediaViewer";
import { Box, View } from "@/components/ui";
import { usePropertyStore } from "@/store/propertyStore";
import { useLayout } from "@react-native-community/hooks";
import { FlashList } from "@shopify/flash-list";
import { useMemo, useState } from "react";

export default function Images() {
  const { getImages } = usePropertyStore();
  const { width, onLayout } = useLayout();
  const images = useMemo(() => getImages(), [getImages]);

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
          data={images}
          numColumns={2}
          renderItem={({ item, index }) => (
            <View
              style={{
                height: 180,
                flex: 1,
                marginRight: index % 2 == 0 ? 12 : 0,
              }}
            >
              <PropertyMedia
                rounded
                source={item}
                contentFit="fill"
                onPress={() => handleOpen(index)}
              />
            </View>
          )}
          contentContainerClassName="py-4"
          ListFooterComponent={() => <View className=" h-16" />}
          ItemSeparatorComponent={() => <View className="h-4" />}
          estimatedItemSize={230}
          keyExtractor={(item) => item.id}
        />
      </Box>
      <PropertyModalMediaViewer
        width={width}
        media={images}
        visible={visible}
        contentFit="fill"
        setVisible={setVisible}
        selectedIndex={selectedIndex}
      />
    </>
  );
}
