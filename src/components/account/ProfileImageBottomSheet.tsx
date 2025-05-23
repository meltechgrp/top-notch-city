import withRenderVisible from '@/components/shared/withRenderOpen';
import { View } from 'react-native';
import BottomSheet from '../shared/BottomSheet';
import {
	Avatar,
	AvatarImage,
	Button,
	ButtonText,
	Icon,
	Image,
	Pressable,
	Text,
} from '../ui';
import { Profile } from '@/store';
import * as ImagePicker from 'expo-image-picker';
import { Camera, ImageIcon } from 'lucide-react-native';
import { Divider } from '../ui/divider';

type Props = {
	visible: boolean;
	onDismiss: () => void;
	onUpdate: (data: Profile) => void;
	photo?: any;
};

function ProfileImageBottomSheet(props: Props) {
	const { visible, onDismiss, onUpdate, photo } = props;
	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			selectionLimit: 15,
			allowsMultipleSelection: true,
			aspect: [4, 3],
		});
		if (!result.canceled) {
			onUpdate({ photo: result.assets[0].uri });
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
