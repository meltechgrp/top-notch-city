"use client";
import React, { useRef } from "react";
import {
  GestureResponderEvent,
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
} from "react-native";
import { hapticFeed } from "@/components/HapticTab";
import { cn } from "@/lib/utils";

interface IPressableProps extends RNPressableProps {
  disableHaptic?: boolean;
  both?: boolean;
  onDoublePress?: (event: GestureResponderEvent) => void;
}

const Pressable = React.forwardRef<
  React.ComponentRef<typeof RNPressable>,
  IPressableProps
>(function Pressable(
  {
    className,
    disableHaptic = false,
    both = false,
    onDoublePress,
    onPress,
    ...props
  },
  ref
) {
  const lastPress = useRef<number>(0);
  const delay = 300; // 300ms for double tap

  const handlePress = (e: GestureResponderEvent) => {
    const time = Date.now();
    if (time - lastPress.current < delay) {
      onDoublePress?.(e);
    } else {
      onPress?.(e);
    }
    lastPress.current = time;
  };

  return (
    <RNPressable
      {...props}
      ref={ref}
      onPress={async (e) => {
        if (!disableHaptic) {
          await hapticFeed(both);
        }
        handlePress(e);
      }}
      className={cn(" disabled:opacity-40", className)}
    />
  );
});

Pressable.displayName = "Pressable";
export { Pressable };
