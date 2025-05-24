import withRenderVisible from '@/components/shared/withRenderOpen';
import { View } from 'react-native';
import BottomSheet from '../shared/BottomSheet';
import { Icon, Pressable, Text } from '../ui';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImageIcon } from 'lucide-react-native';
import { Divider } from '../ui/divider';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	updateImage: (image: ImagePicker.ImagePickerAsset) => void;
};

function ProfileImageBottomSheet(props: Props) {
	const { visible, onDismiss, updateImage } = props;
	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: 'images',
			aspect: [4, 3],
		});
		if (!result.canceled && result.assets.length > 0) {
			updateImage(result.assets[0]);
			onDismiss();
		}
	};
	return (
		<BottomSheet
			title="Edit profile picture"
			withHeader={true}
			snapPoint={'25%'}
			visible={visible}
			onDismiss={onDismiss}>
			<View className=" flex-1 gap-4 px-4 py-2  bg-background">
				<View className=" bg-background-muted rounded-xl">
					<Pressable
						className=" h-14 flex-row justify-between items-center p-4"
						onPress={pickImage}>
						<Text size="xl" className=" font-normal">
							Take photo
						</Text>
						<Icon as={Camera} size="xl" />
					</Pressable>
					<Divider />
					<Pressable
						className=" h-14 flex-row justify-between items-center p-4"
						onPress={pickImage}>
						<Text size="xl" className=" font-normal">
							Choose photo
						</Text>
						<Icon as={ImageIcon} size="xl" />
					</Pressable>
				</View>
			</View>
		</BottomSheet>
	);
}

export default withRenderVisible(ProfileImageBottomSheet);
