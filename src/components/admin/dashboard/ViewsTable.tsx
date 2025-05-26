import { Text, useResolvedTheme, View } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import { useLayout } from '@react-native-community/hooks';
import { BarChart } from 'react-native-gifted-charts';

const ViewsTable = () => {
	const theme = useResolvedTheme();
	const { width, onLayout } = useLayout();
	const data = [
		{
			value: 20,
			label: 'Jan',
			topLabelComponent: () => <Text className="text-xl mb-2">20</Text>,
		},
		{
			value: 30,
			label: 'Feb',
			topLabelComponent: () => <Text className="text-xl mb-2">30</Text>,
		},
		{
			value: 50,
			label: 'Mar',
			topLabelComponent: () => <Text className="text-xl mb-2">50</Text>,
		},
		{
			value: 40,
			label: 'Apr',
			topLabelComponent: () => <Text className="text-xl mb-2">40</Text>,
		},
		{
			value: 30,
			label: 'May',
			topLabelComponent: () => <Text className="text-xl mb-2">30</Text>,
		},
		{
			value: 80,
			label: 'Jun',
			topLabelComponent: () => <Text className="text-xl mb-2">80</Text>,
		},
		{
			value: 120,
			label: 'Jul',
			topLabelComponent: () => <Text className="text-xl mb-2">120</Text>,
		},
	];
	return (
		<View className=" my-4 mt-6 px-4">
			<View
				onLayout={onLayout}
				className="flex-1 bg-background-muted rounded-xl gap-4 p-4 px-2">
				<View className="px-2">
					<Text className="text-xl">Properties Views</Text>
				</View>
				<View>
					<BarChart
						yAxisTextStyle={{
							color: theme == 'dark' ? Colors.dark.text : Colors.light.text,
						}}
						showYAxisIndices
						noOfSections={5}
						yAxisColor={theme == 'dark' ? Colors.dark.text : Colors.light.text}
						color={theme == 'dark' ? Colors.dark.text : Colors.light.text}
						data={data}
						width={width - 75}
						isAnimated
						xAxisLabelTextStyle={{
							color: theme == 'dark' ? Colors.dark.text : Colors.light.text,
						}}
						xAxisColor={theme == 'dark' ? Colors.dark.text : Colors.light.text}
						frontColor={Colors.primary}
					/>
				</View>
			</View>
		</View>
	);
};

export default ViewsTable;
