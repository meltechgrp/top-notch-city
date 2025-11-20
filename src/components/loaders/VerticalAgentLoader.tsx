import { AgentSkeletonCard } from "@/components/agents/AgentSkeletonCard";
import { cn } from "@/lib/utils";
import { FlatList, View } from "react-native";

type Props = View["props"] & {
  loading: boolean;
  skeletonCount?: number;
  children: React.ReactNode;
  className?: string;
  headerHeight?: number;
};

export default function VerticalAgentLoaderWrapper({
  loading,
  skeletonCount = 10,
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
        className={"flex-1 px-4"}
        contentContainerClassName={cn("", className)}
        renderItem={() => <AgentSkeletonCard />}
        contentContainerStyle={{ gap: 8, paddingTop: headerHeight }}
        showsVerticalScrollIndicator={false}
        {...rest}
      />
    );
  }

  return children;
}
