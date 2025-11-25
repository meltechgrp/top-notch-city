import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  TextInput,
  ScrollView,
} from "react-native";
import { X } from "lucide-react-native";
import { Pressable, Text, View } from "@/components/ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { showErrorAlert } from "@/components/custom/CustomNotification";

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
        title: "Please enter the name of your company",
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
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/80 justify-end">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          className="max-h-[95%] bg-background flex-1"
        >
          <SafeAreaView
            edges={["bottom", "left", "right"]}
            className="bg-background rounded-t-3xl"
          >
            <View className="bg-background p-6 rounded-t-3xl">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold">Add Company</Text>
                <Pressable onPress={onClose}>
                  <X size={22} color="#fff" />
                </Pressable>
              </View>

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

              {(["address", "email", "phone"] as const).map((key) => (
                <View className="mb-4" key={key}>
                  <Text className="mb-1 capitalize">{key}</Text>
                  <TextInput
                    value={form[key] || ""}
                    onChangeText={(v) => update(key, v)}
                    placeholder={`Enter ${key} (Optional)`}
                    placeholderTextColor="#777"
                    autoCapitalize="none"
                    className="bg-background-muted text-typography h-12 px-3 rounded-xl"
                  />
                </View>
              ))}
              <Pressable
                onPress={save}
                className="bg-primary py-3 rounded-xl mt-2 items-center"
              >
                <Text className="text-base">Save Company</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
