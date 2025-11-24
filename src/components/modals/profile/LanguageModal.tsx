import { Modal, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import React from "react";
import { Pressable, Text, View } from "@/components/ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { showErrorAlert } from "@/components/custom/CustomNotification";

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
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-end android:justify-center bg-black/10">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "padding"}
          className="bg-background p-6 gap-4 rounded-t-2xl android:rounded-2xl"
        >
          <SafeAreaView
            edges={["bottom"]}
            className=" bg-background pb-6 rounded-t-2xl"
          >
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
              <Pressable
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
                className="bg-primary py-3 flex-1 rounded-xl"
              >
                <Text className="text-center text-lg">Continue</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
