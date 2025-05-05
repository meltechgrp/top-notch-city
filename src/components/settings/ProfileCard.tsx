import { ChevronRight } from 'lucide-react-native';
import {
	Avatar,
	AvatarFallbackText,
	AvatarImage,
	HStack,
	Icon,
	Link,
	Pressable,
	Text,
	VStack,
} from '../ui';

export const ProfileCard = () => {
	return (
		<HStack className="justify-between items-center">
			<HStack space="md">
				<Avatar className="bg-primary-500">
					<AvatarFallbackText>Humphrey Joshua</AvatarFallbackText>
					<AvatarImage
						source={{
							uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
						}}
					/>
				</Avatar>
				<VStack>
					<Text>Humphrey Joshua</Text>
					<Link href={'/(protected)/(tabs)/home'}>
						<Text
							size="sm"
							className="text-typography/80 no-underline hover:text-typography-500 active:text-typography-500">
							Show Profile
						</Text>
					</Link>
				</VStack>
			</HStack>
			<Pressable>
				<Icon as={ChevronRight} />
			</Pressable>
		</HStack>
	);
};
