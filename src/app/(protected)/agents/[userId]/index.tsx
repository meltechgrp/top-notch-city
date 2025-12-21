import React from "react";
import { useLocalSearchParams } from "expo-router";
import { ProfileWrapper } from "@/components/profile/ProfileWrapper";

export default function ProfileScreen() {
  const { userId } = useLocalSearchParams() as { userId: string };
  return (
    <>
      <ProfileWrapper userType="visitor" userId={userId} />
    </>
  );
}
