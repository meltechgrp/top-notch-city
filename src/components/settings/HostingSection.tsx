import { Blinds, ChevronRight, Tablets } from 'lucide-react-native';
import { Heading, HStack, Icon, Pressable, Text, VStack } from '../ui';

export const HostingSection = () => {
	return (
		<VStack space="lg">
			<Heading className="mb-1">Hosting</Heading>
			<HStack className="justify-between">
				<HStack space="md">
					<Icon as={Blinds} />
					<Text>Host a home</Text>
				</HStack>
				<Pressable>
					<Icon as={ChevronRight} />
				</Pressable>
			</HStack>
			<HStack className="justify-between">
				<HStack space="md">
					<Icon as={Tablets} />
					<Text>Host an experience</Text>
				</HStack>
				<Pressable>
					<Icon as={ChevronRight} />
				</Pressable>
			</HStack>
		</VStack>
	);
};
