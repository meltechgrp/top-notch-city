import { database } from "@/db";
import { Q } from "@nozbe/watermelondb";

export async function upsertUser(user: any, skip = true) {
  const users = database.get("users");

  const existing = await users
    .query(Q.where("server_user_id", user.server_user_id))
    .fetch();
  if (existing.length && skip) return console.log("user already exist");
  if (existing.length) {
    await existing[0].update((u: any) => {
      Object.assign(u, user);
    });
    return existing[0];
  }

  return users.create((u: any) => {
    Object.assign(u, user);
  });
}
