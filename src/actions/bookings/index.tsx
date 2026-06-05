import { ApiError, Fetch, getApiErrorMessage } from "@/actions/utills";

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
    throw Error(getApiErrorMessage(error, "Unable to create booking."));
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
  console.log({ booking_id, status, note });
  if (!booking_id || !status) {
    throw Error(
      "We could not update this booking. Please refresh and try again.",
    );
  }

  const data = {
    status,
    note: note || undefined,
  };

  try {
    const res = await Fetch(`/bookings/${booking_id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data,
    });

    if (res?.detail) {
      throw Error(
        getApiErrorMessage(
          res,
          "We could not update this booking. Please try again.",
        ),
      );
    }
    return res as BookingStatusUpdate;
  } catch (error) {
    if (error instanceof ApiError && (error.status ?? 0) >= 500) {
      throw error;
    }

    throw Error(
      getApiErrorMessage(
        error,
        "We could not update this booking. Please try again.",
      ),
    );
  }
}
