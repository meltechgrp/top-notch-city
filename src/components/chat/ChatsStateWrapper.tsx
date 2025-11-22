import React from "react";
import EmptyState, { EmptyStateProps } from "@/components/shared/EmptyState";
import { ScrollView } from "react-native";
import { ChatItemSkeleton } from "@/components/skeleton/ChatItemSkeleton";

type Props = EmptyStateProps & {
  children: React.ReactNode;
  isEmpty?: Boolean;
};

export default function ChatsStateWrapper({
  children,
  loading,
  isEmpty,
  refreshControl,
  text,
  cta,
  illustration,
  contentWrapperStyle,
  contentWrapperClassName,
}: Props) {
  if (loading) {
    return (
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          gap: 16,
          paddingVertical: 4,
        }}
        showsVerticalScrollIndicator={false}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <ChatItemSkeleton key={`skeleton-${i}`} />
        ))}
      </ScrollView>
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        illustration={illustration}
        text={text}
        cta={cta}
        refreshControl={refreshControl}
        contentWrapperStyle={contentWrapperStyle}
        contentWrapperClassName={contentWrapperClassName}
      />
    );
  }
  return <>{children}</>;
}
