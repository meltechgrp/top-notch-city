import { ChevronRight, Settings, User } from 'lucide-react-native';
import { HStack, Icon, Pressable, Text, VStack } from '../ui';

export const PersonalInfoSection = () => {
	return (
		<VStack space="lg">
			<HStack className="justify-between">
				<HStack space="md">
					<Icon as={User} />
					<Text>Personal Info</Text>
				</HStack>
				<Pressable>
					<Icon as={ChevronRight} />
				</Pressable>
			</HStack>
			<HStack className="justify-between">
				<HStack space="md">
					<Icon as={Settings} />
					<Text>Account</Text>
				</HStack>
				<Pressable>
					<Icon as={ChevronRight} />
				</Pressable>
			</HStack>
		</VStack>
	);
};
