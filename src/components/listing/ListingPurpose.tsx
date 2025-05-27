import { Box, Heading, HStack, Icon, Image, Text, View } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useLayout } from '@react-native-community/hooks';
import { KeyRound, RectangleEllipsis } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

type Props = {
	option: string;
	onUpdate: (option: string) => void;
};

export default function ListingPurpose({ option, onUpdate }: Props) {
	const { onLayout, height } = useLayout();
	return (
		<>
			<Box onLayout={onLayout} className="flex-1 py-6 px-4">
				<View
					style={{
						height: height / 3,
					}}
					className="flex-1 min-h-60 rounded-3xl overflow-hidden">
					<Image
						source={require('@/assets/images/vectors/bookshelf.jpg')}
						alt="sell banner"
						className={`object-cover w-full flex-1 rounded-3xl`}
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
									' gap-2 p-4 rounded-2xl min-h-32 border-b-4 border-b-background-muted bg-background-muted ',
									option == 'rent' && 'border-primary'
								)}>
								<View
									className={cn(
										'  bg-background self-center rounded-full p-3 mb-2',
										option == 'rent' && 'bg-primary'
									)}>
									<Icon
										size="xl"
										as={KeyRound}
										className={option == 'rent' ? 'text-white' : ''}
									/>
								</View>
								<Text size="xl" className="text-center font-bold">
									Rent Property
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							className="flex-1"
							onPress={() => onUpdate('sell')}>
							<View
								className={cn(
									' gap-2 p-4 rounded-2xl min-h-32 border-b-4 border-b-background-muted bg-background-muted ',
									option == 'sell' && 'border-primary'
								)}>
								<View
									className={cn(
										'  bg-background self-center rounded-full p-3 mb-2',
										option == 'sell' && 'bg-primary'
									)}>
									<Icon
										size="xl"
										as={RectangleEllipsis}
										className={option == 'sell' ? 'text-white' : ''}
									/>
								</View>
								<Text size="xl" className="text-center font-bold">
									Sell Property{' '}
								</Text>
							</View>
						</TouchableOpacity>
					</HStack>
				</View>
			</Box>
		</>
	);
}
