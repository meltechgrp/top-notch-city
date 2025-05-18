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
import { useRouter } from 'expo-router';

export default function SellScreen() {
	const router = useRouter();
	function handleStart() {
		router.push('/listing/add');
	}
	return (
		<>
			<Box className="flex-1">
				<BodyScrollView>
					<View>
						<Image
							source={require('@/assets/images/vectors/sell-banner.png')}
							alt="sell banner"
							className={`object-contain w-full h-[30rem]`}
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
