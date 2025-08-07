import withRenderVisible from "@/components/shared/withRenderOpen";
import { View } from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { Icon, Pressable, Text } from "../ui";
import { Camera, ImageIcon } from "lucide-react-native";
import { Divider } from "../ui/divider";
import { SpinningLoader } from "../loaders/SpinningLoader";
import { UploadResult, useMediaUpload } from "@/hooks/useMediaUpload";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  onSave: (image: UploadResult) => void;
};

function ProfileImageBottomSheet(props: Props) {
  const { visible, onDismiss, onSave } = props;
  const { pickMedia, takeMedia, loading } = useMediaUpload({
    type: "image",
    onSuccess: onSave,
    maxSelection: 1,
  });
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
            onPress={takeMedia}
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
            onPress={pickMedia}
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
