interface MonthlyCount {
  month: string;
  count: number;
}

interface DailyViews {
  date: string;
  views: number;
}

interface BookingsSummary {
  totalBookings: number;
  totalPendingBookings: number;
  totalCancelledBookings: number;
  totalCompletedBookings: number;
  totalBookingsPerMonth: MonthlyCount[];
}
interface DeviceStats {
  totalDevices: number;
  totalIOSDevices: number;
  totalAndroidDevices: number;
  totalWebDevices: number;
  totalMobileDevices: number;
  totalOtherDevices: number;
}

interface ReviewStats {
  totalReviews: number;
}

interface CompanyStats {
  totalCompanies: number;
}

interface AdminDashboardStats {
  totalUsers: number;
  totalUsersWithinLast6Months: MonthlyCount[];
  totalNormalUsers: number;
  totalAgents: number;
  totalAdminAgents: number;
  totalAdmins: number;
  totalStaff: number;
  totalProperties: number;
  totalPendingProperties: number;
  totalRequests: number;
  totalViews: number;
  totalUploadsLast6Months: MonthlyCount[];
  totalViewsLast30Days: DailyViews[];
  bookingsSummary: BookingsSummary;
  deviceStats: DeviceStats;
  reviewStats: ReviewStats;
  companyStats: CompanyStats;
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

interface DailyLikes {
  date: string;
  likes: number;
}

interface DailyCount {
  date: string;
  count: number;
}

interface YearlyViews {
  year: string;
  views: number;
}

interface YearlyLikes {
  year: string;
  likes: number;
}

interface YearlyCount {
  year: string;
  count: number;
}

interface AgentInfo {
  full_name: string;
  profile_image: string;
}

interface PropertyStats {
  approved: number;
  pending: number;
  rejected: number;
  total: number;
}

interface InteractionStats {
  totalViews: number;
  totalLikes: number;
  averageRating: number;
}

interface EngagementStats {
  totalEnquiries: number;
  totalBookings: number;
  weeklyEnquiryGrowthPercent: number;
}
interface UploadStats {
  uploadsToday: number;
  uploadsThisMonth: number;
}

interface BookingsSummary {
  totalBookings: number;
  totalPendingBookings: number;
  totalCancelledBookings: number;
  totalCompletedBookings: number;
  totalBookingsPerMonth: MonthlyCount[];
}

interface ReviewsSummary {
  totalReviews: number;
}

interface CompanyStats {
  totalCompanies: number;
}

interface Messages {
  totalchats: number;
  totalmessage: number;
}

interface SocialStats {
  totalFollowing: number;
  totalFollowers: number;
  totalBlocked: number;
}

interface ChartViews {
  daily: DailyViews[];
  monthly: { month: string; views: number }[];
  yearly: YearlyViews[];
}

interface ChartLikes {
  daily: DailyLikes[];
  monthly: { month: string; likes: number }[];
  yearly: YearlyLikes[];
}

interface ChartUploadedProperties {
  daily: DailyCount[];
  monthly: MonthlyCount[];
  yearly: YearlyCount[];
}

interface ChartBookings {
  daily: DailyCount[];
  monthly: MonthlyCount[];
  yearly: YearlyCount[];
}

interface Charts {
  views: ChartViews;
  likes: ChartLikes;
  uploadedProperties: ChartUploadedProperties;
  bookings: ChartBookings;
}

interface AgentDashboardStats {
  agentInfo: AgentInfo;
  propertyStats: PropertyStats;
  interactionStats: InteractionStats;
  engagementStats: EngagementStats;
  uploadStats: UploadStats;
  bookingsSummary: BookingsSummary;
  reviewsSummary: ReviewsSummary;
  companyStats: CompanyStats;
  messages: Messages;
  socialStats: SocialStats;
  charts: Charts;
}
