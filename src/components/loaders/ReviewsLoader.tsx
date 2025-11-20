import { ReviewSkeleton } from "@/components/skeleton/ReviewSkeleton";
import React from "react";
import { ScrollView, View } from "react-native";

type Props = View["props"] & {
  loading: boolean;
  skeletonCount?: number;
  children: React.ReactNode;
  className?: string;
  headerHeight?: number;
};

export default function ReviewsLoaderWrapper({
  loading,
  skeletonCount = 5,
  children,
  style,
  className,
  headerHeight = 12,
  ...rest
}: Props) {
  if (loading) {
    return (
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          gap: 16,
          paddingVertical: headerHeight,
        }}
        showsVerticalScrollIndicator={false}
        {...rest}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ReviewSkeleton key={`skeleton-${i}`} />
        ))}
      </ScrollView>
    );
  }

  return <>{children}</>;
}
