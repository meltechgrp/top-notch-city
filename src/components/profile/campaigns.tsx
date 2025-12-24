import CampaignCard from "@/components/profile/CampaignCard";
import { UserType } from "@/components/profile/ProfileWrapper";
import { Box } from "@/components/ui";
import { PlusCircle } from "lucide-react-native";

interface DetailsProps {
  user?: Me;
  userType: UserType;
  isAgent: boolean;
}
export function Campaigns({ userType, user, isAgent }: DetailsProps) {
  return (
    <Box className="px-4 my-4">
      {userType == "owner" && user?.role == "user" && (
        <CampaignCard
          title="Want to Rent or Sell?"
          subtitle="Easily upload your property and reach verified buyers and renters."
          actionLabel="Get Started"
          className=" py-4"
          actionRoute={`/forms/agent`}
        />
      )}
      {userType == "owner" && isAgent && (
        <CampaignCard
          title="Upload your property"
          subtitle="List your property for sale or rent today."
          icon={PlusCircle}
          actionLabel="Upload"
          actionRoute={`/agents/${user?.id}/properties/add`}
        />
      )}
    </Box>
  );
}
