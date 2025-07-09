import axios from "axios";
import { getAuthToken } from "@/lib/secureStore";
import config from "@/config";
import { format } from "date-fns";
import { Fetch } from "../utills";

export async function uploadAgentForm(form: AgentFormData) {
  try {
    const data = new FormData();
    const authToken = getAuthToken();

    // Append text fields
    data.append("firstname", form.firstname);
    data.append("lastname", form.lastname);
    data.append("phone", form.phone);
    data.append("nin", form.nin);

    // Handle birthdate as string
    if (form.birthdate) {
      data.append("birthdate", format(new Date(form.birthdate), "yyyy-MM-dd"));
    }

    data.append("country", form.country);
    data.append("state", form.state);
    data.append("city", form.city);

    // // Append each photo
    form.photo.forEach((file, index) => {
      data.append("photo", {
        uri: file.uri,
        name: `image.jpg`,
        type: "image/jpeg",
      } as any);
    });
    form.photo.forEach((file, index) => {
      data.append("documents", {
        uri: file.uri,
        name: `image.jpg`,
        type: "image/jpeg",
      } as any);
    });

    const response = await axios.post(
      `${config.origin}/api/agent/apply`,
      data,
      {
        headers: {
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
          "Content-Type": "multipart/form-data",
          accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

export async function getAgentApplications() {
  const res = await Fetch("/admin/agent/applications");
  return res as AgentReview[];
}
export async function acceptApplication({
  application_id,
}: {
  application_id: string;
}) {
  const res = await Fetch(`/admin/agent/${application_id}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: { status: "approved" },
  });

  if (res?.detail) {
    throw new Error("Failed to accept agent application");
  }
  console.log(res);
  return res as { message: string };
}
export async function rejectApplication({
  application_id,
  reason,
}: {
  application_id: string;
  reason: string;
}) {
  const res = await Fetch(`/admin/agent/${application_id}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: { status: "rejected", rejection_reason: reason },
  });

  if (res?.detail) {
    throw new Error("Failed to accept agent application");
  }
  console.log(res);
  return res as { message: string };
}
export async function deleteApplication({
  application_id,
}: {
  application_id: string;
}) {
  const res = await Fetch(`/admin/agent/${application_id}`, {
    method: "DELETE",
  });

  if (res?.detail) {
    throw new Error("Failed to delete agent application");
  }
  console.log(res);
  return res as { message: string };
}
