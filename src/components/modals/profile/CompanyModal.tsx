import { TextInput } from "react-native";
import { Plus, Save, X } from "lucide-react-native";
import { Icon, Pressable, Text, View } from "@/components/ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import ModalScreen from "@/components/shared/ModalScreen";

export type Company = {
  name: string;
  address?: string;
  email?: string;
  phone?: string;
  website?: string;
};

export function CompanyModal({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (c: Company) => void;
}) {
  const [form, setForm] = useState<Company>({
    name: "",
    address: "",
    email: "",
    phone: "",
    website: "",
  });

  const update = (key: keyof Company, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const save = () => {
    if (!form.name.trim())
      return showErrorAlert({
        title: "Company/Organisation must have a name",
        alertType: "warn",
      });
    if (!form?.phone?.trim())
      return showErrorAlert({
        title: "Please enter phone number",
        alertType: "warn",
      });
    onSave(form);
    onClose();
    setForm({
      name: "",
      address: "",
      email: "",
      phone: "",
      website: "",
    });
  };

  return (
    <ModalScreen
      title="Add Company"
      visible={visible}
      onDismiss={onClose}
      withScroll
      rightComponent={
        <Pressable
          onPress={save}
          className="bg-primary flex-row gap-2 py-2 px-4 rounded-full items-center"
        >
          <Text className="text-base">Save</Text>
          <Icon as={Plus} />
        </Pressable>
      }
    >
      <View className="bg-background p-6 h-90 rounded-t-3xl">
        <View className="mb-4">
          <Text className="mb-1">Company Name *</Text>
          <TextInput
            value={form.name}
            onChangeText={(v) => update("name", v)}
            placeholder="Enter company name"
            placeholderTextColor="#777"
            className="bg-background-muted h-12 text-typography px-3 rounded-xl"
          />
        </View>

        {(["phone", "address", "email"] as const).map((key) => (
          <View className="mb-4" key={key}>
            <Text className="mb-1 capitalize">{key}</Text>
            <TextInput
              value={form[key] || ""}
              onChangeText={(v) => update(key, v)}
              placeholder={`Enter ${key} ${key == "phone" ? "line" : "(Optional)"}`}
              placeholderTextColor="#777"
              autoCapitalize="none"
              className="bg-background-muted text-typography h-12 px-3 rounded-xl"
            />
          </View>
        ))}
      </View>
    </ModalScreen>
  );
}
