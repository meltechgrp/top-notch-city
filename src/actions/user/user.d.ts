type Me = {
  username: string | null;
  email: string;
  phone: string | null;
  first_name: string;
  last_name: string;
  middle_name: string | null;
  gender: "male" | "female" | null;
  date_of_birth: string | null;
  status: "online" | "offline" | "idle";
  verified: boolean;
  profile_image: string | null;
  wallet_balance: number;
  is_active: boolean;
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
  address: {
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
