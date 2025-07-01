import {
  Download,
  FileText,
  MailQuestion,
  ServerCrash,
} from "lucide-react-native";
import { View } from "@/components/ui";
import { DashboardCard } from "@/components/custom/DashboardCard";

type Props = {
  data?: AdminDashboardStats;
};

export default function AnalyticCards({ data }: Props) {
  return (
    <View className="gap-4 px-4">
      <View className="flex-wrap gap-4">
        <View className="flex-row gap-4">
          <DashboardCard title="Downloads" icon={Download} total={0} />
          <DashboardCard
            title="Requests"
            icon={MailQuestion}
            total={data?.totalRequests}
          />
        </View>
        <View className="flex-row gap-4">
          <DashboardCard
            title="Reports"
            icon={FileText}
            total={data?.totalReports}
          />
          <DashboardCard title="Crashes" icon={ServerCrash} total={0} />
        </View>
      </View>
    </View>
  );
}
