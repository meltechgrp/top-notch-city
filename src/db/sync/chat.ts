import { database } from "@/db";
import { normalizeChat, normalizeUser } from "@/db/normalizers/message";
import { Q } from "@nozbe/watermelondb";
import { deleteChat } from "@/actions/message";
import {
  chatCollection,
  messageCollection,
  messageFilesCollection,
  userCollection,
} from "@/db/collections";
import { chunkArray } from "@/db/helpers";

type SyncInput = {
  pullCreate: any[];
  pullUpdate: any[];
  pullDelete: any[];
  pushDelete: any[];
  batchSize?: number;
};

export async function syncChatsEngine({
  pullCreate,
  pullUpdate,
  pullDelete,
  pushDelete,
  batchSize = 10,
}: SyncInput) {
  console.log(
    `🧩 create=${pullCreate?.length}, update=${pullUpdate?.length}, delete=${pullDelete?.length}, server delete=${pushDelete?.length}`
  );
  if (pushDelete?.length) {
    await Promise.all(
      pushDelete.map(async (item) => await deleteChat(item.server_chat_id))
    );
  }
  if (pullDelete?.length) {
    await database.write(async () => {
      const deletions = pullDelete.flatMap((p) =>
        [chatCollection, messageCollection, messageFilesCollection].flatMap(
          async (collection) =>
            (
              await collection
                .query(Q.where("server_chat_id", p.chat_id))
                .fetch()
            ).map((m: any) => m.prepareDestroyPermanently())
        )
      );

      await database.batch(...(await Promise.all(deletions)).flat());
    });
  }

  const toUpsert = [...pullCreate, ...pullUpdate];
  if (!toUpsert.length) return;

  const batches = chunkArray(toUpsert, batchSize);

  for (let i = 0; i < batches.length; i++) {
    const batchItems = batches[i] as Chat[];

    console.log(
      `🔄 Syncing batch ${i + 1}/${batches.length} (${batchItems.length})`
    );

    await database.write(async () => {
      const ops: any[] = [];

      for (const raw of batchItems) {
        if (!raw) continue;

        const chatId = raw.chat_id;

        const [existingChat] = await chatCollection
          .query(Q.where("server_chat_id", chatId))
          .fetch();

        const chatModel = existingChat
          ? existingChat.prepareUpdate((p) =>
              Object.assign(p, normalizeChat(raw))
            )
          : chatCollection.prepareCreate((p) =>
              Object.assign(p, normalizeChat(raw))
            );

        ops.push(chatModel);

        if (raw?.receiver) {
          const serverUserId = raw.receiver.id;

          const [existingOwner] = await userCollection
            .query(Q.where("server_user_id", serverUserId))
            .fetch();

          if (!existingOwner) {
            ops.push(
              userCollection.prepareCreate((u) =>
                Object.assign(u, normalizeUser(raw.receiver))
              )
            );
          }
        }
      }

      await database.batch(...ops);
    });
  }

  console.log("✅ Chat sync completed");
}
