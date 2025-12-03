interface AgentReview {
  application_id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    gender: null;
    profile_image: string;
  };
  profile: {
    years_of_experience: string;
    specialties: string[];
    languages: string[];
    certifications: string[];
    website: "https://wsadasdasd";
    companies_count: 0;
  };
  status: "pending" | "approved" | "rejected";
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
  total_pages: number;
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
