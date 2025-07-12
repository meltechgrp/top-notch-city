import { fetchAdminDashboardStats } from "@/actions/dashboard/admin";
import AdminCards from "@/components/admin/dashboard/AdminCards";
import PropertyDetailsBottomSheet from "@/components/admin/properties/PropertyDetailsBottomSheet";
import MainLayout from "@/components/admin/shared/MainLayout";
import BarChartCard from "@/components/custom/BarChartCard";
import DonutPieChart from "@/components/custom/DonutPieCard";
import { BodyScrollView } from "@/components/layouts/BodyScrollView";
import PropertyListItem from "@/components/property/PropertyListItem";
import { View } from "@/components/ui";
import { fillLast6Months } from "@/lib/utils";
import { useStore } from "@/store";
import { useProductQueries } from "@/tanstack/queries/useProductQueries";
import { useRefresh } from "@react-native-community/hooks";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ScrollView } from "react-native";

export default function Dashboard() {
  const { me } = useStore();
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [propertyBottomSheet, setPropertyBottomSheet] = useState(false);
  const { data, refetch, isFetching, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: fetchAdminDashboardStats,
  });
  const { data: pending, refetch: refetch2 } = useProductQueries({
    type: "pending",
  });
  const { onRefresh } = useRefresh(async () => {
    await refetch();
    await refetch2();
  });
  const propertyData = useMemo(
    () => pending?.pages.flatMap((page) => page.results) || [],
    [pending]
  );
  return (
    <MainLayout>
      <BodyScrollView
        refreshing={isFetching || isLoading}
        onRefresh={onRefresh}
        className="flex-1 gap-1 pt-4 pb-8"
      >
        <AdminCards data={data} />

        {propertyData?.length > 0 && (
          <View className=" h-60 pl-4 mt-6">
            <ScrollView horizontal contentContainerClassName="gap-4">
              {propertyData.map((item) => (
                <PropertyListItem
                  onPress={(data) => {
                    setActiveProperty(data);
                    setPropertyBottomSheet(true);
                  }}
                  key={item.id}
                  enabled={false}
                  isList={true}
                  showStatus
                  withPagination={false}
                  isHorizontal={true}
                  data={item}
                  rounded={true}
                />
              ))}
            </ScrollView>
          </View>
        )}
        <DonutPieChart
          title="User Distribution"
          data={[
            { value: data?.totalNormalUsers, label: "users" },
            { value: data?.totalAdmin, label: "admins" },
            { value: data?.totalAgents, label: "agents" },
            { value: data?.totalAdminAgent, label: "admin agents" },
          ]}
        />
        <BarChartCard
          title="User Stats"
          data={fillLast6Months(data?.totalUsersWithinLast6Months)}
        />
        <BarChartCard
          title="Devices Stats"
          data={fillLast6Months(data?.totalDevicesLast6Months)}
        />
      </BodyScrollView>

      {activeProperty && me && (
        <PropertyDetailsBottomSheet
          visible={propertyBottomSheet}
          property={activeProperty}
          user={me}
          onDismiss={() => setPropertyBottomSheet(false)}
        />
      )}
    </MainLayout>
  );
}
