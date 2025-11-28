import { fetchAgentFullDashboardStats } from "@/actions/dashboard/admin";
import BarChartCard from "@/components/custom/BarChartCard";
import DonutPieChart from "@/components/custom/DonutPieCard";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import { Box } from "@/components/ui";
import { fillLast6Months } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useMemo } from "react";

export default function AgentAnalytics() {
  const { data, refetch, isFetching, isLoading } = useQuery({
    queryKey: ["agent-analytics"],
    queryFn: fetchAgentFullDashboardStats,
  });

  const charts = useMemo(() => {
    return {
      views: fillLast6Months(
        data?.charts.views.monthly.map((d) => ({
          month: d.month,
          count: d.views,
        })) || []
      ),
      likes: fillLast6Months(
        data?.charts.likes.monthly.map((d) => ({
          month: d.month,
          count: d.likes,
        })) || []
      ),
      uploadedProperties: fillLast6Months(
        data?.charts.uploadedProperties.monthly.map((d) => ({
          month: d.month,
          count: d.count,
        })) || []
      ),
    };
  }, [data]);
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: data?.agentInfo.full_name,
        }}
      />
      <Box className="flex-1">
        <BodyScrollView
          refreshing={isFetching || isLoading}
          onRefresh={refetch}
          withBackground
          className="flex-1 gap-1 pb-8"
        >
          <DonutPieChart
            title="Bussiness Insight"
            data={[
              { value: data?.interactionStats.totalViews, label: "Views" },
              { value: data?.interactionStats.totalLikes, label: "Likes" },
              { value: data?.interactionStats.averageRating, label: "Rating" },
              { value: data?.propertyStats.total, label: "Properties" },
              { value: data?.propertyStats.approved, label: "Approved" },
              { value: data?.propertyStats.pending, label: "Pending" },
              { value: data?.propertyStats.rejected, label: "Rejected" },
              { value: data?.engagementStats.totalBookings, label: "Bookings" },
              {
                value: data?.engagementStats.totalEnquiries,
                label: "Enquiries",
              },
            ]}
          />
          <BarChartCard title="Views" data={charts.views} />
          <BarChartCard title="Likes" data={charts.likes} />
          <BarChartCard title="Uploads" data={charts.uploadedProperties} />
        </BodyScrollView>
      </Box>
    </>
  );
}
