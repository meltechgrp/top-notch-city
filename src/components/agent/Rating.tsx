"use client";

import React from "react";
import { Pressable, Text, View } from "@/components/ui";
import { Star, StarHalf, Star as StarOutline } from "lucide-react-native";
import { formatNumberCompact } from "@/lib/utils";

interface RatingProps {
  rating: number;
  total?: number;
  size?: number;
  showValue?: boolean;
}

export function Rating({
  rating,
  total,
  size = 16,
  showValue = true,
}: RatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.25 && rating % 1 <= 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View className="flex-row items-center">
      {showValue && <Text className="mr-2 text-sm">{rating.toFixed(1)}</Text>}
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`full-${i}`} size={size} color="#FF4C00" fill="#FF4C00" />
      ))}

      {hasHalfStar && <StarHalf size={size} color="#FF4C00" fill="#FF4C00" />}

      {Array.from({ length: emptyStars }).map((_, i) => (
        <StarOutline
          key={`empty-${i}`}
          size={size}
          color="#9CA3AF"
          fill="#9CA3AF"
        />
      ))}
      {showValue && !!total && (
        <Pressable>
          <View className="ml-3 flex-row gap-2">
            <Text className="text-sm">{formatNumberCompact(total)}</Text>
            <Text className="text-sm text-typography/80">Reviews</Text>
          </View>
        </Pressable>
      )}
    </View>
  );
}
