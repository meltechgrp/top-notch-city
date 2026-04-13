interface Review {
  id: string;
  agent_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}

interface PropertyReview {
  id: string;
  reviewer_id: string;
  property_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user?: {
    first_name: string;
    last_name: string;
    profile_image?: string;
  };
}
