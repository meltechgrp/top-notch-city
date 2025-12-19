import { useLocalSearchParams } from "expo-router";
import { ProfileWrapper } from "@/components/profile/ProfileWrapper";

export default function AdminProfile() {
  const { userId } = useLocalSearchParams() as { userId: string };

  return (
    <>
      <ProfileWrapper userType="admin" userId={userId} />
    </>
  );
}
