type BookingForm = {
  agent_id: string;
  notes: string;
  booking_type: Bookingtype;
  duration_days: string;
  scheduled_time: { hour: number; minute: number } | null;
  scheduled_date: Date | null;
  property_id: string;
};

type Bookingtype = "inspection" | "reservation";

type Booking = {
  id: string;
  status: "pending";
  scheduled_date: string;
  scheduled_time: string;
  created_at: string;
  guest?: number;
  no_of_beds?: number;
  duration?: number;
  bedType?: string;
  additionalRequest?: string[];
  property: {
    id: string;
    title: string;
    address: {
      country: string;
      state: string;
      city: string;
    };
    price: number;
    image: string;
  };
  agent: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image: string;
  };
  customer: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image: string;
  };

  booking_type: Bookingtype;
  notes: "";
  updated_at?: string;
};
