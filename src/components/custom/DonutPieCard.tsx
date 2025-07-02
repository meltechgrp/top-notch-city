import React from "react";
import { View, Text, useResolvedTheme } from "@/components/ui";
import { PieChart } from "react-native-gifted-charts";
import { cn } from "@/lib/utils"; // if you're using class merging utility like clsx or cn()
import { Colors } from "@/constants/Colors";

interface PieInput {
  value?: number;
  label: string;
}

interface Props {
  title?: string;
  data: PieInput[];
}

const predefinedColors = [
  { color: Colors.primary, gradientCenterColor: Colors.primary },
  { color: "#6b7280", gradientCenterColor: "#6b7280" },
  { color: "#BDB2FA", gradientCenterColor: "#8F80F3" },
  { color: "#FFA5BA", gradientCenterColor: "#FF7F97" },
  { color: "#6CFF6C", gradientCenterColor: "#3FBF3F" },
  { color: "#FFC93C", gradientCenterColor: "#FFB800" },
];

export default function DonutPieChart({ title = "Performance", data }: Props) {
  const maxValue = Math.max(...data.map((item) => item.value || 0));
  const theme = useResolvedTheme();

  const pieData = data.map((item, index) => {
    const { color, gradientCenterColor } =
      predefinedColors[index % predefinedColors.length];
    return {
      value: item.value || 0,
      label: item.label,
      focused: item.value === maxValue,
      color,
      gradientCenterColor,
    };
  });

  const focusedItem = pieData.find((item) => item.focused);

  const renderDot = (color: string) => (
    <View
      className="h-2.5 w-2.5 rounded-full"
      style={{ backgroundColor: color }}
    />
  );

  const renderLegendComponent = () => (
    <View className="flex-row flex-wrap justify-center gap-x-6 gap-y-2">
      {pieData.map((item, index) => (
        <View key={index} className="flex-row gap-2 items-center w-36">
          {renderDot(item.gradientCenterColor)}
          <Text className=" capitalize">{item.label}:</Text>
          <Text>{item.value}%</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View className={cn("my-4 mt-6 px-4")}>
      <View className=" p-4 rounded-2xl bg-background-muted">
        <Text className=" text-xl font-bold mb-3">{title}</Text>

        <View className="items-center pb-6">
          <PieChart
            data={pieData}
            donut
            showGradient
            sectionAutoFocus
            radius={90}
            innerRadius={60}
            innerCircleColor={
              theme == "light"
                ? Colors.dark.background
                : Colors.light.background
            }
            centerLabelComponent={() => (
              <View className="items-center justify-center">
                <Text className=" text-xl font-bold">
                  {focusedItem?.value}%
                </Text>
                <Text className=" text-sm">{focusedItem?.label}</Text>
              </View>
            )}
          />
        </View>

        {renderLegendComponent()}
      </View>
    </View>
  );
}
