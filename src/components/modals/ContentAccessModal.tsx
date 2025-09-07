import { Button, ButtonText, Text, View } from "@/components/ui";
import { router } from "expo-router";
import { Modal } from "react-native";
import { MotiView } from "moti";

export function ContentAccessModal({ visible, onDismiss }: AuthModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View className="flex-1 justify-center items-center bg-black/40 px-4">
        <MotiView
          from={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "timing", duration: 250 }}
          className="w-[90%] max-w-md bg-background p-6 rounded-2xl gap-2"
        >
          <Text className="text-xl font-semibold text-center">
            Let’s get you signed in ✨
          </Text>
          <Text className="text-center text-typography/80 text-sm">
            You’ll need an account to unlock this feature. Don’t worry, it only
            takes a moment!
          </Text>

          <View className="flex-row justify-center gap-3 mt-6">
            <Button
              className="px-8"
              onPress={() => {
                onDismiss?.();
                router.replace("/signin");
              }}
            >
              <ButtonText>Sign in</ButtonText>
            </Button>
            <Button onPress={onDismiss} variant="outline">
              <ButtonText>Maybe later</ButtonText>
            </Button>
          </View>
        </MotiView>
      </View>
    </Modal>
  );
}
