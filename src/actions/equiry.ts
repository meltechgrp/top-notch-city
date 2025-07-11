import { Fetch } from "./utills";

export async function sendEquiry({ form }: { form: Enquiry }) {
  const res = await Fetch("/enquiries", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: form,
  });
  if (res?.detail) throw Error("Something went wrong!, try again.");
  return res;
}
