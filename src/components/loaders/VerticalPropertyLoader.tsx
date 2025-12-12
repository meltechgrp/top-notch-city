import React from "react";
import { ScrollView, View } from "react-native";
import { PropertySkeletonCard } from "@/components/property/PropertyCardSkeleton";

type Props = View["props"] & {
  loading: boolean;
  skeletonCount?: number;
  children: React.ReactNode;
  className?: string;
  headerHeight?: number;
  horizontal?: boolean;
};

export default function VerticalPropertyLoaderWrapper({
  loading,
  skeletonCount = 5,
  children,
  style,
  className,
  headerHeight = 12,
  horizontal = false,
  ...rest
}: Props) {
  if (loading) {
    return (
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{
          gap: 16,
          paddingVertical: headerHeight,
        }}
        horizontal={horizontal}
        showsVerticalScrollIndicator={false}
        {...rest}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <PropertySkeletonCard key={`skeleton-${i}`} />
        ))}
      </ScrollView>
    );
  }

  return <>{children}</>;
}
