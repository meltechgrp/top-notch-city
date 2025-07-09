import withRenderVisible from "@/components/shared/withRenderOpen";
import { View } from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { Button, ButtonText, Text } from "../ui";
import { showSnackbar } from "@/lib/utils";
import { SpinningLoader } from "../loaders/SpinningLoader";
import { useState } from "react";
import { validatePhone } from "@/lib/schema";
import { useStore } from "@/store";
import { useProfileMutations } from "@/tanstack/mutations/useProfileMutations";
import { CustomInput } from "../custom/CustomInput";

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

function ProfilePhoneBottomSheet(props: Props) {
  const { visible, onDismiss } = props;
  const { me } = useStore();
  const { mutateAsync, isPending: loading } =
    useProfileMutations().updatePhoneMutation;
  const [form, setForm] = useState({
    phone: me?.phone || "",
  });
  async function handleUpload() {
    await mutateAsync(form.phone, {
      onSuccess: () => onDismiss(),
    });
  }
  return (
    <BottomSheet
      title="Update Phone Number"
      withHeader={true}
      snapPoint={"30%"}
      visible={visible}
      onDismiss={onDismiss}
    >
      <View className="flex-1 gap-4 p-4 pb-8 bg-background">
        <View className=" gap-4">
          <View className="gap-1">
            <Text size="sm" className="font-light px-2"></Text>
            <CustomInput
              title="Phone Number"
              value={form.phone}
              onUpdate={(val) => setForm({ ...form, phone: val })}
              placeholder="Phone Number"
            />
          </View>
        </View>
        <View className="flex-row gap-4">
          <Button
            className="h-11 flex-1"
            onPress={async () => {
              if (!validatePhone.safeParse(form.phone).success) {
                return showSnackbar({
                  message: "Please enter a valid phone address..",
                  type: "warning",
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

export default withRenderVisible(ProfilePhoneBottomSheet);
