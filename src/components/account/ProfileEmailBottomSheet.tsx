import withRenderVisible from "@/components/shared/withRenderOpen";
import { View } from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { Button, ButtonText, Text } from "../ui";
import { SpinningLoader } from "../loaders/SpinningLoader";
import { useState } from "react";
import { validateEmail } from "@/lib/schema";
import { useStore } from "@/store";
import { useProfileMutations } from "@/tanstack/mutations/useProfileMutations";
import { CustomInput } from "../custom/CustomInput";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import Platforms from "@/constants/Plaforms";

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

function ProfileEmailBottomSheet(props: Props) {
  const { visible, onDismiss } = props;
  const { me } = useStore();
  const { mutateAsync, isPending: loading } =
    useProfileMutations().updateEmailMutation;
  const [form, setForm] = useState({
    email: me?.email || "",
  });
  async function handleUpload() {
    await mutateAsync(form.email, {
      onSuccess: () => onDismiss(),
    });
  }
  return (
    <BottomSheet
      title="Update Email Address"
      withHeader={true}
      snapPoint={Platforms.isAndroid() ? ["35%", "60%"] : "35%"}
      visible={visible}
      enableDynamicSizing={Platforms.isAndroid()}
      onDismiss={onDismiss}
    >
      <View className="flex-1 gap-4 p-4 pb-8 bg-background">
        <BottomSheetTextInput
          placeholder="Email address"
          value={form.email}
          onChangeText={(val) => setForm({ ...form, email: val })}
          className="h-14 my-4 bg-background-muted px-4 text-typography rounded-xl"
        />
        <View className="flex-row gap-4">
          <Button
            className="h-12 rounded-xl flex-1"
            onPress={async () => {
              if (!validateEmail.safeParse(form.email).success) {
                return showErrorAlert({
                  title: "Please enter a valid email address..",
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

export default withRenderVisible(ProfileEmailBottomSheet);
