import PropertyCarousel from "@/components/property/PropertyCarousel";
import { CloseIcon } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { useLayout } from "@react-native-community/hooks";

import { AnimatePresence, MotiView } from "moti";
import { useEffect, useReducer, useState } from "react";
import { Modal, Pressable, View } from "react-native";

type Props = {
  onMount?: () => void;
  onUnmount?: () => void;
};
export default function MediaViewerScreen(props: Props) {
  const mediaViewer = useStore((v) => v.mediaViewer);
  // const unsetMediaViewer = useStore((v) => v.unsetMediaViewer);
  if (!mediaViewer) return null;
  // return (
  //   <MediaViewer
  //     media={mediaViewer.media}
  //     currentIndex={mediaViewer.currentIndex}
  //     isVideoReady={!!mediaViewer.isVideoReady}
  //     unsetMediaViewer={unsetMediaViewer}
  //     {...props}
  //   />
  // );
}

type MediaViewerProps = Props & {
  media: Media[];
  isVideoReady: boolean;
  currentIndex: number;
  unsetMediaViewer: () => void;
};
function MediaViewer(props: MediaViewerProps) {
  const {
    media,
    currentIndex,
    unsetMediaViewer,
    onMount,
    onUnmount,
    isVideoReady,
  } = props;
  const [visible, setVisible] = useState(true);
  const [backgroundColorVisibility, setBackgroundColorVisibility] =
    useState(true);
  const [show, toggle] = useReducer((s) => !s, true);
  const { onLayout, width } = useLayout();
  function onDismiss() {
    setVisible(false);
    unsetMediaViewer();
  }
  useEffect(() => {
    onMount && onMount();
    return () => {
      onUnmount && onUnmount();
    };
  }, []);

  return (
    <Modal
      visible={visible}
      transparent={true}
      onDismiss={onDismiss}
      onRequestClose={onDismiss}
      animationType="fade"
    >
      <View onLayout={onLayout} className="flex-1 relative">
        <View
          className={cn(
            backgroundColorVisibility ? "bg-black" : "bg-black/90",
            "flex-1  justify-center items-center relative"
          )}
        >
          <Pressable className="flex-1 absolute inset-0" onPress={toggle} />
          <View className="z-10">
            <PropertyCarousel
              media={media}
              // onPress={toggle}
              // onSlideDown={onDismiss}
              // setBackgroundColorVisibility={setBackgroundColorVisibility}
              width={width || 300}
              withBackdrop={true}
              loop={true}
              withPagination={false}
              rounded={true}
              enabled={false}
            />
          </View>
        </View>
        <AnimatePresence>
          {show && (
            <MotiView
              from={{
                top: -50,
                opacity: 0.5,
              }}
              exit={{
                top: -100,
                opacity: 0,
              }}
              animate={{
                top: 48,
                opacity: 1,
              }}
              transition={{
                type: "timing",
                // duration: 200,
              }}
              className="h-12 absolute top-12 w-full px-4 z-10"
            >
              <Pressable
                className="w-12 h-12 justify-center items-center"
                onPress={onDismiss}
              >
                <CloseIcon color={"white"} />
              </Pressable>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </Modal>
  );
}
