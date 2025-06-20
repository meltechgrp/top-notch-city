import { composeFullAddress, formatMoney } from '@/lib/utils';
import { Heading, Icon, Text, View } from '../ui';
import PropertyCarousel from './PropertyCarousel';
import { PropertyInteractions } from './PropertyInteractions';
import { MapPin } from 'lucide-react-native';

interface Props {
	property: Property;
	width: number;
}

export function PropertyHeroSection({ property, width }: Props) {
	return (
		<View className="flex-1">
			<View className=" relative">
				<PropertyCarousel
					width={width || 400}
					factor={1.15}
					withBackdrop={true}
					loop={false}
					media={property.media}
					pointerPosition={60}
				/>
				<View className=" absolute flex-row justify-between bottom-10 left-4 right-4 w-full px-1">
					<View className="gap-2">
						<Heading size="xl" className=" text-white">
							{property.title}
						</Heading>
						<View className="self-start bg-primary p-2 rounded-xl">
							<Text size="lg" className=" text-white">
								{formatMoney(property.price, 'NGN', 0)}
							</Text>
						</View>
						<View className="flex-row items-center mt-1 gap-2">
							<Icon size="md" as={MapPin} className="text-primary" />
							<Text size="md" className=" text-white">
								{composeFullAddress(property?.address, true)}
							</Text>
						</View>
					</View>
					<PropertyInteractions interaction={property.interaction} />
				</View>
			</View>
		</View>
	);
}
