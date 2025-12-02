import { Text, useResolvedTheme, View } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { cn } from "@/lib/utils";
import { useLayout } from "@react-native-community/hooks";
import { format } from "date-fns";
import { useMemo } from "react";
import { LineChart } from "react-native-gifted-charts";

interface DataPoint {
  views: number;
  date: string;
}

interface Props {
  className?: string;
  title: string;
  data: DataPoint[];
  chartProps?: Partial<React.ComponentProps<typeof LineChart>>;
}

export default function LineChartCard({
  className,
  title,
  data,
  chartProps,
}: Props) {
  const theme = useResolvedTheme();
  const { width, onLayout } = useLayout();
  const transformedData = useMemo(
    () =>
      data.map((item, index) => ({
        value: item.views || 1,
        dataPointText: item.views.toString(),
        labelComponent:
          index % 2 === 0
            ? () => (
                <View style={{ width: 50, marginLeft: 7 }}>
                  <Text className="text-sm font-normal">
                    {format(new Date(item.date), "dd MMM")}
                  </Text>
                </View>
              )
            : undefined,
      })),
    [data]
  );
  return (
    <View className={cn("my-4 mt-6 px-4", className)}>
      <View
        onLayout={onLayout}
        className="flex-1 bg-background-muted rounded-xl gap-4 p-4 px-2"
      >
        <View className="px-2 flex-row justify-between">
          <Text className="text-xl">{title}</Text>
        </View>
        <View>
          <LineChart
            isAnimated
            thickness={3}
            color={Colors.primary}
            width={width - 75}
            noOfSections={4}
            showYAxisIndices
            animateOnDataChange
            animationDuration={1000}
            areaChart
            data={transformedData}
            spacing={22}
            initialSpacing={10}
            startFillColor="rgb(255 76 0)"
            endFillColor="rgb(255 76 20)"
            startOpacity={0.4}
            endOpacity={0.1}
            rulesColor="gray"
            rulesType="dotted"
            dataPointsColor={
              theme === "dark" ? Colors.dark.text : Colors.light.text
            }
            textFontSize1={14}
            textShiftY={-2}
            dataPointsHeight={6}
            dataPointsWidth={6}
            yAxisColor={theme === "dark" ? Colors.dark.text : Colors.light.text}
            textColor1={theme === "dark" ? Colors.dark.text : Colors.light.text}
            xAxisColor={theme === "dark" ? Colors.dark.text : Colors.light.text}
            xAxisLabelTextStyle={{
              color: theme === "dark" ? Colors.dark.text : Colors.light.text,
            }}
            yAxisTextStyle={{
              color: theme === "dark" ? Colors.dark.text : Colors.light.text,
            }}
            {...chartProps}
          />
        </View>
      </View>
    </View>
  );
}
