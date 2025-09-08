import withRenderVisible from "@/components/shared/withRenderOpen";
import { View } from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { Button, ButtonText, Text } from "../ui";
import { SpinningLoader } from "../loaders/SpinningLoader";
import { useState } from "react";
import { Name } from "@/lib/schema";
import { useStore } from "@/store";
import { z } from "zod";
import { useProfileMutations } from "@/tanstack/mutations/useProfileMutations";
import { CustomInput } from "../custom/CustomInput";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import Platforms from "@/constants/Plaforms";

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

const ProfileNameSchema = z.object({
  first_name: Name,
  last_name: Name,
});

function ProfileNameBottomSheet(props: Props) {
  const { visible, onDismiss } = props;
  const { me } = useStore();
  const { mutateAsync, isPending: loading } =
    useProfileMutations().updateFullNameMutation;
  const [form, setForm] = useState({
    first_name: me?.first_name || "",
    last_name: me?.last_name || "",
  });
  async function handleUpload() {
    await mutateAsync(
      {
        first_name: form.first_name,
        last_name: form.last_name,
      },
      {
        onSuccess: () => onDismiss(),
      }
    );
  }
  return (
    <BottomSheet
      title="Update profile full name"
      withHeader={true}
      snapPoint={Platforms.isAndroid() ? ["46%", "70%"] : "40%"}
      visible={visible}
      enableDynamicSizing={Platforms.isAndroid()}
      onDismiss={onDismiss}
    >
      <View className="flex-1 gap-4 p-4 pb-8 bg-background">
        <View className=" gap-4 mb-3">
          <BottomSheetTextInput
            placeholder="First name"
            value={form.first_name}
            onChangeText={(val) => setForm({ ...form, first_name: val })}
            className="h-14 mt-4 bg-background-muted px-4 text-typography rounded-xl"
          />
          <BottomSheetTextInput
            placeholder="Last name"
            value={form.last_name}
            onChangeText={(val) => setForm({ ...form, last_name: val })}
            className="h-14 my-4 bg-background-muted px-4 text-typography rounded-xl"
          />
        </View>
        <View className="flex-row gap-4">
          <Button
            className="h-11 flex-1"
            onPress={async () => {
              const validate = ProfileNameSchema.safeParse(form);
              if (!validate.success) {
                return showErrorAlert({
                  title: "Please enter valid names..",
                  alertType: "warn",
                });
              }
              await handleUpload();
            }}
          >
            {loading && <SpinningLoader />}
            <ButtonText className=" text-white">Update</ButtonText>
          </Button>
        </View>
      </View>
    </BottomSheet>
  );
}

export default withRenderVisible(ProfileNameBottomSheet);
