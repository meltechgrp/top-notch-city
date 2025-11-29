import { format } from "date-fns";
import { Fetch } from "../utills";

export async function uploadAgentForm(form: Partial<Application>) {
  try {
    const data = new FormData();

    form?.phone && data.append("phone", form.phone);
    form?.about && data.append("about", form.about);
    form?.website && data.append("website", form.website);
    form?.license_number && data.append("license_number", form.license_number);
    form?.profile_image &&
      data.append("profile_image_id", form.profile_image.id);

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
    console.log(data);
    const res = await Fetch("/agent/apply", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data,
    });
    return res.data;
  } catch (error) {
    console.log(error);
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
