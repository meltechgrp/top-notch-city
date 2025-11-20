import React, { useMemo } from "react";
import { View } from "react-native";
import { PropertyEmptyState } from "@/components/property/EmptyPropertyCard";
import { MessageSquare } from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { getAgentReviews } from "@/actions/review";
import { ReviewCard } from "@/components/profile/ReviewCard";
import ReviewsLoaderWrapper from "@/components/loaders/ReviewsLoader";

type IProps = {
  profileId: string;
};

export default function ReviewsTabView({ profileId }: IProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["reviews", profileId],
    queryFn: () => getAgentReviews({ agent_id: profileId }),
  });

  const list = useMemo(() => data || [], [data]);

  if (!isLoading && list.length === 0) {
    return (
      <PropertyEmptyState
        icon={MessageSquare}
        title="No Reviews Found"
        description="Reviews will appear here once users leave feedback."
        className="px-4"
      />
    );
  }

  return (
    <ReviewsLoaderWrapper className="flex-1" loading={isLoading}>
      <View className="gap-4 px-4">
        {list?.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </View>
    </ReviewsLoaderWrapper>
  );
}
