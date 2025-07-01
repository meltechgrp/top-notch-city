interface Stat {
  month: string;
  count: number;
}
interface AdminDashboardStats {
  totalUsers: number;
  totalProperties: number;
  totalRequests: number;
  totalViews: number;
  totalAgents: number;
  totalDevices: number;
  totalReports: number;
  totalAdmin: number;
  totalAgents: number;
  totalNormalUsers: number;

  totalUploadsLast6Months: Stat[];
  totalUsersWithinLast6Months: Stat[];

  totalViewsLast30Days: {
    date: string; // e.g., "2025-06-23"
    views: number;
  }[];

  totalDevicesLast6Months: Stat[];

  totalSoldLast6Months: {
    month: string;
    count: number;
  }[];
}

interface AgentDashboardStats {
  totalProperties: number;
  totalSold: number;
  totalPropertyViews: number;
  propertyViewsLast30Days: {
    date: string;
    views: number;
  }[];
  propertiesPerMonthLast6Months: Stat[];
}
