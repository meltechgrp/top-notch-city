import { ProfileWrapper } from "@/components/profile/ProfileWrapper";
import { useUser } from "@/hooks/useUser";

export default function ProfileScreen() {
  const { me, isAgent } = useUser();
  const tabs = [
    {
      label: "All",
      key: "all",
    },
    {
      label: "Properties",
      key: "houses",
    },
    {
      label: "Saved",
      key: "saved",
    },
    ...[
      isAgent && {
        label: "Reviews",
        key: "reviews",
      },
    ],
  ].filter((s) => !!s);
  return (
    <>
      <ProfileWrapper
        tabs={tabs}
        isAgent={isAgent}
        userType="owner"
        userId={me?.id}
      />
    </>
  );
}
