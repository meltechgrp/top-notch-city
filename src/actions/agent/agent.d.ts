interface AgentFormData {
  phone: string;
  // nin: string;
  birthdate: Date | null;
  country: string;
  state: string;
  city?: string;
  photo: string;
}
interface AgentReview {
  id: string;
  user_id: string;
  reviewed_by: string;
  country: string;
  state: string;
  city: string;
  nin: string;
  firstname: string;
  lastname: string;
  middlename: string;
  phone: string;
  birthdate: string; // e.g. "2025-07-07"
  photo: string;
  first_name_match: boolean;
  last_name_match: boolean;
  dob_match: boolean;
  additional_fields: {
    [key: string]: any; // adjust if you know the structure
  };
  status: "pending" | "approved" | "rejected"; // assuming possible statuses
  reviewed_at: string; // ISO datetime string
  rejection_reason: string;
  created_at: string;
  updated_at: string;
}

interface AgentInfo {
  id: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
  total_property_count: number;
  total_property_views: number;
  followers_count: number;
  is_following: boolean;
  total_likes: number;
}

type AgentResult = {
  total: number;
  page: number;
  per_page: number;
  pages: number;
  results: AgentReview[];
};
type AgentResult2 = {
  total: number;
  page: number;
  per_page: number;
  pages: number;
  results: AgentInfo[];
};

interface AgentAnalyticsResponse {
  agentInfo: AgentData;
  propertyStats: PropertyStats;
  interactionStats: InteractionStats;
  engagementStats: EngagementStats;
  uploadStats: UploadStats;
  charts: Charts;
}

interface AgentData {
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

interface Charts {
  views: ChartCategory<ViewsChartItem>;
  likes: ChartCategory<LikesChartItem>;
  uploadedProperties: ChartCategory<UploadChartItem>;
}

interface ChartCategory<T> {
  daily: T[];
  monthly: T[];
  yearly: T[];
}

interface ViewsChartItem {
  date: string;
  month: string;
  year: string;
  views: number;
}

interface LikesChartItem {
  date: string;
  month: string;
  year: string;
  likes: number;
}

interface UploadChartItem {
  date?: string;
  month: string;
  year?: string;
  count: number;
}
