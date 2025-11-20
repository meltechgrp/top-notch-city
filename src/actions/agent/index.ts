import axios from "axios";
import { getAuthToken } from "@/lib/secureStore";
import config from "@/config";
import { format } from "date-fns";
import { Fetch } from "../utills";
import { getUniqueIdSync } from "react-native-device-info";

export async function uploadAgentForm(form: AgentFormData) {
  try {
    const data = new FormData();
    const authToken = getAuthToken();
    const deviceId = getUniqueIdSync();

    // Append text fields
    // data.append("firstname", form.firstname);
    // data.append("lastname", form.lastname);
    data.append("phone", form.phone);
    // data.append("nin", Math.round(Math.random() * 123456789011).toString());

    // Handle birthdate as string
    if (form.birthdate) {
      data.append("birthdate", format(new Date(form.birthdate), "yyyy-MM-dd"));
    }

    data.append("country", form.country);
    data.append("state", form.state);
    form.city && data.append("city", form.city);

    data.append("photo", {
      uri: form.photo,
      name: `image.jpg`,
      type: "image/jpeg",
    } as any);
    data.append("documents", {
      uri: form.photo,
      name: `image.jpg`,
      type: "image/jpeg",
    } as any);
    const response = await axios.post(
      `${config.origin}/api/agent/apply`,
      data,
      {
        headers: {
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
          "Content-Type": "multipart/form-data",
          accept: "application/json",
          "X-DID": deviceId,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getAgentApplications({
  pageParam,
}: {
  pageParam: number;
}) {
  const res = await Fetch(`/admin/agent/applications?page=${pageParam}`);
  return res as AgentResult;
}
export async function getMyApplications() {
  try {
    const res = await Fetch("/agent/me");
    return res as AgentReview[];
  } catch (error) {
    return undefined;
  }
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
  return res as { message: string };
}

export async function getAgents({ pageParam }: { pageParam: number }) {
  return (await Fetch(
    `/agents/search?per_page=20&page=${pageParam}&sort_by_top_properties=true`
  )) as AgentResult2;
}

export async function followAgent(id: string) {
  await Fetch(`/agents/${id}/follow`, {
    method: "POST",
  });
}
export async function unFollowAgent(id: string) {
  await Fetch(`/agents/${id}/unfollow`, {
    method: "DELETE",
  });
}
