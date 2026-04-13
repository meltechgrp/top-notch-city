import { database } from "@/db";
import { Q } from "@nozbe/watermelondb";
import {
  chatCollection,
  messageCollection,
  messageFilesCollection,
  userCollection,
} from "@/db/collections";
import { Chat } from "@/db/models/messages";
import { deleteChatRequest } from "@/actions/message";
import { normalizeChat, normalizeUser } from "@/db/normalizers/message";

type SyncInput = {
  pullCreate: ServerChat[];
  pullUpdate: ServerChat[];
  pullDelete: Chat[];
  pushDelete: Chat[];
  batchSize?: number;
};

function chatChanged(existing: Chat, next: ReturnType<typeof normalizeChat>) {
  return (
    existing.recent_message_id !== next.recent_message_id ||
    existing.recent_message_content !== next.recent_message_content ||
    existing.recent_message_status !== next.recent_message_status ||
    existing.recent_message_created_at !== next.recent_message_created_at ||
    existing.recent_message_sender_id !== next.recent_message_sender_id ||
    existing.unread_count !== next.unread_count
  );
}

export async function syncChatsEngine({
  pullCreate,
  pullUpdate,
  pullDelete,
  pushDelete,
}: SyncInput) {
  console.log(
    `🧩 create=${pullCreate?.length}, update=${pullUpdate?.length}, delete=${pullDelete?.length}, server-delete=${pushDelete?.length}`
  );

  if (pushDelete?.length) {
    await Promise.all(
      pushDelete.map((item) => deleteChatRequest(item.server_chat_id))
    );
  }

  if (pullDelete?.length) {
    const chatIds = pullDelete.map((c) => c.server_chat_id);

    const [messages, chats] = await Promise.all([
      messageCollection
        .query(Q.where("server_chat_id", Q.oneOf(chatIds)))
        .fetch(),
      chatCollection
        .query(Q.where("server_chat_id", Q.oneOf(chatIds)))
        .fetch(),
    ]);

    const messageIds = messages.map((m) => m.server_message_id);
    const files = messageIds.length
      ? await messageFilesCollection
          .query(Q.where("server_message_id", Q.oneOf(messageIds)))
          .fetch()
      : [];

    await database.write(async () => {
      await database.batch(
        ...files.map((f) => f.prepareDestroyPermanently()),
        ...messages.map((m) => m.prepareDestroyPermanently()),
        ...chats.map((c) => c.prepareDestroyPermanently())
      );
    });
  }

  const toUpsert = [...(pullCreate || []), ...(pullUpdate || [])];
  if (!toUpsert.length) return;

  const chatIds = toUpsert.map((c) => c.chat_id);
  const receiverIds = toUpsert
    .map((c) => c?.receiver?.id)
    .filter(Boolean) as string[];

  const [existingChats, existingUsers] = await Promise.all([
    chatCollection
      .query(Q.where("server_chat_id", Q.oneOf(chatIds)))
      .fetch(),
    receiverIds.length
      ? userCollection
          .query(Q.where("server_user_id", Q.oneOf(receiverIds)))
          .fetch()
      : Promise.resolve([]),
  ]);

  const chatMap = new Map(existingChats.map((c) => [c.server_chat_id, c]));
  const userMap = new Map(
    existingUsers.map((u) => [u.server_user_id, u])
  );

  await database.write(async () => {
    const ops: any[] = [];
    const handledUsers = new Set<string>();

    for (const raw of toUpsert) {
      if (!raw) continue;

      const normalized = normalizeChat(raw);
      const existing = chatMap.get(raw.chat_id);

      if (existing) {
        if (chatChanged(existing, normalized)) {
          ops.push(
            existing.prepareUpdate((c) => Object.assign(c, normalized))
          );
        }
      } else {
        ops.push(
          chatCollection.prepareCreate((c) => Object.assign(c, normalized))
        );
      }

      const receiver = raw?.receiver;
      if (!receiver) continue;

      const receiverId = receiver.id;
      if (handledUsers.has(receiverId)) continue;
      handledUsers.add(receiverId);

      const existingUser = userMap.get(receiverId);
      if (!existingUser) {
        ops.push(
          userCollection.prepareCreate((u) =>
            Object.assign(u, normalizeUser(receiver))
          )
        );
      } else if (
        existingUser.status !== receiver.status ||
        existingUser.profile_image !== receiver.profile_image
      ) {
        ops.push(
          existingUser.prepareUpdate((u) => {
            u.status = receiver.status;
            u.profile_image = receiver.profile_image;
          })
        );
      }
    }

    if (ops.length) await database.batch(...ops);
  });

  console.log("✅ Chat sync completed");
}
