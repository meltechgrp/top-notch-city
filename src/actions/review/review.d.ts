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
