import React, { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, View } from "react-native";

import { useKeyboard } from "@react-native-community/hooks";
import Layout from "@/constants/Layout";
import { CloseIcon, Icon, Text } from "@/components/ui";
import { cn } from "@/lib/utils";

type BottomSheetProps = Modal["props"] & {
  doneLabel?: string;
  title?: string;
  noHeaderBorder?: boolean;
  noHeader?: boolean;
};

export default function BottomSheetPlainTwo(props: BottomSheetProps) {
  const keyboard = useKeyboard();
  const h = Layout.window.height - keyboard.keyboardHeight - 50;
  const w = Layout.window.width;

  const slideAnim = useRef(new Animated.Value(300)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (props.visible) {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [props.visible]);

  function handleDismiss() {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      props.onDismiss?.();
    });
  }

  return (
    <Modal
      animationType="none"
      visible={props.visible}
      transparent
      onRequestClose={handleDismiss}
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.7)",
          justifyContent: "flex-end",
          opacity: opacityAnim,
        }}
        onTouchEnd={handleDismiss}
      >
        <Animated.View
          onTouchEnd={(ev) => ev.stopPropagation()}
          style={{
            transform: [{ translateY: slideAnim }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
            maxHeight: "90%",
          }}
        >
          <View
            style={[keyboard.keyboardShown ? { height: h } : {}]}
            className="relative overflow-hidden"
          >
            <View
              style={{ width: w }}
              className="bg-background-muted pb-4 rounded-t-lg"
            >
              {!props?.noHeader && (
                <View
                  className={cn(
                    "h-16 border-b border-outline flex-row items-center px-4 justify-between",
                    {
                      "border-b-0": props?.noHeaderBorder,
                    }
                  )}
                >
                  <Text className=" text-base">{props?.title}</Text>
                  <Pressable
                    onPress={handleDismiss}
                    className="bg-outline rounded-full w-8 h-8 items-center justify-center"
                  >
                    <Icon as={CloseIcon} className="transform scale-[0.9]" />
                  </Pressable>
                </View>
              )}
              {props.children}
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
