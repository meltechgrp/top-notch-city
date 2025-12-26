import React from "react";
import { ScrollView } from "react-native";
import { ChatItemSkeleton } from "@/components/skeleton/ChatItemSkeleton";
import { MiniEmptyState } from "@/components/shared/MiniEmptyState";
import { LogIn, MessageSquare } from "lucide-react-native";
import { router } from "expo-router";

type Props = {
  children: React.ReactNode;
  isEmpty?: Boolean;
  loading?: Boolean;
};

export default function ChatsStateWrapper({
  children,
  loading,
  isEmpty,
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
      <MiniEmptyState
        icon={MessageSquare}
        className="pt-8"
        title="Account needed"
        description="Login to enjoy this feature"
        onPress={() => router.push("/signin")}
        subIcon={LogIn}
        buttonLabel="Login / Signup"
      />
    );
  }
  return <>{children}</>;
}
