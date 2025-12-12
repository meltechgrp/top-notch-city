import {
  NotLoggedInProfile,
  ProfileWrapper,
} from "@/components/profile/ProfileWrapper";
import { useStore } from "@/store";
import { useShallow } from "zustand/react/shallow";

export default function ProfileScreen() {
  const { me, isAdmin, isAgent } = useStore(
    useShallow((s) => s.getCurrentUser())
  );
  const tabs = [
    "All",
    ...[isAgent && "Properties"],
    ...[isAgent && "Reviews"],
  ].filter((s) => typeof s == "string");

  if (!me) return <NotLoggedInProfile userType={"owner"} />;
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
