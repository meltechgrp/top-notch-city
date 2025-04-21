import { Stack, useLocalSearchParams } from 'expo-router';
import { Share } from 'react-native';
import * as Linking from 'expo-linking';
import { Button, View, Text, ButtonText } from '@/components/ui';
import { BodyScrollView } from '@/components/layouts/BodyScrollView';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

export default function ShareListScreen() {
	const { propertyId, name } = useLocalSearchParams() as {
		propertyId: string;
		name: string;
	};

	const shareMessage = `📍 Check out this property: ${name}!\n\nUse this code to view and collaborate:\n\n🆔 ${propertyId}\n\nDon't have the app yet? Download it on the App Store or Google Play.`;

	const handleShareProperty = async () => {
		try {
			await Share.share({ message: shareMessage });
		} catch (error) {
			console.error('Error sharing property:', error);
		}
	};
	const handleWhatsAppShare = () => {
		const message = encodeURIComponent(shareMessage);
		Linking.openURL(`whatsapp://send?text=${message}`);
	};

	const handleTelegramShare = () => {
		const message = encodeURIComponent(shareMessage);
		Linking.openURL(`tg://msg?text=${message}`);
	};

	const handleTwitterShare = () => {
		const message = encodeURIComponent(shareMessage);
		Linking.openURL(`https://twitter.com/intent/tweet?text=${message}`);
	};

	const handleFacebookShare = () => {
		const message = encodeURIComponent(shareMessage);
		Linking.openURL(`https://www.facebook.com/sharer/sharer.php?u=${message}`);
	};
	const sharePlatforms = [
		{
			name: 'WhatsApp',
			icon: <FontAwesome name="whatsapp" size={24} color="#25D366" />,
			onPress: handleWhatsAppShare,
		},
		{
			name: 'Facebook',
			icon: <FontAwesome name="facebook-square" size={24} color="#4267B2" />,
			onPress: handleFacebookShare,
		},
		{
			name: 'Twitter',
			icon: <FontAwesome name="twitter" size={24} color="#1DA1F2" />,
			onPress: handleTwitterShare,
		},
		{
			name: 'Telegram',
			icon: <FontAwesome name="send" size={24} color="#0088cc" />,
			onPress: handleTelegramShare,
		},
	];

	return (
		<>
			<Stack.Screen
				options={{
					headerTitle: 'Share',
				}}
			/>
			<BodyScrollView
				contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
				<View className="items-center mb-6 gap-1">
					<Text size="2xl" className="text-center">
						Share {name}
					</Text>
					<Text className="text-center text-gray-500 px-6">
						Send this property to friends or family and collaborate with them
						easily.
					</Text>
				</View>

				<View className="flex-row justify-around mt-6">
					{sharePlatforms.map((platform) => (
						<TouchableOpacity
							key={platform.name}
							onPress={platform.onPress}
							className="items-center">
							{platform.icon}
							<Text className="text-xs text-gray-600 mt-1">
								{platform.name}
							</Text>
						</TouchableOpacity>
					))}
				</View>
				<View className="flex-row items-center gap-4 my-6">
					<View className="flex-1 h-px bg-gray-300" />
					<Text className="text-gray-500 text-sm">or share with</Text>
					<View className="flex-1 h-px bg-gray-300" />
				</View>

				<Button size="xl" onPress={handleShareProperty} className="mt-6">
					<ButtonText>
						<Feather name="share-2" size={18} className="mr-2" /> Share via
						system
					</ButtonText>
				</Button>
			</BodyScrollView>
		</>
	);
}
