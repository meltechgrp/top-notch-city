import React from "react";
import { useLocalSearchParams } from "expo-router";
import { ProfileWrapper } from "@/components/profile/ProfileWrapper";
import { useMe } from "@/hooks/useMe";

export default function ProfileScreen() {
  const { userId } = useLocalSearchParams() as { userId: string };
  const { me } = useMe();
  return (
    <>
      <ProfileWrapper
        userType="visitor"
        userId={userId}
        isAgent={userId == me?.id}
      />
    </>
  );
}
