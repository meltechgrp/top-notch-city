import { useLocalSearchParams } from "expo-router";
import { ProfileWrapper } from "@/components/profile/ProfileWrapper";

export default function AdminProfile() {
  const { userId } = useLocalSearchParams() as { userId: string };

  return (
    <>
      <ProfileWrapper
        tabs={["All", "Properties", "Reviews"]}
        userType="admin"
        userId={userId}
      />
    </>
  );
}
