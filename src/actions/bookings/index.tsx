import { Fetch } from "@/actions/utills";
import config from "@/config";
import { getActiveToken } from "@/lib/secureStore";

export async function sendBooking({ form }: { form: BookingForm }) {
  try {
    console.log(form);
    const res = await Fetch("/bookings/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: form,
    });
    if (res?.detail)
      throw Error(
        typeof res.detail == "string" ? res.detail : "Invalid fields",
      );
    return res;
  } catch (error: any) {
    console.log(error);
    throw Error(error);
  }
}
export async function Bookings(isAgent: boolean, page: number) {
  const res = await Fetch(
    isAgent
      ? `/bookings/agent/me?page=${page}`
      : `/bookings/user/me?page=${page}`,
    {},
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
  const authToken = await getActiveToken();
  const data = await fetch(
    `${config.origin}/api/bookings/${booking_id}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      body: JSON.stringify({
        status: status,
        note: note || null,
      }),
    },
  );
  const res = await data.json();
  if (res?.detail) {
    throw Error(res?.detail);
  }
  return res as Booking[];
}
