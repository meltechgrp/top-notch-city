import React from "react";
import { Animated, Modal, Pressable, View } from "react-native";
import { Text } from "../ui";
import { cn } from "@/lib/utils";

type BottomSheetProps = Modal["props"] & {
  doneLabel?: string;
  withBackground?: boolean;
  withClose?: boolean;
};
export default function BottomSheetPlain({
  withBackground = true,
  withClose = true,
  ...props
}: BottomSheetProps) {
  function handleDismiss() {
    props.onDismiss!();
  }

  return (
    <Modal
      animationType="slide"
      visible={props.visible}
      transparent
      onRequestClose={() => handleDismiss()}
      statusBarTranslucent={true}
    >
      <View
        className="flex-1 bg-black/30 justify-end"
        onTouchEnd={() => {
          handleDismiss();
        }}
      >
        <Animated.View
          onTouchEnd={(ev) => {
            ev.stopPropagation();
          }}
          style={[
            {
              shadowColor: "#000",
              shadowOffset: {
                width: 100,
                height: 100,
              },
              shadowRadius: 0,
              elevation: 3,
            },
          ]}
        >
          <View
            className={cn(
              "relative overflow-hidden",
              withClose && "p-4 ios:pb-[34px] android:pb-4"
            )}
          >
            <View
              className={cn(
                "bg-background-muted mb-2 rounded-2xl",
                !withBackground && "bg-transparent"
              )}
            >
              {props.children}
            </View>
            {withClose && (
              <Pressable
                onPress={handleDismiss}
                className="bg-background-muted h-14 items-center justify-center rounded-lg"
              >
                <Text className="">{props.doneLabel || "Cancel"}</Text>
              </Pressable>
            )}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
