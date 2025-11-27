import { Eye, Heart, House, Target } from "lucide-react-native";
import { Text, View } from "@/components/ui";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { fetchAgentDashboardStats } from "@/actions/dashboard/admin";
import { AgentCard } from "@/components/agent/dashboard/AgentCard";
import CampaignCard from "@/components/profile/CampaignCard";

export default function AgentCards({ userId }: { userId: string }) {
  const { data } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchAgentDashboardStats,
  });
  const router = useRouter();
  return (
    <View className="gap-4 px-4">
      <View className="gap-4">
        <Text className="text-typography/80">Property Insights</Text>
        <View className="flex-row gap-4">
          <AgentCard
            title="Properties"
            icon={House}
            total={data?.totalProperties}
            onPress={() =>
              router.push({
                pathname: "/agents/[userId]/properties",
                params: {
                  userId,
                },
              })
            }
          />
          <AgentCard title="Views" icon={Target} total={data?.totalViews} />
          <AgentCard title="Likes" icon={Heart} total={data?.totalLikes} />
        </View>
      </View>
      <CampaignCard
        title="Boost your exposure"
        subtitle="Upload listings to appear in reels and reach more buyers."
        actionLabel="Upload"
        actionRoute={`/agents/${userId}/properties/add`}
      />
    </View>
  );
}
