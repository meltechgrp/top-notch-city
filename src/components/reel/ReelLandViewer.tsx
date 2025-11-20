import React, { forwardRef, memo, useImperativeHandle, useState } from "react";
import { View } from "../ui";
import PlayerController from "@/components/custom/PlayerController";
import { ReelViewsController } from "@/components/reel/ReelViewsController";
import PropertyCarousel from "@/components/property/PropertyCarousel";
import { ReelsShareSheet } from "@/components/modals/ReelsBottomsheet";
import config from "@/config";

const ReelLandViewer = memo(
  forwardRef<any, ReelLandViewerProps>(
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
              loop={false}
              withPagination={true}
              rounded={rounded}
              factor={1.2}
              paginationsize={8}
              media={reel.photos}
              pointerPosition={6}
            />

            {/* Controls Overlay */}
            {/* <View className="absolute inset-0 z-10 bg-black/20 items-center justify-center"> */}
            {fullScreen && (
              <PlayerController
                handleSkip={() => {}}
                reel={reel}
                setShowBottomSheet={() => setShowBottomSheet(true)}
                currentTime={0}
                length={0}
                isLand={true}
                inTab={inTab}
                showSlider={false}
              />
            )}
            {/* </View> */}
          </View>
          <ReelsShareSheet
            visible={showBottomSheet}
            id={reel.id}
            hideMute
            onDismiss={() => setShowBottomSheet(false)}
            propertyUrl={`${config.websiteUrl}/property/${reel.id}`}
          />
        </>
      );
    }
  )
);

export default memo(ReelLandViewer);
