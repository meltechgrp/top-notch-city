import React, { useState, useEffect } from "react";
import { Modal, View } from "react-native";
import { Text, Button, ButtonText } from "../ui";
import { cn } from "@/lib/utils";
import { CustomInput } from "@/components/custom/CustomInput";

type ConfirmationModalProps = {
  visible: boolean;
  onDismiss: () => void;
  header: string;
  description?: string;
  actionText?: string;
  confirmText?: string;
  cancelText?: string;
  requireReason?: boolean;
  propertyId?: string;
  onConfirm?: (data: { propertyId: string; reason?: string }) => Promise<void>;
  onDelete?: () => void | Promise<void>;
  className?: string;
};

export function ConfirmationModal({
  visible,
  onDismiss,
  onConfirm,
  onDelete,
  header,
  description,
  requireReason = false,
  confirmText = "Continue",
  cancelText = "Cancel",
  propertyId,
}: ConfirmationModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) {
      setReason("");
      setError("");
      setLoading(false);
    }
  }, [visible]);

  const handleConfirm = async () => {
    if (requireReason && reason.trim().length < 3) {
      setError("Please provide a valid reason (min 3 characters).");
      return;
    }

    setError("");
    setLoading(true);
    try {
      if (!propertyId) {
        await onDelete?.();
      } else {
        await onConfirm?.({ propertyId, reason });
      }
      onDismiss();
    } catch {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      backdropColor="rgba(0,0,0,0.6)"
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View className="flex-1 justify-center items-center bg-black/5 px-4">
        <View
          className={cn(
            "w-[90%] max-w-md bg-background p-6 rounded-2xl gap-1",
            requireReason && "h-[22rem]"
          )}
        >
          <Text className="text-xl font-semibold text-center">{header}</Text>
          {description && (
            <Text className="text-center text-typography/80 text-sm">
              {description}
            </Text>
          )}

          {requireReason && (
            <View className="flex-1 my-3">
              <CustomInput
                value={reason}
                onUpdate={setReason}
                placeholder="Enter your reason..."
                className={cn(error && "border-primary")}
                multiline
              />
              {error && (
                <Text className="text-xs text-primary mt-1">{error}</Text>
              )}
            </View>
          )}

          <View className="flex-row justify-center gap-3 mt-6">
            <Button variant="outline" onPress={onDismiss} disabled={loading}>
              <ButtonText>{cancelText}</ButtonText>
            </Button>
            <Button onPress={handleConfirm} disabled={loading}>
              <ButtonText>
                {loading ? "Processing..." : confirmText}
              </ButtonText>
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}
