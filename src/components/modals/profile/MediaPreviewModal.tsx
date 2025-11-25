import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import Carousel, { ICarouselInstance } from "react-native-reanimated-carousel";
import { View, Text, Icon } from "@/components/ui";
import { X, Trash2, Play, Music, Save } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

type Props = {
  open: boolean;
  onClose: () => void;
  data: Media[];
  onDelete: (id: string) => void;
  loading: boolean;
  progress: number;
  processFiles: (files: { url: string }[]) => void;
};

export function MediaPreviewModal({
  open,
  onClose,
  data,
  onDelete,
  loading,
  progress,
  processFiles,
}: Props) {
  const ref = useRef<ICarouselInstance>(null);
  const [index, setIndex] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  useEffect(() => {
    if (open && data && data.length < 1) {
      onClose();
    }
  }, [data, open]);

  if (!open) return null;

  const renderSlide = (item: Media) => {
    const src = item.url;

    switch (item.media_type) {
      case "IMAGE":
        return (
          <Image
            source={{ uri: src }}
            style={{ width, height }}
            resizeMode="cover"
          />
        );

      case "VIDEO":
        return (
          <View className="w-full h-full items-center justify-center bg-black/40">
            <Icon as={Play} size={80} color="white" />
            <Text className=" mt-3">Video Preview</Text>
          </View>
        );

      default:
        return (
          <View className="w-full h-full items-center justify-center bg-black/50">
            <Icon as={Music} size={70} color="white" />
            <Text className=" mt-2">Audio File</Text>
          </View>
        );
    }
  };

  return (
    <Modal
      visible={open}
      onRequestClose={onClose}
      transparent
      animationType="none"
    >
      <View className="flex-1 bg-black">
        <Carousel
          ref={ref}
          width={width}
          height={height}
          enabled={data.length > 1}
          data={data}
          loop={false}
          onSnapToItem={setIndex}
          renderItem={({ item }) => renderSlide(item)}
        />

        <View className="absolute top-12 left-4 z-20">
          <TouchableOpacity
            onPress={onClose}
            className="bg-black/40 p-2 rounded-full"
          >
            <Icon as={X} size={26} color="white" />
          </TouchableOpacity>
        </View>

        <View className="absolute bottom-0 gap-6 left-0 right-0 w-full z-20">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            centerContent
            contentContainerClassName="gap-2"
          >
            {data.map((item, i) => (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  ref.current?.scrollTo({ index: i, animated: true })
                }
                className={`rounded-xl overflow-hidden border-2 ${
                  index === i ? "border-primary" : "border-outline-100"
                }`}
              >
                <View className="relative">
                  {item.media_type === "IMAGE" ? (
                    <Image
                      source={{ uri: item.url }}
                      className="w-16 h-16"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-16 h-16 bg-black/40 items-center justify-center">
                      <Icon
                        as={item.media_type === "VIDEO" ? Play : Music}
                        color="white"
                        size={24}
                      />
                    </View>
                  )}
                  {index == i && (
                    <TouchableOpacity
                      onPress={() => onDelete(item.id)}
                      className="absolute inset-0 justify-center items-center bg-black/10"
                    >
                      <Icon as={Trash2} size={18} color="white" />
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <SafeAreaView edges={[]} className="h-20 px-6 py-6 bg-black/50">
            <View className="flex-row flex-1 gap-4 items-center">
              {progress > 0 ? (
                <View className="flex-1 h-4 bg-background-muted rounded-full">
                  <Animated.View
                    style={{
                      height: "100%",
                      width: progressAnim.interpolate({
                        inputRange: [0, 100],
                        outputRange: ["0%", "100%"],
                      }),
                      backgroundColor: Colors.primary,
                    }}
                    className={"rounded-full items-center justify-center"}
                  >
                    <Text className="text-xs font-medium">{progress}%</Text>
                  </Animated.View>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    if (open && data.length > 0) {
                      const formatted = data.map((d) => ({ url: d.url }));
                      processFiles(formatted);
                    }
                  }}
                  className={`flex-row justify-center gap-3 w-1/3 ml-auto items-center px-4 py-2 h-10 rounded-xl ${
                    progress < 100 ? "bg-primary" : "bg-background-muted"
                  }`}
                >
                  <Icon as={Save} color="white" size={20} />
                  <Text className="">Save</Text>
                </TouchableOpacity>
              )}
            </View>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}
