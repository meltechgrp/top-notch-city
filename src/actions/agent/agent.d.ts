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
}
