import { Box, Heading, Icon, Text, View } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useLayout } from '@react-native-community/hooks';
import { House } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

type Props = {
	option: string;
	onUpdate: (option: string) => void;
};

export default function ListingCategory({ option, onUpdate }: Props) {
	const { width, onLayout } = useLayout();
	return (
		<>
			<Box className="flex-1 py-2 px-4">
				<View className="  gap-2 flex-1">
					<Heading size="xl">Share Details About Your Property</Heading>
					<View onLayout={onLayout} className="py-4 gap-8">
						{data.map((section) => (
							<View key={section.title} className="gap-3">
								<View className="">
									<Text size="xl" className="font-light">
										{section.title}
									</Text>
								</View>
								<View className="flex-row flex-wrap gap-5 justify-between">
									{section.data.map((item) => (
										<TouchableOpacity
											key={item.label}
											style={{
												width: width / 2.15,
												minWidth: width / 2.3,
												maxWidth: width / 2.1,
											}}
											className="flex-1"
											onPress={() => onUpdate(item.value)}>
											<View
												className={cn(
													' gap-2 p-4 rounded-2xl bg-background-muted border-b-4 border-background-muted',
													option == item.value && 'border-primary'
												)}>
												<View
													className={cn(
														' bg-background self-center rounded-full p-2 mb-2 shadow',
														option == item.value && 'bg-primary'
													)}>
													<Icon as={item.icon} size="xl" />
												</View>
												<Text size="lg" className=" text-center">
													{item.label}
												</Text>
											</View>
										</TouchableOpacity>
									))}
								</View>
							</View>
						))}
					</View>
				</View>
			</Box>
		</>
	);
}

const data = [
	{
		title: ' Residential Property',
		data: [
			{
				label: 'Bungalow',
				value: 'bungalow',
				icon: House,
			},
			{
				label: 'Duplex',
				value: 'duplex',
				icon: House,
			},
			{
				label: 'Flat',
				value: 'flat',
				icon: House,
			},
			{
				label: 'Mansion',
				value: 'mansion',
				icon: House,
			},
		],
	},
	{
		title: ' Commercial Property',
		data: [
			{
				label: 'Office Buildings',
				value: 'office-buildings',
				icon: House,
			},
			{
				label: 'Shops',
				value: 'shops',
				icon: House,
			},
			{
				label: 'Plazas and Malls',
				value: 'plaza-mall',
				icon: House,
			},
			{
				label: 'Hotels',
				value: 'hotels',
				icon: House,
			},
		],
	},
];
