import BottomSheet from '@/components/shared/BottomSheet';
import * as React from 'react';
import { View } from 'react-native';
import { useRouter } from 'expo-router';
import {
	Button,
	ButtonText,
	Card,
	Icon,
	Image,
	ImageBackground,
	Text,
} from '../ui';
import { formatMoney } from '@/lib/utils';
import { ChevronRight, Map } from 'lucide-react-native';

type Props = {
	onDismiss: () => void;
	visible: boolean;
	data: any;
};
export default function PropertyBottomSheet(props: Props) {
	const { visible, onDismiss, data } = props;

	const router = useRouter();
	function onContinue() {
		onDismiss();
	}
	return (
		<BottomSheet
			visible={visible}
			onDismiss={onDismiss}
			addBackground={false}
			backdropVariant="xs"
			plain
			contentClassName="bg-transparent"
			snapPoint="34%">
			<View className=" gap-2 p-2 flex-1">
				<View className=" flex-row w-full gap-2">
					<Card className=" rounded-xl gap-4">
						<Text size="lg">{data.name}</Text>
						<Text size="sm" className=" ">
							Property type: Duplex
						</Text>
						<Text size="md">{formatMoney(20540000, 'NGN')}</Text>
						<Button className=" bg-primary">
							<ButtonText>View Property</ButtonText>
						</Button>
					</Card>

					<View className="flex-1">
						<ImageBackground
							source={data.image}
							className="w-full h-48 rounded-2xl bg-transparent overflow-hidden p-0">
							<View className=" items-end p-2">
								<ChevronRight color={'white'} />
							</View>
						</ImageBackground>
					</View>
				</View>
				<View className="w-full">
					<Card className="gap-4 rounded-xl w-full">
						<View className="flex-row gap-2">
							<Icon as={Map} />
							<Text size="md" className=" text-typography/80">
								Location
							</Text>
						</View>
						<Text size="xl">Warri, Delta State</Text>
					</Card>
				</View>
			</View>
		</BottomSheet>
	);
}
