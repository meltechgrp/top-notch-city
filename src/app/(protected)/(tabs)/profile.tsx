import {
  NotLoggedInProfile,
  ProfileWrapper,
} from "@/components/profile/ProfileWrapper";
import { useMe } from "@/hooks/useMe";

export default function ProfileScreen() {
  const { me, isAdmin, isAgent } = useMe();

  if (!me) return <NotLoggedInProfile userType={"owner"} />;
  return (
    <>
      <ProfileWrapper isAgent={isAgent} userType="owner" userId={me?.id} />
    </>
  );
}
