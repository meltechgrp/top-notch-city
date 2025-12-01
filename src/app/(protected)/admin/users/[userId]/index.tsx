import { useLocalSearchParams } from "expo-router";
import { ProfileWrapper } from "@/components/profile/ProfileWrapper";

export default function AdminProfile() {
  const { userId } = useLocalSearchParams() as { userId: string };

  return (
    <>
      <ProfileWrapper
        tabs={[
          {
            label: "All",
            key: "all",
          },
          {
            label: "Properties",
            key: "houses",
          },
          {
            label: "Reviews",
            key: "reviews",
          },
          // {
          //   label: "Activities",
          //   key: "activity",
          // },
        ]}
        userType="admin"
        userId={userId}
      />
    </>
  );
}
