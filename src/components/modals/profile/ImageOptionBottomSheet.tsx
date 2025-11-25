import BottomSheet from "@/components/shared/BottomSheet";
import { Button, ButtonText, Icon } from "@/components/ui";
import { Camera, Images, Trash2 } from "lucide-react-native";
import { View } from "react-native";
type ModalProps = {
  visible: boolean;
  onDismiss: () => void;
  pickMedia: () => void;
  takeMedia: () => void;
  deleteMedia?: () => void;
};
export default function ImageOptionBottomSheet({
  visible,
  onDismiss,
  pickMedia,
  takeMedia,
  deleteMedia,
}: ModalProps) {
  return (
    <BottomSheet
      visible={visible}
      onDismiss={onDismiss}
      snapPoint={["35%"]}
      title="Edit profile picture"
      withHeader
    >
      <View className="p-4 my-4">
        <View className=" bg-background-muted rounded-2xl">
          <Button
            size="xl"
            className=" rounded-none h-14 justify-between border-0  border-b border-outline-100 items-center"
            variant="outline"
            onPress={pickMedia}
          >
            <ButtonText size="sm" className="text-typography text-base">
              Choose photo
            </ButtonText>
            <Icon as={Images} />
          </Button>
          <Button
            size="xl"
            className=" rounded-none h-14 justify-between border-0  border-b border-outline-100  items-center"
            onPress={takeMedia}
            variant="outline"
          >
            <ButtonText size="sm" className="text-typography text-base">
              Take photo
            </ButtonText>
            <Icon as={Camera} />
          </Button>
          <Button
            size="xl"
            className=" rounded-none h-14 justify-between border-0  items-center"
            variant="outline"
            onPress={deleteMedia}
          >
            <ButtonText size="sm" className="text-primary">
              Delete photo
            </ButtonText>
            <Icon as={Trash2} className="text-primary" />
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}
