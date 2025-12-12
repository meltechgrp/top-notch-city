import { Fetch } from "@/actions/utills";

export async function sendBooking({ form }: { form: BookingForm }) {
  try {
    const res = await Fetch("/bookings/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: form,
    });
    if (res?.detail) throw Error("Something went wrong!, try again.");
    return res;
  } catch (error) {
    console.log(error);
    throw Error("Something went wrong");
  }
}
export async function Bookings(isAgent: boolean) {
  const res = await Fetch(
    isAgent ? "/bookings/agent/me" : "/bookings/user/me",
    {}
  );
  if (res?.detail) throw Error("Something went wrong!, try again.");
  return res as BookingResult;
}
export async function updateBookingStatus({
  booking_id,
  status,
  note,
}: {
  booking_id: string;
  status: BookingStatus;
  note?: string;
}) {
  const res = await Fetch(`/bookings/${booking_id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: note
      ? {
          booking_id,
          status,
          note,
        }
      : {
          booking_id,
          status,
        },
  });
  if (res?.detail) throw Error("Something went wrong!, try again.");
  return res as Booking[];
}
