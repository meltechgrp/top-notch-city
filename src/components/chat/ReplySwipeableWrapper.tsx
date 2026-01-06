import { View } from "@/components/ui";
import ReanimatedSwipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import * as Haptics from "expo-haptics";
import { ReactNode, useRef } from "react";
import { Icon } from "@/components/ui";
import { Reply } from "lucide-react-native";

type Props = {
  children: ReactNode;
  onReply: () => void;
  side?: "left" | "right";
};

export default function ReplySwipeableWrapper({
  children,
  onReply,
  side = "left",
}: Props) {
  const ref = useRef<SwipeableMethods>(null);
  const triggered = useRef(false);

  const trigger = () => {
    if (triggered.current) return;
    triggered.current = true;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onReply();

    requestAnimationFrame(() => {
      ref.current?.close();
      triggered.current = false;
    });
  };

  return (
    <ReanimatedSwipeable
      ref={ref}
      friction={1.5}
      overshootLeft={false}
      overshootRight={false}
      leftThreshold={side === "left" ? 50 : undefined}
      rightThreshold={side === "right" ? 50 : undefined}
      onSwipeableWillOpen={(dir) => {
        if (
          (dir === "right" && side === "left") ||
          (dir === "left" && side === "right")
        ) {
          trigger();
        }
      }}
      renderLeftActions={side === "left" ? () => <ReplyIndicator /> : undefined}
      renderRightActions={
        side === "right" ? () => <ReplyIndicator /> : undefined
      }
    >
      {children}
    </ReanimatedSwipeable>
  );
}

function ReplyIndicator() {
  return (
    <View
      style={{
        width: 80,
        justifyContent: "center",
        paddingLeft: 16,
      }}
      className=" justify-center pl-4"
    >
      <Icon as={Reply} className="w-7 h-7 text-primary" />
    </View>
  );
}
