import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import {
	Box,
	Button,
	ButtonText,
	Heading,
	Icon,
	Image,
	Text,
	View,
} from '@/components/ui';
import { useLayout } from '@react-native-community/hooks';
import { useRouter } from 'expo-router';
import { ArrowRight, ChevronRight, MoveRight } from 'lucide-react-native';

export default function SellScreen() {
	const router = useRouter();
	function handleStart() {
		router.push('/listing/add');
	}
	const { onLayout, height } = useLayout();
	return (
		<>
			<Box onLayout={onLayout} className="flex-1">
				<BodyScrollView className="flex-1">
					<View
						style={{
							height: height / 2,
						}}
						className="flex-1 mx-4 border-b-4 border-primary rounded-3xl overflow-hidden">
						<Image
							source={require('@/assets/images/landing/agent.png')}
							alt="sell banner"
							className={`object-cover object-bottom w-full flex-1 rounded-3xl`}
						/>
					</View>
					<View className="px-4 py-6 gap-4">
						<View className=" bg-background-muted rounded-xl p-6">
							<Heading size="xl">Looking to sell your Property?</Heading>
							<Text size="sm" className=" font-light mb-4 mt-2">
								Selling or renting your property has never been easier. With
								just a few simple steps, you can sell your home, reach thousands
								of potential buyers, and manage inquiries right from your phone.
								Add photos, set your price, and provide key details
							</Text>
							<Button onPress={handleStart} size="xl" className="mt-6 rounded">
								<ButtonText>Get Started</ButtonText>
								<Icon size="xl" as={MoveRight} className="text-white" />
							</Button>
						</View>
						<View className="  mt-4 rounded-xl flex-row gap-4">
							<Button
								onPress={handleStart}
								size="md"
								className="flex-1 h-12 bg-background-muted border-b-[1px] border-primary rounded">
								<ButtonText className=" text-typography">
									Browse locations
								</ButtonText>
							</Button>
							<Button
								onPress={handleStart}
								size="md"
								className="flex-1 h-12 bg-background-muted border-b-[1px] border-primary rounded">
								<ButtonText className=" text-typography">
									View properties
								</ButtonText>
							</Button>
						</View>
					</View>
				</BodyScrollView>
			</Box>
		</>
	);
}
