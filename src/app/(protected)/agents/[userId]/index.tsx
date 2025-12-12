import React from "react";
import { useLocalSearchParams } from "expo-router";
import { ProfileWrapper } from "@/components/profile/ProfileWrapper";
import { useStore } from "@/store";

export default function ProfileScreen() {
  const { userId } = useLocalSearchParams() as { userId: string };
  const { me } = useStore();
  return (
    <>
      <ProfileWrapper
        tabs={["All", "Houses", "Lands", "Reviews"]}
        userType="visitor"
        userId={userId}
        isAgent={userId == me?.id}
      />
    </>
  );
}
