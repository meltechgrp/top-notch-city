import { fetchAgentDashboardStats } from "@/actions/dashboard/admin";
import MainLayout from "@/components/admin/shared/MainLayout";
import AgentCards from "@/components/agent/dashboard/AgentCards";
import BarChartCard from "@/components/custom/BarChartCard";
import LineChartCard from "@/components/custom/LineChartCard";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import { fillLast6Months, fillMissingTimeSeries } from "@/lib/utils";
import { useRefresh } from "@react-native-community/hooks";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export default function Dashboard() {
  const { data, refetch, isFetching, isLoading } = useQuery({
    queryKey: ["agent-dashboard"],
    queryFn: fetchAgentDashboardStats,
  });

  const views = useMemo(
    () =>
      fillMissingTimeSeries(data?.totalViewsPerDay || [], {
        dateKey: "date",
        valueKey: "views",
      }),
    [data]
  );
  const { onRefresh } = useRefresh(refetch);
  return (
    <BodyScrollView
      refreshing={isFetching || isLoading}
      onRefresh={onRefresh}
      className="flex-1 gap-1 pt-4 pb-8"
    >
      <AgentCards data={data} />

      <LineChartCard title="Property Views" data={views} />
      <BarChartCard
        title="Property Uploads"
        data={fillLast6Months(data?.totalUploadedPropertiesPerMonth)}
      />
      <BarChartCard
        title="Bookings"
        data={fillLast6Months(data?.totalBookingsPerMonth)}
      />
    </BodyScrollView>
  );
}
