import React, { forwardRef, memo, useImperativeHandle, useState } from "react";
import { View, Icon, Text } from "../ui";
import { Eye, Play } from "lucide-react-native";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { cn } from "@/lib/utils";
import AnimatedPressable from "@/components/custom/AnimatedPressable";
import PlayerController from "@/components/custom/PlayerController";
import { ReelViewsController } from "@/components/reel/ReelViewsController";
import PropertyCarousel from "@/components/property/PropertyCarousel";
import { ReelsShareSheet } from "@/components/modals/ReelsBottomsheet";
import config from "@/config";

export const ReelPhotoViewer = memo(
  forwardRef<any, ReelPhotoViewerProps>(
    (
      {
        rounded = false,
        onPress,
        reel,
        height,
        fullScreen,
        inTab = true,
        width,
      },
      ref
    ) => {
      ReelViewsController({
        id: reel.id,
        viewed: reel.owner_interaction.viewed,
      });
      const [showBottomSheet, setShowBottomSheet] = useState(false);
      useImperativeHandle(ref, () => ({}), []);
      return (
        <>
          <View className="flex-1 justify-center" style={{ height }}>
            <PropertyCarousel
              width={width || 300}
              withBackdrop={false}
              loop={false}
              withPagination={true}
              rounded={rounded}
              factor={1.3}
              isList={true}
              enabled={true}
              paginationsize={6}
              media={reel.photos}
              pointerPosition={6}
            />

            {/* Controls Overlay */}
            <View className="absolute inset-0 z-10 bg-black/20 items-center justify-center">
              {fullScreen && (
                <PlayerController
                  handleSkip={() => {}}
                  reel={reel}
                  setShowBottomSheet={() => setShowBottomSheet(true)}
                  currentTime={0}
                  length={0}
                  inTab={inTab}
                  showSlider={false}
                />
              )}
            </View>
          </View>
          <ReelsShareSheet
            visible={showBottomSheet}
            id={reel.id}
            onDismiss={() => setShowBottomSheet(false)}
            propertyUrl={`${config.websiteUrl}/property/${reel.id}`}
          />
        </>
      );
    }
  )
);
