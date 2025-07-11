import { Fetch } from "../utills";

export async function getNotifications({ id }: { id?: string }) {
  const res = await Fetch(`/notifications/?user_id=${id}`, {});
  if (res?.detail) throw new Error("Error occuried");
  return res as UserNotifications;
}

export async function markAsRead({ id }: { id?: string }) {
  const res = await Fetch(`/notifications/mark-read/${id}`, {
    method: "POST",
  });
  if (res?.detail) throw new Error("Error occuried, try again");
  return res;
}
export async function deleteNotification({ id }: { id?: string }) {
  const res = await Fetch(`/notifications/${id}`, {
    method: "DELETE",
  });
  if (res?.detail) throw new Error("Error occuried, try again");
  return res;
}
