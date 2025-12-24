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
    console.log(res?.detail);
    if (res?.detail)
      throw Error(
        typeof res.detail == "string" ? res.detail : "Invalid fields"
      );
    return res;
  } catch (error: any) {
    console.log(error);
    throw Error(error);
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
