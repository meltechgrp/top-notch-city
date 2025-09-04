import React, { useEffect, useState } from "react";
import {
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useAudioRecorder, AudioModule, RecordingPresets } from "expo-audio";
import { cn } from "@/lib/utils";
import { Text, View } from "@/components/ui";
import { Fetch } from "@/actions/utills";

interface VoiceModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  onUpload: (data: Property[]) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({
  visible,
  onClose,
  title = "Speak now",
  onUpload,
}) => {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initPermissions = async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission required", "Microphone access is needed");
      }
    };
    initPermissions();
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      setIsRecording(true);

      await audioRecorder.prepareToRecordAsync({
        extension: ".wav",
      });
      audioRecorder.record();
    } catch (err: any) {
      setError(err.message || "Recording failed");
      setIsRecording(false);
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorder.stop();

      const uri = audioRecorder.uri;
      setIsRecording(false);
      if (uri) {
        await uploadRecording(uri);
      }
    } catch (err: any) {
      setError(err.message || "Failed to stop recording");
    }
  };

  const uploadRecording = async (uri: string) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("voice_file", {
        uri,
        name: "audio.wav",
        type: "audio/wav",
      } as any);

      const res = await Fetch("/properties/search/voice", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
      });
      if (res?.detail) {
        throw new Error("Failed to send");
      }
      onClose();
      return onUpload(res.results.results);
    } catch (err: any) {
      setError("Failed to upload audio");
    } finally {
      setLoading(false);
    }
  };

  //   const uploadRecording = async (uri: string) => {
  //     try {
  //       setLoading(true);

  //       const res = await voiceSearchProperties(uri);
  //       if (res) {
  //         const properties = res.results || [];
  //         onUpload(properties);
  //       }
  //     } catch (err: any) {
  //       setError("Failed to upload audio");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/60">
        <View className="bg-background-muted p-6 rounded-2xl w-11/12 items-center">
          <Text className="text-2xl font-semibold text-center mb-2">
            {title}
          </Text>
          <Text className="text-sm mb-8 font-semibold text-center">
            Example: Properties around port harcourt..
          </Text>

          {(loading || isRecording) && (
            <ActivityIndicator size="large" color="#4B9CD3" />
          )}

          {error && <Text className="text-red-500 text-sm mb-2">{error}</Text>}

          <View className="flex-row gap-4 mt-2">
            <TouchableOpacity
              className={cn(
                "px-6 py-3 rounded-xl",
                isRecording ? "bg-primary" : "bg-gray-500"
              )}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Text className="text-white text-lg">
                {isRecording ? "Done" : "🎤 Start"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-gray-300 px-8 py-3 rounded-xl"
              onPress={() => {
                if (isRecording) stopRecording();
                onClose();
              }}
            >
              <Text className="text-gray-800 text-lg">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
