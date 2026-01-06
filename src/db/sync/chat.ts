import { database } from "@/db";
import { Q } from "@nozbe/watermelondb";
import { chatCollection, messageCollection } from "@/db/collections";
import { chunkArray } from "@/db/helpers";
import { Chat } from "@/db/models/messages";
import { updateChats } from "@/components/chat";
import { deleteChatRequest } from "@/actions/message";

type SyncInput = {
  pullCreate: ServerChat[];
  pullUpdate: ServerChat[];
  pullDelete: Chat[];
  pushDelete: Chat[];
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
    `🧩 create=${pullCreate?.length}, update=${pullUpdate?.length}, delete=${pullDelete?.length}, server-delete=${pushDelete?.length}`
  );
  if (pushDelete?.length) {
    await Promise.all(
      pushDelete.map(
        async (item) => await deleteChatRequest(item.server_chat_id)
      )
    );
  }
  if (pullDelete?.length) {
    await database.write(async () => {
      const deletions = pullDelete.flatMap((p) =>
        [chatCollection, messageCollection].flatMap(async (collection) =>
          (
            await collection
              .query(Q.where("server_chat_id", p.server_chat_id))
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
    const batchItems = batches[i];

    console.log(
      `🔄 Syncing batch ${i + 1}/${batches.length} (${batchItems.length})`
    );

    await updateChats(batchItems);
  }

  console.log("✅ Chat sync completed");
}
