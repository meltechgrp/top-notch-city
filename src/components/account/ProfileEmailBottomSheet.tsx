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
      snapPoint={"30%"}
      visible={visible}
      onDismiss={onDismiss}
    >
      <View className="flex-1 gap-4 p-4 pb-8 bg-background">
        <CustomInput
          title="Email Address"
          className=" "
          value={form.email}
          onUpdate={(val) => setForm({ ...form, email: val })}
          placeholder="Email address"
        />
        <View className="flex-row gap-4">
          <Button
            className="h-11 flex-1"
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
