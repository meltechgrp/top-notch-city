import { Fetch } from "../utills";

export async function getNotifications({ id }: { id?: string }) {
  const res = await Fetch(`/notifications/?user_id=${id}`, {});
  return res as UserNotifications;
}
