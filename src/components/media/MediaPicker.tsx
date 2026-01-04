import React, {
  ReactNode,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import { Dimensions, Modal, Platform } from "react-native";
import { Pressable } from "@/components/ui";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { scheduleOnRN } from "react-native-worklets";
import MediaWrapper from "@/components/media/MediaWrapper";
import { MediaType, useMediaUpload } from "@/hooks/useMediaUpload";
import MediaPreviewView from "@/components/media/MediaPreviewView";
import { EditorOnchangeArgs } from "@/components/custom/Editor";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const SHEET_HEIGHT = SCREEN_HEIGHT;

type MediaPickerProps = {
  trigger?: ReactNode;
  onSend: (arg: EditorOnchangeArgs) => void;
  max?: number;
  asScanner?: boolean;
  type?: MediaType;
  isChat?: boolean;
  fullName?: string;
};

export type MediaPickerRef = {
  open: () => void;
  close: () => void;
  pick: () => void;
};

const MediaPicker = React.forwardRef<MediaPickerRef, MediaPickerProps>(
  (props, ref) => {
    const {
      trigger,
      onSend,
      max = 1,
      type = "all",
      asScanner = false,
      isChat,
      fullName,
    } = props;
    const [media, setMedia] = useState<UploadedFile[]>([]);
    const [visible, setVisible] = useState(false);

    const { pickMedia } = useMediaUpload({
      onFiles: (m) => {
        setVisible(true);
        setMedia(m);
      },
      maxSelection: max,
      type,
    });
    const [previewVisible, setPreviewVisible] = React.useState<boolean>(false);
    const translateY = useSharedValue(SCREEN_HEIGHT);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: translateY.value }],
    }));
    const onDismiss = () => {
      setMedia([]);
      setVisible(false);
    };
    const open = () => {
      setVisible(true);
      translateY.value = withTiming(SCREEN_HEIGHT - SHEET_HEIGHT, {
        duration: 280,
      });
    };

    const close = useCallback(() => {
      translateY.value = withTiming(SCREEN_HEIGHT, { duration: 220 }, () => {
        scheduleOnRN(onDismiss);
      });
    }, [onDismiss]);
    const panGesture = Gesture.Pan()
      .enabled(Platform.OS !== "web" && previewVisible)
      .onUpdate((e) => {
        if (e.translationY > 50) {
          translateY.value = SCREEN_HEIGHT - SHEET_HEIGHT + e.translationY;
        }
      })
      .onEnd((e) => {
        if (e.translationY > 200) {
          scheduleOnRN(close);
        } else {
          translateY.value = withSpring(SCREEN_HEIGHT - SHEET_HEIGHT);
        }
      });
    const pick = async () => {
      open();
      await pickMedia();
    };
    useImperativeHandle(ref, () => {
      return {
        open: open,
        pick: pick,
        close: close,
      };
    }, []);
    return (
      <>
        {trigger && <Pressable onPress={open}>{trigger}</Pressable>}

        <Modal
          visible={visible}
          transparent
          statusBarTranslucent
          animationType="none"
          onRequestClose={close}
        >
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                {
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: SCREEN_HEIGHT,
                },
                animatedStyle,
              ]}
              className="bg-background rounded-t-3xl overflow-hidden"
            >
              <MediaWrapper
                media={media}
                pickMedia={pickMedia}
                onFiles={(m) => setMedia((f) => [...m, ...f])}
                max={max}
                type={type}
                onClose={close}
                openPreview={() => setPreviewVisible(true)}
              />
              {previewVisible && (
                <MediaPreviewView
                  onDelete={(id) => {
                    setMedia((m) => m.filter((f) => f.id != id));
                    if (media?.length! > 0) {
                      setPreviewVisible(false);
                    }
                  }}
                  fullName={fullName}
                  max={max}
                  pickMedia={pickMedia}
                  onClose={() => setPreviewVisible(false)}
                  visible={previewVisible}
                  onUpload={onSend}
                  media={media}
                  isChat={isChat}
                />
              )}
            </Animated.View>
          </GestureDetector>
        </Modal>
      </>
    );
  }
);

export default MediaPicker;
