import { PropertySkeletonCard } from "@/components/property/PropertyCardSkeleton";
import { cn } from "@/lib/utils";
import { FlatList, View } from "react-native";

type Props = View["props"] & {
  loading: boolean;
  skeletonCount?: number;
  children: React.ReactNode;
  className?: string;
  headerHeight?: number;
};

export default function VerticalPropertyLoaderWrapper({
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
      <FlatList
        data={Array.from({ length: skeletonCount })}
        keyExtractor={(_, i) => `skeleton-${i}`}
        className={"flex-1"}
        contentContainerClassName={cn("", className)}
        renderItem={() => <PropertySkeletonCard />}
        contentContainerStyle={{ gap: 16, paddingVertical: headerHeight }}
        showsVerticalScrollIndicator={false}
        {...rest}
      />
    );
  }

  return children;
}
