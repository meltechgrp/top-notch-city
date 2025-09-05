import { useMemo } from "react";
import { Dimensions } from "react-native";
import { VideoPlayer } from "@/components/custom/VideoPlayer";
import { Box, Icon, View } from "@/components/ui";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { usePropertyStore } from "@/store/propertyStore";
import { propertyToReelVideo } from "@/hooks/useReel";
import Platforms from "@/constants/Plaforms";

const { height: h, width } = Dimensions.get("window");

export default function Videos() {
  const { details } = usePropertyStore();
  if (!details) return;
  const video = useMemo(() => propertyToReelVideo([details]), [details]);
  const insets = useSafeAreaInsets();
  const height = useMemo(
    () =>
      Platforms.isIOS()
        ? h - insets.top - insets.bottom - 48
        : h - insets.top - 48,
    [h, insets]
  );
  return (
    <>
      <Box className="flex-1">
        <SafeAreaView
          edges={["bottom"]}
          className="flex-1 justify-center bg-background relative"
        >
          <VideoPlayer
            style={{
              height: height,
              width,
            }}
            reel={video[0]}
            fullScreen={false}
            shouldPlay={true}
          />
        </SafeAreaView>
      </Box>
    </>
  );
}
