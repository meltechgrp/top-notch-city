import * as ImagePicker from "expo-image-picker";
import * as React from "react";
import Animated, {
  FadeInDown,
  LinearTransition,
  ZoomIn,
} from "react-native-reanimated";
import { calculateFeedDisplayDimensions, cn } from "@/lib/utils";
import { Alert, Pressable, ScrollView } from "react-native";
import { useCallback, useImperativeHandle, useState, useMemo } from "react";
import { Platform } from "react-native";
import { CloseIcon, Image } from "@/components/ui";
import { useMediaCompressor } from "@/hooks/useMediaCompressor";
import { uniqueId } from "lodash-es";
type Props = {
  media: (ImagePicker.ImagePickerAsset & { isCompressed?: boolean })[];
  max?: number;
  onChange: (
    media: React.SetStateAction<
      (ImagePicker.ImagePickerAsset & { isCompressed?: boolean })[]
    >
  ) => void;
  className?: string;
  onHeightChange?: (height: number) => void;
  origin?: "chat";
  autoCompress?: boolean;
};

export type MediaPickerRef = {
  onPickPhoto: () => void;
};
const MAX_PREVIEW_WIDTH = 294;
const MAX_PREVIEW_HEIGHT = 220;

const MediaPicker = React.forwardRef<MediaPickerRef, Props>((props, ref) => {
  const {
    media,
    max = 1,
    onChange,
    className,
    onHeightChange,
    origin = "chat",
    autoCompress = true,
  } = props;
  const { compress } = useMediaCompressor();
  const [maxHeight, setMaxHeight] = useState<number>(0);
  const [scrollWidth, setScrollWidth] = useState<number>(0);
  const computedDimensions = useMemo(() => {
    const newDimensions: { [key: string]: { width: number; height: number } } =
      {};
    if (!media.length) {
      return newDimensions;
    }
    media.forEach((asset) => {
      if (asset.width && asset.height) {
        const { width, height } = calculateFeedDisplayDimensions(
          asset.width,
          asset.height,
          MAX_PREVIEW_WIDTH,
          MAX_PREVIEW_HEIGHT
        );
        newDimensions[asset.uri] = {
          width: Math.round(width),
          height: Math.round(height),
        };
      } else {
        // Fallback to square size if dimensions are unavailable
        newDimensions[asset.uri] = {
          width: 294,
          height: 294,
        };
      }
    });
    // Find the tallest image and resize all images to match its height
    const tallestImage = Math.max(
      // @ts-ignore
      ...media.map((asset) => newDimensions[asset.uri].height)
    );
    media.forEach((asset) => {
      // @ts-ignore
      newDimensions[asset.uri].height = tallestImage;
    });

    return newDimensions;
  }, [media]);

  React.useEffect(() => {
    if (computedDimensions && Object.keys(computedDimensions).length > 0) {
      const tallestImage = Math.max(
        // @ts-ignore
        ...media.map((asset) => computedDimensions[asset.uri].height)
      );
      onHeightChange && onHeightChange(tallestImage);
      setMaxHeight(tallestImage);
      setScrollWidth(
        Object.values(computedDimensions).reduce(
          (acc, dim) => acc + dim.width,
          0
        )
      );
    }
  }, [computedDimensions, media]);

  const onPickPhoto = useCallback(async () => {
    if (media.length >= max) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Media library access is required.");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
        preferredAssetRepresentationMode:
          ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Current,
        allowsMultipleSelection: true,
        orderedSelection: true,
        selectionLimit: max - media.length,
      });

      if (result.canceled || !result.assets?.length) return;

      const assets: ImagePicker.ImagePickerAsset[] = [];
      const files = await Promise.all(
        result.assets.map((file) =>
          compress({
            type: "image",
            uri: file.uri,
            compressionRate: 0.2,
          })
        )
      );
      const compressed = files
        .filter((item) => item !== null)
        .map((item) => ({
          uri: item!,
          assetId: uniqueId("media"),
        }));
      for (const asset of compressed) {
        asset && assets.push(asset as unknown as ImagePicker.ImagePickerAsset);
      }

      onChange((prev) => {
        const merged = [...prev, ...assets]
          .filter(
            (item, idx, arr) => idx === arr.findIndex((t) => t.uri === item.uri)
          )
          .slice(0, max);
        return merged;
      });
    } catch (err) {
      console.error("Failed to pick media:", err);
    }
  }, [onChange, media, max, origin, autoCompress]);

  const onRemovePhoto = React.useCallback(
    (uri: string) => {
      onChange((v) => v.filter((p) => p.uri !== uri));
    },
    [onChange]
  );

  useImperativeHandle(ref, () => {
    return {
      onPickPhoto,
    };
  }, []);

  if (!media.length) {
    return null;
  }
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="bg-transparent"
      contentContainerClassName="w-full items-end pb-4 pl-4 bg-transparent"
      contentContainerStyle={{
        height: 100 + 22,
        width: scrollWidth + 62,
      }}
      pagingEnabled
    >
      <Animated.View
        className={cn("flex-row gap-x-2 bg-transparent", className)}
        layout={LinearTransition}
      >
        {media?.map((asset, index) => (
          <Animated.View
            key={index}
            entering={ZoomIn}
            exiting={FadeInDown.duration(50).delay(0)}
            layout={LinearTransition}
            className="flex items-center rounded-lg mr-2"
            style={{
              width: 100,
              height: 100,
            }}
          >
            <Image
              source={{ uri: asset.uri }}
              className="w-full h-full rounded-lg"
              contentFit="cover"
              rounded
            />

            <Pressable
              className="bg-primary w-6 h-6 absolute -right-2 -top-2 items-center justify-center rounded-full border border-primary"
              onPress={() => onRemovePhoto(asset.uri)}
            >
              <CloseIcon
                style={[{ transform: [{ scale: 0.5 }] }]}
                color={"white"}
              />
            </Pressable>
          </Animated.View>
        ))}
      </Animated.View>
    </ScrollView>
  );
});

export default MediaPicker;
