import {
	ChevronRight,
	HeadsetIcon,
	MessageCircleQuestionIcon,
} from 'lucide-react-native';
import { Heading, HStack, Icon, Pressable, Text, VStack } from '../ui';

export const SupportSection = () => {
	return (
		<VStack space="lg">
			<Heading className="mb-1">Support</Heading>
			<HStack className="justify-between">
				<HStack space="md">
					<Icon as={MessageCircleQuestionIcon} />
					<Text>Get Help</Text>
				</HStack>
				<Pressable>
					<Icon as={ChevronRight} />
				</Pressable>
			</HStack>
			<HStack className="justify-between">
				<HStack space="md">
					<Icon as={HeadsetIcon} />
					<Text>Contact Support</Text>
				</HStack>
				<Pressable>
					<Icon as={ChevronRight} />
				</Pressable>
			</HStack>
		</VStack>
	);
};
