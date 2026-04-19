import React, { useState } from "react";
import { View } from "react-native";
import {
  Button,
  ButtonText,
  Heading,
  Icon,
  Pressable,
  Text,
} from "@/components/ui";
import { Star } from "lucide-react-native";
import { CustomInput } from "@/components/custom/CustomInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPropertyReview } from "@/actions/review";
import { showErrorAlert } from "@/components/custom/CustomNotification";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";
import BottomSheetPlain from "@/components/shared/BottomSheetPlain";
import { cn } from "@/lib/utils";
import BottomSheet from "@/components/shared/BottomSheet";

type Props = {
  visible: boolean;
  onDismiss: () => void;
  propertyId: string;
};

export default function AddReviewBottomSheet({
  visible,
  onDismiss,
  propertyId,
}: Props) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createPropertyReview,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["propertyReviews", propertyId],
      });
      showErrorAlert({
        title: "Review submitted",
        alertType: "success",
      });
      setRating(0);
      setComment("");
      onDismiss();
    },
    onError: (e) => {
      showErrorAlert({
        title: e?.message || "Failed to submit review",
        alertType: "error",
      });
    },
  });

  const handleSubmit = async () => {
    if (rating === 0) {
      return showErrorAlert({
        title: "Please select a rating",
        alertType: "warn",
      });
    }
    if (!comment.trim()) {
      return showErrorAlert({
        title: "Please add a comment",
        alertType: "warn",
      });
    }
    await mutateAsync({
      property_id: propertyId,
      rating,
      comment: comment.trim(),
    });
  };

  return (
    <BottomSheet snapPoint={["80%"]} visible={visible} onDismiss={onDismiss}>
      <View className="p-4 py-5 bg-background-muted rounded-2xl gap-4">
        <Heading size="lg" className="text-center">
          Rate this property
        </Heading>

        <View className="flex-row justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Pressable
              key={star}
              onPress={() => setRating(star)}
              className="p-1"
            >
              <Icon
                as={Star}
                size="xl"
                className={cn(
                  star <= rating
                    ? "text-primary fill-primary"
                    : "text-gray-400",
                )}
              />
            </Pressable>
          ))}
        </View>
        {rating > 0 && (
          <Text className="text-center text-sm text-typography/60">
            {rating === 1
              ? "Poor"
              : rating === 2
                ? "Fair"
                : rating === 3
                  ? "Good"
                  : rating === 4
                    ? "Very Good"
                    : "Excellent"}
          </Text>
        )}

        <View className="h-60">
          <CustomInput
            value={comment}
            onUpdate={setComment}
            placeholder="Share your experience..."
            multiline
          />
        </View>

        <Button
          onPress={handleSubmit}
          disabled={isPending}
          className="h-12 rounded-xl"
        >
          {isPending && <SpinningLoader />}
          <ButtonText>
            {isPending ? "Submitting..." : "Submit Review"}
          </ButtonText>
        </Button>
      </View>
    </BottomSheet>
  );
}
