import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import {
	Box,
	Button,
	ButtonText,
	Heading,
	Image,
	Text,
	View,
} from '@/components/ui';
import { useLayout } from '@react-native-community/hooks';
import { useRouter } from 'expo-router';

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
						className="flex-1 mx-4 rounded-3xl overflow-hidden">
						<Image
							source={require('@/assets/images/landing/agent.png')}
							alt="sell banner"
							className={`object-cover object-bottom w-full flex-1 rounded-3xl`}
						/>
					</View>
					<View className="px-4 py-6 gap-4">
						<Heading size="xl">Looking to list your Property?</Heading>
						<Text size="sm" className=" font-light mb-4">
							Selling or renting your property has never been easier. With just
							a few simple steps, you can list your home, reach thousands of
							potential buyers, and manage inquiries right from your phone. Add
							photos, set your price, and provide key details
						</Text>
						<Button onPress={handleStart} size="xl">
							<ButtonText>Get Started</ButtonText>
						</Button>
					</View>
				</BodyScrollView>
			</Box>
		</>
	);
}
