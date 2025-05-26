import { Text, useResolvedTheme, View } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { useLayout } from '@react-native-community/hooks';
import { LineChart } from 'react-native-gifted-charts';

const AgentTable = () => {
	const theme = useResolvedTheme();
	const { width, onLayout } = useLayout();
	const Label = (val: number) => {
		return val.toString();
	};

	const customLabel = (val: string) => {
		return (
			<View style={{ width: 70, marginLeft: 7 }}>
				<Text className=" text-lg font-normal">{val}</Text>
			</View>
		);
	};
	const latestData = [
		{
			dataPointText: Label(50),
			value: 100,
			labelComponent: () => customLabel('22 May'),
		},
		{
			dataPointText: Label(50),
			value: 120,
		},
		{
			dataPointText: Label(50),
			value: 210,
		},
		{
			dataPointText: Label(50),
			value: 250,
		},
		{
			dataPointText: Label(50),
			value: 320,
			labelComponent: () => customLabel('24 May'),
		},
		{
			dataPointText: Label(50),
			value: 310,
		},
		{
			dataPointText: Label(50),
			value: 270,
		},
		{
			dataPointText: Label(50),
			value: 240,
		},
		{
			dataPointText: Label(50),
			value: 130,
			labelComponent: () => customLabel('26 May'),
		},
		{
			dataPointText: Label(50),
			value: 120,
		},
		{
			dataPointText: Label(50),
			value: 100,
		},
		{
			dataPointText: Label(50),
			value: 210,
		},
		{
			dataPointText: Label(50),
			value: 270,
			labelComponent: () => customLabel('28 May'),
		},
		{
			dataPointText: Label(50),
			value: 240,
		},
		{
			dataPointText: Label(50),
			value: 120,
		},
		{
			dataPointText: Label(50),
			value: 100,
		},
		{
			dataPointText: Label(50),
			value: 210,
			labelComponent: () => customLabel('30 May'),
		},
		{
			dataPointText: Label(50),
			value: 20,
		},
		{
			dataPointText: Label(50),
			value: 100,
		},
	];

	return (
		<View className=" my-4 mt-6 px-4">
			<View
				onLayout={onLayout}
				className="flex-1 bg-background-muted rounded-xl gap-4 p-4 px-2">
				<View className="px-2">
					<Text className="text-xl">Properties Uploads</Text>
				</View>
				<View>
					<LineChart
						isAnimated
						thickness={2}
						color={Colors.primary}
						width={width - 75}
						noOfSections={4}
						showYAxisIndices
						animateOnDataChange
						animationDuration={1000}
						xAxisLabelTextStyle={{
							color: theme == 'dark' ? Colors.dark.text : Colors.light.text,
						}}
						onDataChangeAnimationDuration={300}
						areaChart
						yAxisTextStyle={{
							color: theme == 'dark' ? Colors.dark.text : Colors.light.text,
						}}
						data={latestData}
						startFillColor={'rgb(255 76 0)'}
						endFillColor={'rgb(255 76 20)'}
						startOpacity={0.4}
						endOpacity={0.1}
						dataPointsColor={
							theme == 'dark' ? Colors.dark.text : Colors.light.text
						}
						spacing={22}
						rulesColor="gray"
						rulesType="dotted"
						initialSpacing={10}
						yAxisColor={theme == 'dark' ? Colors.dark.text : Colors.light.text}
						xAxisColor={theme == 'dark' ? Colors.dark.text : Colors.light.text}
					/>
				</View>
			</View>
		</View>
	);
};

export default AgentTable;
