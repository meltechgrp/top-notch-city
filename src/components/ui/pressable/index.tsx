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
    onLongPress,
    ...props
  },
  ref
) {
  const lastPress = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const delay = 250;
  const handlePress = (e: GestureResponderEvent) => {
    const now = Date.now();

    const isDouble = now - lastPress.current < delay;
    lastPress.current = now;

    if (isDouble) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      onDoublePress?.(e);
    } else {
      timeoutRef.current = setTimeout(() => {
        onPress?.(e);
        timeoutRef.current = null;
      }, delay);
    }
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
      onLongPress={async (e) => {
        if (!disableHaptic) {
          await hapticFeed(both);
        }
        onLongPress?.(e);
      }}
      className={cn(" disabled:opacity-40", className)}
    />
  );
});

Pressable.displayName = "Pressable";
export { Pressable };
