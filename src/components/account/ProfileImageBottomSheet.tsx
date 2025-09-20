import withRenderVisible from "@/components/shared/withRenderOpen";
import { View } from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { Icon, Pressable, Text } from "../ui";
import * as ImagePicker from "expo-image-picker";
import { Camera, ImageIcon } from "lucide-react-native";
import { Divider } from "../ui/divider";
// import { useMediaCompressor } from "@/hooks/useMediaCompressor";
import { SpinningLoader } from "../loaders/SpinningLoader";
import { useProfileMutations } from "@/tanstack/mutations/useProfileMutations";
import { showErrorAlert } from "@/components/custom/CustomNotification";

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

function ProfileImageBottomSheet(props: Props) {
  const { visible, onDismiss } = props;
  // const { compress, compressing, error: comError } = useMediaCompressor();
  const { mutateAsync, isPending: loading } =
    useProfileMutations().updatePhotoMutation;
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets.length > 0) {
      await handleUpload(result.assets[0].uri);
    }
  };

  const takeImage = async () => {
    const permitted = await ImagePicker.getCameraPermissionsAsync();
    if (
      permitted.status == ImagePicker.PermissionStatus.DENIED ||
      permitted.status == ImagePicker.PermissionStatus.UNDETERMINED
    ) {
      return await ImagePicker.requestCameraPermissionsAsync();
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: "images",
      cameraType: ImagePicker.CameraType.back,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled) {
      await handleUpload(result.assets[0].uri);
    }
  };
  async function handleUpload(uri: string) {
    // const result = await compress({
    //   type: "image",
    //   uri: uri,
    //   compressionRate: 0.4,
    // });
    // if (c
    await mutateAsync(
      {
        image: uri,
      },
      {
        onSuccess: () => onDismiss(),
      }
    );
  }
  return (
    <BottomSheet
      title="Update profile picture"
      withHeader={true}
      snapPoint={"25%"}
      visible={visible}
      onDismiss={onDismiss}
    >
      <View className=" flex-1 gap-4 px-4 py-2  bg-background">
        <View className=" bg-background-muted rounded-xl">
          <Pressable
            disabled={loading}
            className=" h-14 flex-row justify-between items-center p-4"
            onPress={takeImage}
          >
            <Text size="xl" className=" font-normal">
              Take photo
            </Text>
            {loading ? (
              <SpinningLoader />
            ) : (
              <Icon as={Camera} size="xl" className="text-typography" />
            )}
          </Pressable>
          <Divider />
          <Pressable
            disabled={loading}
            className=" h-14 flex-row justify-between items-center p-4"
            onPress={pickImage}
          >
            <Text size="xl" className=" font-normal">
              Choose photo
            </Text>
            {loading ? (
              <SpinningLoader />
            ) : (
              <Icon as={ImageIcon} size="xl" className="text-typography" />
            )}
          </Pressable>
        </View>
      </View>
    </BottomSheet>
  );
}

export default withRenderVisible(ProfileImageBottomSheet);
