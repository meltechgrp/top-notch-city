import { Box, Heading, HStack, Icon, Image, Text, View } from '@/components/ui';
import { cn } from '@/lib/utils';
import { KeyRound, RectangleEllipsis } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

type Props = {
	option: string;
	onUpdate: (option: string) => void;
};

export default function ListingPurpose({ option, onUpdate }: Props) {
	return (
		<>
			<Box className="flex-1 py-6 px-4">
				<View>
					<Image
						source={require('@/assets/images/vectors/bookshelf.jpg')}
						alt="sell banner"
						className={`object-cover w-full h-[20rem] rounded-xl`}
					/>
				</View>
				<View className=" py-6 gap-4">
					<Heading size="xl">What Would You Like to Do Today?</Heading>
					<Text size="sm" className=" font-light mb-4">
						Ready to make a move? Choose whether you want to sell your property
						for a great deal or rent it out for steady income. Select an option
						below, and we’ll guide you through a seamless process tailored to
						your needs.
					</Text>
					<HStack className="py-4 gap-5">
						<TouchableOpacity
							className="flex-1"
							onPress={() => onUpdate('rent')}>
							<View
								className={cn(
									' gap-2 p-4 rounded-2xl border border-outline-2',
									option == 'rent' && 'border-primary'
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
						<TouchableOpacity
							className="flex-1"
							onPress={() => onUpdate('sell')}>
							<View
								className={cn(
									' gap-2 p-4 rounded-2xl border border-outline-2',
									option == 'sell' && 'border-primary'
								)}>
								<View className=" border-[0.4px] border-primary self-start rounded-full p-2 mb-2">
									<Icon
										as={RectangleEllipsis}
										className="text-primary w-4 h-4"
									/>
								</View>
								<Text>Sell My Property </Text>
								<Text size="xs" className=" font-light">
									(Maximize your profit with expert valuation & fast sales!)
								</Text>
							</View>
						</TouchableOpacity>
					</HStack>
				</View>
			</Box>
		</>
	);
}
