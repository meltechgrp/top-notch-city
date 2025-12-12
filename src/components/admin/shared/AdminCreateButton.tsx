import React, { useState } from "react";
import { View, Pressable } from "react-native";
import { LucideIcon, Plus } from "lucide-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/ui";

type AdminCreateButtonProps = {
  onPress: (val: string) => void;
  className?: string;
  solo?: boolean;
  buttons?: {
    icon: LucideIcon;
    value: string;
  }[];
};

function AdminCreateButton({ solo = false, ...props }: AdminCreateButtonProps) {
  const [open, setOpen] = useState(false);
  const toggle = (forceClose = false) => {
    const closing = forceClose || open;
    setOpen(!closing);
    rotation.value = withTiming(closing ? 0 : 1, { duration: 300 });
    radius.value = withTiming(closing ? 0 : 1, { duration: 300 });
  };
  const rotation = useSharedValue(0);
  const radius = useSharedValue(0);

  const rotationStyle = useAnimatedStyle(() => {
    const rotate = interpolate(rotation.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  return (
    <>
      {/* {open && (
				<Pressable
					className="absolute inset-0 z-0"
					onPress={() => toggle(true)}
				/>
			)} */}
      <View
        className={cn(
          "absolute bottom-[120px] z-20 android:bottom-[50px] right-2",
          props.className
        )}
      >
        {props.buttons?.map((btn, index) => {
          const angleRad =
            ((index == 0 ? -95 : index == 1 ? -150 : -200) * Math.PI) / 180;

          const style = useAnimatedStyle(() => {
            const r = interpolate(radius.value, [0, 1], [0, 70]);
            const x = r * Math.cos(angleRad);
            const y = r * Math.sin(angleRad);
            return {
              transform: [
                { translateX: x },
                { translateY: y },
                { scale: radius.value },
              ],
              opacity: radius.value,
            };
          });

          return (
            <Pressable
              onPress={() => {
                toggle();
                props.onPress(btn.value);
              }}
              key={index}
            >
              <Animated.View
                style={[style]}
                className="absolute p-4 bg-background-muted rounded-full items-center justify-center shadow"
              >
                <Icon as={btn.icon} className="w-7 h-7 text-primary" />
              </Animated.View>
            </Pressable>
          );
        })}

        <Pressable
          className="bg-primary rounded-full p-1 w-14 h-14 focus:scale-95 items-center justify-center z-30 shadow"
          accessibilityRole="button"
          accessibilityLabel="Create"
          onPress={() => {
            if (solo) {
              toggle();
              props.onPress("");
            } else {
              toggle();
            }
          }}
        >
          <Animated.View style={[rotationStyle]}>
            <Icon as={Plus} className="text-white w-8 h-8" />
          </Animated.View>
        </Pressable>
      </View>
    </>
  );
}

export default AdminCreateButton;
