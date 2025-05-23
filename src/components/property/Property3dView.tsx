import { ImageBackground, Pressable, Text, View } from '@/components/ui';
import { useRouter } from 'expo-router';
import { Focus } from 'lucide-react-native';

type Props = {
	id: string;
	image: any;
};

export default function Property3DView({ id, image }: Props) {
	const router = useRouter();
	return (
		<View className=" px-4">
			<ImageBackground source={image} className=" flex-1 h-[20rem]">
				<View className="flex-1  gap-1 items-center justify-center bg-black/30">
					<Text size="2xl" className="text-white font-bold">
						3D View
					</Text>
					<Pressable
						onPress={() =>
							router.push({
								pathname: '/property/[propertyId]/3d-view',
								params: { propertyId: id },
							})
						}>
						<Focus size={42} color={'red'} />
					</Pressable>
				</View>
			</ImageBackground>
		</View>
	);
}
