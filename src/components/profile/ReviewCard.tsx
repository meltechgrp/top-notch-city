import React from "react";
import { Text, View } from "@/components/ui";
import { cn, fullName } from "@/lib/utils";
import { Rating } from "@/components/agent/Rating";

interface ReviewCardProps {
  review: Review;
  className?: string;
}

export function ReviewCard({ review, className }: ReviewCardProps) {
  const formattedDate = new Date(review.created_at).toLocaleDateString();

  return (
    <View
      className={cn(
        "bg-background-muted rounded-xl p-4 mb-4 shadow-sm",
        className
      )}
    >
      <View className="flex-row justify-between mb-2">
        <Text className="text-base font-semibold text-typography">
          {fullName(review.user)}
        </Text>
        <Text className="text-xs">{formattedDate}</Text>
      </View>

      <Rating rating={review.rating} />

      <Text className="text-sm">{review.comment}</Text>
    </View>
  );
}
