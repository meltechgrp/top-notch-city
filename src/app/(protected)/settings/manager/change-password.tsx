import { TextInput, View } from "react-native";
import { Button, ButtonText, Text } from "@/components/ui";
import { useState } from "react";
import { validatePassword } from "@/lib/schema";
import { z } from "zod";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import { Fetch } from "@/actions/utills";
import { CustomInput } from "@/components/custom/CustomInput";
import { showErrorAlert } from "@/components/custom/CustomNotification";

const ProfileNameSchema = z.object({
  current: validatePassword,
  new: validatePassword,
  comfirm: validatePassword,
});

export default function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    current: "",
    new: "",
    comfirm: "",
  });
  async function handleUpload() {
    if (form.new !== form.comfirm) {
      return showErrorAlert({
        title: "Passwords do not match",
        alertType: "warn",
      });
    }
    try {
      setLoading(true);
      const data = await Fetch("/users/me/change-password", {
        method: "PUT",
        data: {
          current_password: form.current,
          new_password: form.new,
        },
      });
      if (data && !data?.detail) {
        showErrorAlert({
          title: "Profile name updated successfully",
          alertType: "success",
        });
      } else {
        showErrorAlert({
          title: "Failed to update.. try again",
          alertType: "warn",
        });
      }
    } catch (error) {
      showErrorAlert({
        title: "Failed to update.. try again",
        alertType: "warn",
      });
    } finally {
      setLoading(false);
    }
  }
  return (
    <View className="flex-1 gap-4 p-4 pb-8 bg-background">
      <View className=" gap-4">
        <View className="gap-1">
          <Text size="sm" className="font-light px-2">
            Current Password
          </Text>
          <CustomInput
            value={form.current}
            secureTextEntry
            onUpdate={(val) => setForm({ ...form, current: val })}
            placeholder="Current Password"
          />
        </View>
        <View className="gap-1">
          <Text size="sm" className="font-light px-2">
            New Password
          </Text>
          <CustomInput
            secureTextEntry
            value={form.new}
            onUpdate={(val) => setForm({ ...form, new: val })}
            placeholder="New Password"
          />
        </View>
        <View className="gap-1">
          <Text size="sm" className="font-light px-2">
            Comfirm Password
          </Text>
          <CustomInput
            secureTextEntry
            value={form.comfirm}
            onUpdate={(val) => setForm({ ...form, comfirm: val })}
            placeholder="Comfirm Password"
          />
        </View>
      </View>
      <View className="flex-row mt-6 gap-4">
        <Button
          className="h-12 flex-1"
          onPress={async () => {
            const validate = ProfileNameSchema.safeParse(form);
            if (!validate.success) {
              return showErrorAlert({
                title: "Passwords must be atleast 8 characters",
                alertType: "warn",
              });
            }
            await handleUpload();
          }}
        >
          {loading && <SpinningLoader />}
          <ButtonText size="lg" className=" text-white">
            Update
          </ButtonText>
        </Button>
      </View>
    </View>
  );
}
