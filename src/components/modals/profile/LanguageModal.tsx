import { Modal, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import React from "react";
import { Icon, Pressable, Text, View } from "@/components/ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import ModalScreen from "@/components/shared/ModalScreen";
import { Plus } from "lucide-react-native";
import { cn } from "@/lib/utils";

export function LanguageModal({
  visible,
  value,
  onClose,
  onSave,
}: {
  visible: boolean;
  value: string;
  onClose: () => void;
  onSave: (v: string) => void;
}) {
  const [text, setText] = React.useState(value);

  React.useEffect(() => {
    setText(value);
  }, [value]);
  return (
    <ModalScreen
      visible={visible}
      title="Language"
      onDismiss={onClose}
      rightComponent={
        <Pressable
          disabled={text?.trim()?.length < 2}
          onPress={() => {
            if (text?.trim()?.length > 2) {
              onSave(text.trim());
              onClose();
            } else {
              showErrorAlert({
                title: "Enter a valid language",
                alertType: "warn",
              });
            }
          }}
          className={
            "bg-primary flex-row gap-2 items-center py-2 px-4 rounded-full"
          }
        >
          <Text className="text-center text-lg">Add</Text>
          <Icon as={Plus} />
        </Pressable>
      }
    >
      <View className="p-4">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={`Enter language`}
          placeholderTextColor="#777"
          autoCapitalize="words"
          className="bg-background-muted h-14 text-typography px-4 py-3 rounded-xl mb-6"
        />

        <View className="flex-row gap-4 mb-4">
          <Pressable
            className="py-3 flex-1 bg-background-muted rounded-xl"
            onPress={onClose}
          >
            <Text className="text-center text-primary text-lg">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </ModalScreen>
  );
}
