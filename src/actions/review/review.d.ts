interface Review {
  id: string;
  address_of_property?: string;
  agent_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}
