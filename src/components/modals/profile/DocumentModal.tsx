import { KeyboardAvoidingView, Modal, Platform, TextInput } from "react-native";
import { ImageIcon, X } from "lucide-react-native";
import { Icon, Image, Pressable, Text, View } from "@/components/ui";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import { generateMediaUrlSingle } from "@/lib/api";

export function DocumentModal({
  visible,
  onClose,
  onSave,
  selected,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (d: AgentDocument) => void;
  selected: string;
}) {
  const [form, setForm] = useState<AgentDocument>({
    document_types: selected,
    documents: "",
    documents_ids: "",
  });
  const [media, setMedia] = useState<Media>();
  const { pickMedia, loading, processFiles } = useMediaUpload({
    onSuccess: (media) => {
      setForm((p) => ({ ...p, documents_ids: media[0].id }));
      setMedia(media[0]);
    },
    onFiles: (media) => {
      processFiles(media);
    },
    maxSelection: 1,
    type: "image",
  });

  const update = (key: keyof AgentDocument, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const save = () => {
    if (!form.documents_ids?.trim())
      return showErrorAlert({
        title: "Please add a Document",
        alertType: "warn",
      });
    onSave(form);
    onClose();
    setForm({
      document_types: "",
      documents: "",
      documents_ids: "",
    });
  };
  useEffect(
    () => setForm((p) => ({ ...p, document_types: selected })),
    [selected]
  );
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
          className="max-h-[90%] rounded-3xl bg-background flex-1"
        >
          <SafeAreaView
            edges={["left", "right", "top"]}
            className="max-h-[85%] flex-1 rounded-t-3xl bg-background"
          >
            <View className="bg-background p-6 rounded-t-3xl">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-semibold capitalize">
                  {selected}
                </Text>
                <Pressable onPress={onClose}>
                  <X size={22} color="#fff" />
                </Pressable>
              </View>

              <View className="mb-4">
                <Text className="mb-1 capitalize">Document ID (Optional)</Text>
                <TextInput
                  value={form.documents}
                  onChangeText={(v) => update("documents", v)}
                  placeholder={`Enter document id (Optional)`}
                  placeholderTextColor="#777"
                  autoCapitalize="none"
                  className="bg-background-muted text-typography h-12 px-3 rounded-xl"
                />
              </View>
              <View className="mb-4">
                <Text className="mb-1 capitalize">Document File</Text>
                <Pressable
                  onPress={pickMedia}
                  disabled={loading || !!form.documents_ids}
                  className="w-full h-48 bg-background-muted border border-outline-100 rounded-xl overflow-hidden"
                >
                  {form.documents_ids && media ? (
                    <Image
                      source={{
                        uri: generateMediaUrlSingle(media.url),
                      }}
                      alt="file"
                    />
                  ) : (
                    <View className="w-full h-full justify-center items-center">
                      <Icon as={ImageIcon} size={40} />
                      <Text>Upload document</Text>
                    </View>
                  )}
                </Pressable>
              </View>
              <Pressable
                onPress={save}
                className="bg-primary py-3 rounded-xl mt-2 items-center"
              >
                <Text className="text-base">Save Document</Text>
              </Pressable>
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
