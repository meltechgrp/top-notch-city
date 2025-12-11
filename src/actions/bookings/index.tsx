import { Fetch } from "@/actions/utills";

export async function sendBooking({ form }: { form: BookingForm }) {
  const res = await Fetch("/bookings/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: form,
  });
  if (res?.detail) throw Error("Something went wrong!, try again.");
  return res;
}
