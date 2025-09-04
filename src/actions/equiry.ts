import { Fetch } from "./utills";

type EnquiryResult = {
  total: number;
  page: number;
  per_page: number;
  pages: number;
  results: EnquiryList[];
};

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
export async function getEquiries({ pageParam }: { pageParam: number }) {
  const res = await Fetch(`/admin/enquiries?pageParam=${pageParam}`);
  if (res?.detail) throw Error("Something went wrong!, try again.");
  return res as EnquiryResult;
}
export async function deleteEnquiry({ enquiry_id }: { enquiry_id: string }) {
  const res = await Fetch(`/admin/enquiries/${enquiry_id}`, {
    method: "DELETE",
  });

  if (res?.detail) {
    throw new Error("Failed to delete enquires");
  }

  return res as { message: string };
}
