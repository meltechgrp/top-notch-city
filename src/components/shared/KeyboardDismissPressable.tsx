import React, { PropsWithChildren } from "react";
import {
  Keyboard,
  TextInput,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  Platform,
} from "react-native";

export const KeyboardDismissPressable = ({
  children,
  className,
}: PropsWithChildren & { className?: string }) => {
  const dismissKeyboard = (event: any) => {
    const target = event?.target;

    if (target) {
      // If the platform is Android, the target is a native tag number.
      // On iOS, it may be an internal node object.
      const currentlyFocusedInput = TextInput.State.currentlyFocusedInput?.();

      if (currentlyFocusedInput && target === currentlyFocusedInput) {
        // Tapped inside a TextInput — don’t dismiss
        return;
      }
    }

    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback
      onPress={dismissKeyboard}
      touchSoundDisabled={true}
      style={styles.container}
      className="flex-1"
    >
      <View style={styles.container} className={className}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
