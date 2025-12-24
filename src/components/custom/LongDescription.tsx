import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { LayoutChangeEvent } from "react-native";
import { Icon, Pressable, Text, View } from "../ui";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { format } from "date-fns";

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
    if (e.nativeEvent.lines.length > 0) {
      setLineHeight(e.nativeEvent.lines[0].height);
    }
  };

  useEffect(() => {
    if (lineHeight > 0) {
      const maxLinesHeight = lineHeight * numberOfLines;
      setShowToggle(fullHeight >= maxLinesHeight);
    }
  }, [fullHeight, lineHeight, numberOfLines]);

  return (
    <>
      <View className={cn("", !description && " hidden", className)}>
        <View>
          <Text
            onLayout={onLayout}
            onTextLayout={onTextLayout}
            numberOfLines={!expanded ? numberOfLines : undefined}
            className={cn("text-sm", textClassName)}
          >
            {description?.toLowerCase()}
          </Text>
        </View>

        {showToggle && (
          <Pressable
            onPress={toggleExpanded}
            className="mt-2 flex-row items-center"
          >
            <Text className="text-primary text-sm font-bold">
              {expanded ? "Show Less" : "Show More"}
            </Text>
            <Icon
              as={expanded ? ChevronUp : ChevronDown}
              className="text-primary w-6 h-6"
            />
          </Pressable>
        )}
      </View>
    </>
  );
}
