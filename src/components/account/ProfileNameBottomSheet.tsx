import withRenderVisible from "@/components/shared/withRenderOpen";
import { View } from "react-native";
import BottomSheet from "../shared/BottomSheet";
import { Button, ButtonText, Text } from "../ui";
import { showSnackbar } from "@/lib/utils";
import { SpinningLoader } from "../loaders/SpinningLoader";
import { useState } from "react";
import { Name } from "@/lib/schema";
import { useStore } from "@/store";
import { z } from "zod";
import { useProfileMutations } from "@/tanstack/mutations/useProfileMutations";
import { CustomInput } from "../custom/CustomInput";

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
      snapPoint={"46%"}
      visible={visible}
      onDismiss={onDismiss}
    >
      <View className="flex-1 gap-4 p-4 pb-8 bg-background">
        <View className=" gap-4 mb-3">
          <CustomInput
            title="First name"
            className=""
            value={form.first_name}
            onUpdate={(val) => setForm({ ...form, first_name: val })}
            placeholder="First name"
          />
          <CustomInput
            className=""
            title="Last name"
            value={form.last_name}
            onUpdate={(val) => setForm({ ...form, last_name: val })}
            placeholder="Last name"
          />
        </View>
        <View className="flex-row gap-4">
          <Button
            className="h-11 flex-1"
            onPress={async () => {
              const validate = ProfileNameSchema.safeParse(form);
              if (!validate.success) {
                return showSnackbar({
                  message: "Please enter valid names..",
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

export default withRenderVisible(ProfileNameBottomSheet);
