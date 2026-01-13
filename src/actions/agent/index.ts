import { format } from "date-fns";
import { Fetch } from "../utills";
import { getActiveToken } from "@/lib/secureStore";
import config from "@/config";

export async function uploadAgentForm(form: Partial<Application>) {
  const data = new FormData();

  const authToken = await getActiveToken();
  form?.phone && data.append("phone", form.phone);
  form?.about && data.append("about", form.about);
  form?.website && data.append("website", form.website);
  form?.license_number && data.append("license_number", form.license_number);
  form?.profile_image && data.append("profile_image_id", form.profile_image.id);

  if (form.date_of_birth) {
    data.append(
      "birthdate",
      format(new Date(form.date_of_birth), "yyyy-MM-dd")
    );
  }
  if (form?.address) {
    Object.entries(form?.address).map(([field, value]) => {
      value && data.append(field, value.toString());
    });
  }
  if (form?.specialties) {
    form.specialties.map((val) => {
      data.append("specialties", val.toString());
    });
  }
  if (form?.documents) {
    form.documents.map((val) => {
      data.append("document_types", val.document_types.toString());
      val?.documents && data.append("documents", val?.documents?.toString());
      val.documents_ids &&
        data.append("documents_ids", val.documents_ids.toString());
    });
  }
  if (form?.languages) {
    form.languages.map((val) => {
      data.append("languages", val.toString());
    });
  }
  const formdata = await fetch(`${config.origin}/api/agent/apply`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
    body: data,
  });
  const res = await formdata.json();
  if (res?.detail) {
    if (typeof res?.detail == "object") {
      const errs = Object.values(res?.detail);
      console.log(errs);
      throw Error(errs[0] as string);
    }

    throw Error(res?.detail);
  }
  return res as Booking[];
}

export async function getAgentApplications({
  pageParam,
}: {
  pageParam: number;
}) {
  const res = await Fetch(
    `/admin/agent/applications?page=${pageParam}&per_page=20`
  );
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
  reason,
  status,
}: {
  application_id: string;
  reason?: string;
  status: string;
}) {
  const res = await Fetch(`/admin/agent/${application_id}/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: reason ? { status, reason } : { status },
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

export async function getAgents({
  pageParam,
  name,
  state,
  perPage = 20,
}: {
  pageParam: number;
  perPage?: number;
  name?: string;
  state?: string;
}) {
  return (await Fetch(
    `/agents/search?per_page=${perPage}&page=${pageParam}&sort_by_top_properties=true`
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

export async function searchAgents({
  filter,
  pageParam,
  perPage = 10,
}: {
  filter?: AgentFilter;
  pageParam: number;
  perPage?: number;
}) {
  const params = new URLSearchParams();

  if (filter?.type && filter?.input) {
    params.append(filter.type, filter.input);
  }

  filter?.sort_by_top_properties &&
    params.append(
      "sort_by_top_properties",
      String(filter?.sort_by_top_properties)
    );

  params.append("page", pageParam.toString());
  params.append("per_page", perPage.toString());

  return (await Fetch(`/agents/search?${params.toString()}`)) as AgentResult2;
}
