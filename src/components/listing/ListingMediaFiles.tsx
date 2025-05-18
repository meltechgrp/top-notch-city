import { Box, Heading, HStack, Icon, Image, Text, View } from '@/components/ui';
import { cn } from '@/lib/utils';
import { KeyRound, RectangleEllipsis } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export default function ListingMediaFiles() {
	return (
		<>
			<Box className="flex-1 py-6 px-4">
				<View className=" py-6 gap-4">
					<Heading size="xl">
						Bring Your Property to Life with Photos and Video
					</Heading>
					<Text size="sm" className=" font-light mb-4">
						Ready to make a move? Choose whether you want to sell your property
						for a great deal or rent it out for steady income. Select an option
						below, and we’ll guide you through a seamless process tailored to
						your needs.
					</Text>
					<HStack className="py-4 gap-5">
						<TouchableOpacity className="flex-1" onPress={() => {}}>
							<View
								className={cn(
									' gap-2 p-4 rounded-2xl border border-outline-2'
									// option == 'rent' && 'border-primary'
								)}>
								<View className=" border-[0.4px] self-start border-primary rounded-full p-2 mb-2">
									<Icon as={KeyRound} className="text-primary w-4 h-4" />
								</View>
								<Text>Rent My Property</Text>
								<Text size="xs" className=" font-light">
									(Earn passive income with trusted tenants!)
								</Text>
							</View>
						</TouchableOpacity>
					</HStack>
				</View>
			</Box>
		</>
	);
}
