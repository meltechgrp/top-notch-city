import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { LayoutChangeEvent } from "react-native";
import { Pressable, Text, View } from "../ui";

interface LongDescriptionProps {
  description?: string;
  numberOfLines?: number;
  className?: string;
  textClassName?: string;
}

export function LongDescription({
  description,
  numberOfLines = 6,
  className,
  textClassName,
}: LongDescriptionProps) {
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const [fullHeight, setFullHeight] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);

  const toggleExpanded = () => setExpanded((prev) => !prev);

  const onLayout = (event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    setFullHeight(height);
  };

  const onTextLayout = (e: any) => {
    if (lineHeight === 0 && e.nativeEvent.lines.length > 0) {
      setLineHeight(e.nativeEvent.lines[0].height);
    }
  };

  useEffect(() => {
    if (lineHeight > 0) {
      const maxLinesHeight = lineHeight * numberOfLines;
      setShowToggle(fullHeight > maxLinesHeight);
    }
  }, [fullHeight, lineHeight, numberOfLines]);

  return (
    <View className={cn("", !description && " hidden", className)}>
      <Text
        onLayout={onLayout}
        onTextLayout={onTextLayout}
        numberOfLines={!expanded ? numberOfLines : undefined}
        className={cn("text-sm  sm:w-[60%]", textClassName)}
      >
        {description}
      </Text>

      {showToggle && (
        <Pressable onPress={toggleExpanded} className="mt-2 sm:hidden">
          <Text className="text-primary text-sm font-bold">
            {expanded ? "View Less" : "View More"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
