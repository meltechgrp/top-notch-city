import {
  NotLoggedInProfile,
  ProfileWrapper,
} from "@/components/profile/ProfileWrapper";
import { useUser } from "@/hooks/useUser";
import { getAuthToken } from "@/lib/secureStore";

export default function ProfileScreen() {
  const { me, isAgent } = useUser();
  const auth = getAuthToken();
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

  if (!auth && !me) return <NotLoggedInProfile userType={"owner"} />;
  return (
    <>
      <ProfileWrapper
        tabs={tabs}
        isAgent={isAgent}
        userType="owner"
        userId={auth ? me?.id : undefined}
      />
    </>
  );
}
