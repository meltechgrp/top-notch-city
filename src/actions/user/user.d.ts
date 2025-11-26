type Me = {
  username: string | null;
  email: string;
  phone: string | null;
  first_name: string;
  slug: string;
  is_blocked_by_admin: boolean;
  website?: string;
  agent_profile?: AgentProfile;
  last_name: string;
  middle_name: string | null;
  gender: "male" | "female" | null;
  date_of_birth: string | null;
  status: "online" | "offline" | "idle";
  verified: boolean;
  profile_image: string | null;
  wallet_balance: number;
  is_active: boolean;
  is_available?: boolean;
  is_blocked_by_admin?: boolean;
  is_superuser: boolean;
  role: "user" | "admin" | "agent" | "staff" | "staff_agent";
  id: string;
  created_at: string;
  updated_at: string;
  views_count: number;
  likes_count: number;
  total_properties: number;
  followers_count: number;
  is_following?: boolean;
  address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country_code: string;
    country: string;
    latitude: number;
    longitude: number;
    id: string;
  };
};

interface AgentProfile {
  license_number?: string;
  languages?: string[];
  specialties?: string[];
  years_of_experience?: string;
  working_hours?: Record<string, string>;
  social_links?: Record<string, string>;
  about?: string;
  website: string;
  is_available: boolean;
  average_rating: number;
  total_reviews: number;
  certifications: Record<string, string>;
  working_hours: Record<string, string>;
  reviews: Review[];
  companies: Company[];
}

interface Company {
  id: string;
  name: string;
  address?: string;
  website?: string;
  email?: string;
  description?: string;
  phone?: string;
}

type Activity = {
  id: string;
  full_name: string;
  target_name: string;
  action: string;
  created_at: string;
  user_id: string;
  target_id: string;
  object_type: string;
  description: string;
};

type FieldConfig = {
  label: string;
  context?: string;
  isAgent?: boolean;
  fields: (keyof ProfileUpdate)[];
  inputs: {
    key: keyof ProfileUpdate;
    placeholder: string;
    multiline?: boolean;
  }[];
  inputType?: keyof ProfileUpdate;
  isCompany?: boolean;
  isAddress?: boolean;
  showAddBtn?: boolean;
  maxLength?: number;
  isArray?: boolean;
};

type ProfileUpdate = {
  email: string;
  phone: string;
  first_name: string;
  about: string;
  website: string;
  license_number: string;
  languages: string[];
  specialties: string[];
  years_of_experience: string;
  working_hours: Record<string, string>;
  social_links: Record<string, string>;
  last_name: string;
  middle_name: string;
  gender: "male" | "female";
  date_of_birth: string;
  profile_image_id: string;
  street: string;
  city: string;
  state: string;
  postal_code?: string;
  country_code?: string;
  country: string;
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  description: string;
  companies: string;
};

type FollowedAgent = {
  count: number;
  followed_agents: Agent[];
  page: number;
  per_page: number;
  pages: number;
};

type Agent = {
  id: string;
  agent: {
    id: string;
    slug: string;
    profile_image: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  properties: {
    id: string;
    slug: string;
    title: string;
    price: number;
    thumbnail: string;
  }[];
  total_properties: number;
  total_followers: number;
  total_likes: number;
  is_following: boolean;
};

type Person = {
  id: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  is_following: boolean;
};

type AgentFollowersData = {
  agent: Person;
  followers_count: number;
  followers: Person[];
};

interface Blocked {
  id: string;
  first_name: string;
  last_name: string;
  profile_image: string;
  email: string;
}
