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
        tabs={[
          {
            label: "All",
            key: "all",
          },
          {
            label: "Houses",
            key: "houses",
          },
          {
            label: "Lands",
            key: "lands",
          },
          {
            label: "Reviews",
            key: "reviews",
          },
        ]}
        userType="visitor"
        userId={userId}
        isAgent={userId == me?.id}
      />
    </>
  );
}
