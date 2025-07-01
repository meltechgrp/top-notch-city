import { Text, useResolvedTheme, View } from "@/components/ui";
import { Colors } from "@/constants/Colors";
import { cn } from "@/lib/utils";
import { useLayout } from "@react-native-community/hooks";
import { format } from "date-fns";
import { BarChart } from "react-native-gifted-charts";

interface BarDataItem {
  label: string;
  value: number;
}

interface Props {
  className?: string;
  title: string;
  data: BarDataItem[];
}

const BarChartCard = ({ className, title, data }: Props) => {
  const theme = useResolvedTheme();
  const { width, onLayout } = useLayout();

  // Automatically attach top labels
  const chartData = data.map((item) => ({
    ...item,
    label: format(new Date(item.label), "MMM"),
    topLabelComponent: () => <Text className="text-xl mb-2">{item.value}</Text>,
  }));

  const themeTextColor =
    theme === "dark" ? Colors.dark.text : Colors.light.text;

  return (
    <View className={cn("my-6 px-4", className)}>
      <View
        onLayout={onLayout}
        className="flex-1 bg-background-muted rounded-xl gap-4 p-4 px-2"
      >
        <View className="px-2">
          <Text className="text-xl">{title}</Text>
        </View>
        <BarChart
          width={width - 75}
          data={chartData}
          noOfSections={5}
          isAnimated
          showYAxisIndices
          frontColor={Colors.primary}
          color={themeTextColor}
          yAxisColor={themeTextColor}
          xAxisColor={themeTextColor}
          yAxisTextStyle={{ color: themeTextColor }}
          xAxisLabelTextStyle={{ color: themeTextColor }}
        />
      </View>
    </View>
  );
};

export default BarChartCard;
