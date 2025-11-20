import React, { useMemo } from "react";
import { View } from "react-native";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getUserActivities } from "@/actions/user";
import ActivityListItem from "@/components/admin/users/ActivityListItem";
import { PropertyEmptyState } from "@/components/property/EmptyPropertyCard";
import ReviewsLoaderWrapper from "@/components/loaders/ReviewsLoader";
import { Activity } from "lucide-react-native";

type IProps = {
  profileId: string;
  className?: string;
};
const ActivityTabView = ({ profileId }: IProps) => {
  const { data, isLoading } = useInfiniteQuery({
    queryKey: ["activities", profileId],
    queryFn: ({ pageParam = 1 }) =>
      getUserActivities({ userId: profileId!, pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage;
      return page < pages ? page + 1 : undefined;
    },
  });
  const activities = useMemo(
    () => data?.pages.flatMap((item) => item.results) || [],
    [data]
  );

  if (!isLoading && activities.length === 0) {
    return (
      <PropertyEmptyState
        icon={Activity}
        title="No Activity Found"
        description="Activity will appear here soon."
        className="px-4"
      />
    );
  }

  return (
    <ReviewsLoaderWrapper className="flex-1" loading={isLoading}>
      <View className="gap-4 px-4">
        {activities?.map((activity) => (
          <ActivityListItem
            onPress={(data) => {}}
            key={activity.id}
            activity={activity}
          />
        ))}
      </View>
    </ReviewsLoaderWrapper>
  );
};

export default ActivityTabView;
