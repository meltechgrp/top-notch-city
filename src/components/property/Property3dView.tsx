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
		<ImageBackground source={image.path} className=" flex-1">
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
	);
}
