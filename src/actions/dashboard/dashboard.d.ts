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
  totalAdminAgent: number;
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
  totalViews: number;
  totalLikes: number;
  totalBookings: number;
  totalViewsPerDay: {
    date: string;
    views: number;
  }[];
  totalUploadedPropertiesPerMonth: Stat[];
  totalBookingsPerMonth: Stat[];
}
