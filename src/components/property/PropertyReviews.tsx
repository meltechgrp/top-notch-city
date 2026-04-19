import React, { useState } from "react";
import { View } from "react-native";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Button,
  ButtonText,
  Heading,
  Icon,
  Pressable,
  Text,
} from "@/components/ui";
import { Rating } from "@/components/agent/Rating";
import { useQuery } from "@tanstack/react-query";
import { getPropertyReviews } from "@/actions/review";
import { generateMediaUrlSingle } from "@/lib/api";
import { formatDateDistance, fullName } from "@/lib/utils";
import { MessageSquare, Star } from "lucide-react-native";
import AddReviewBottomSheet from "@/components/modals/property/AddReviewBottomSheet";
import { SpinningLoader } from "@/components/loaders/SpinningLoader";

type Props = {
  propertyId: string;
  me?: Account;
};

export default function PropertyReviews({ propertyId, me }: Props) {
  const [showAddReview, setShowAddReview] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const { data: reviews, isLoading } = useQuery({
    queryKey: ["propertyReviews", propertyId],
    queryFn: () => getPropertyReviews({ property_id: propertyId }),
    enabled: !!propertyId,
  });

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const displayedReviews = showAll ? reviews : reviews?.slice(0, 3);

  return (
    <>
      <View className="gap-4">
        <View className="flex-row justify-between items-center">
          <Heading size="md">Reviews</Heading>
          {me && (
            <Pressable
              onPress={() => setShowAddReview(true)}
              className="flex-row items-center gap-1 px-3 py-1.5 bg-primary rounded-full"
            >
              <Icon as={Star} className="text-white" />
              <Text className="text-white text-xs font-medium">
                Write a Review
              </Text>
            </Pressable>
          )}
        </View>

        {isLoading && <SpinningLoader />}

        {!isLoading && (!reviews || reviews.length === 0) && (
          <View className="items-center py-6 gap-2">
            <Icon as={MessageSquare} className="text-typography/30" />
            <Text className="text-typography/50 text-sm">No reviews yet</Text>
            {me && (
              <Text className="text-typography/40 text-xs">
                Be the first to review this property
              </Text>
            )}
          </View>
        )}

        {reviews && reviews.length > 0 && (
          <>
            <View className="flex-row items-center gap-3 bg-background-muted rounded-xl p-3">
              <Text className="text-3xl font-bold">{avgRating.toFixed(1)}</Text>
              <View className="flex-1">
                <Rating rating={avgRating} showValue={false} />
                <Text className="text-xs text-typography/60 mt-1">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </Text>
              </View>
            </View>

            {displayedReviews?.map((review) => (
              <PropertyReviewCard key={review.id} review={review} />
            ))}

            {reviews.length > 3 && (
              <Pressable onPress={() => setShowAll(!showAll)}>
                <Text className="text-primary text-sm text-center font-medium">
                  {showAll ? "Show less" : `See all ${reviews.length} reviews`}
                </Text>
              </Pressable>
            )}
          </>
        )}
      </View>

      <AddReviewBottomSheet
        visible={showAddReview}
        onDismiss={() => setShowAddReview(false)}
        propertyId={propertyId}
      />
    </>
  );
}

function PropertyReviewCard({ review }: { review: PropertyReview }) {
  const reviewer = review.user;
  const name = reviewer ? fullName(reviewer) : "Anonymous";

  return (
    <View className="bg-background-muted rounded-xl p-4 gap-2">
      <View className="flex-row items-center gap-3">
        <Avatar className="w-9 h-9 bg-gray-500">
          <AvatarFallbackText className="text-sm">{name}</AvatarFallbackText>
          {reviewer?.profile_image && (
            <AvatarImage
              source={{
                uri: generateMediaUrlSingle(reviewer.profile_image),
                cache: "force-cache",
              }}
            />
          )}
        </Avatar>
        <View className="flex-1">
          <Text className="text-sm font-medium">{name}</Text>
          <Text className="text-xs text-typography/50">
            {formatDateDistance(review.created_at)}
          </Text>
        </View>
      </View>
      <Rating rating={review.rating} showValue={false} size={14} />
      {!!review.comment && (
        <Text className="text-sm text-typography/80">{review.comment}</Text>
      )}
    </View>
  );
}
