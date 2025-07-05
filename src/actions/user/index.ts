import eventBus from "@/lib/eventBus";
import { Fetch } from "../utills";
import config from "@/config";

type UserResult = {
  total: number;
  page: number;
  per_page: number;
  pages: number;
  results: Me[];
  user_location?: LocationData;
};

export async function getMe() {
  const res = await Fetch("/users/me", {});

  if (res?.detail) {
    throw new Error("Failed to update profile");
  }
  return res as Me;
}
export async function getUsers({ pageParam }: { pageParam: number }) {
  const res = await Fetch(`/users?page=${pageParam}`, {});
  if (res?.detail) {
    throw new Error("Failed to update profile");
  }
  return res as UserResult;
}

export async function setProfileImage(image: string) {
  if (!image) return;
  const formData = new FormData();
  formData.append("profile_image", {
    uri: image,
    name: `user.jpg`,
    type: "image/jpeg",
  } as any);

  const res = await Fetch("/users/me", {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  eventBus.dispatchEvent("REFRESH_PROFILE", null);

  if (res?.detail) {
    throw new Error("Failed to update profile");
  }

  return res;
}

export async function updateProfileField(
  form: { field: keyof Me; value: any }[]
) {
  try {
    const formData = new FormData();
    form.map(({ field, value }) => {
      formData.append(field, value);
    });

    const res = await Fetch("/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      data: formData,
    });
    eventBus.dispatchEvent("REFRESH_PROFILE", null);

    if (res?.detail) {
      throw new Error("Failed to update profile");
    }

    return res;
  } catch (error) {
    throw error;
  }
}

export async function verifyEmail({ user_id }: { user_id: string }) {
  const res = await Fetch(`/admin/users/${user_id}/verify-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (res?.detail) {
    throw new Error("Failed to update profile");
  }
  return res as { message: string };
}
export async function deleteUser({ user_id }: { user_id: string }) {
  try {
    console.log(user_id);
    const res = await Fetch(`/users/${user_id}`, {
      method: "DELETE",
    });
    // const data = await res.json();
    console.log(res);
    if (res?.detail) {
      throw new Error("Failed to DELETE profile");
    }
    return res as { message: string };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to DELETE profile");
  }
}
