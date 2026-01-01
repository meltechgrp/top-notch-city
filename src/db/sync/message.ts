import { database } from "@/db";
import {
  normalizeChat,
  normalizeMessage,
  normalizeMessageFiles,
  normalizeUser,
} from "@/db/normalizers/message";
import { Q } from "@nozbe/watermelondb";
import {
  deleteChat,
  deleteChatMessage,
  getChatMessages,
  sendMessage,
} from "@/actions/message";
import {
  chatCollection,
  messageCollection,
  messageFilesCollection,
  userCollection,
} from "@/db/collections";
import { chunkArray } from "@/db/helpers";

type SyncInput = {
  chatId: string;
  pullCreate: any[];
  pullUpdate: any[];
  pullDelete: any[];
  pushCreate: any[];
  pushDeleteAll: any[];
  pushDeleteMe: any[];
  pushUpdate: any[];
  extra: {
    you_blocked_other: boolean;
    other_blocked_you: boolean;
    total_messages: number;
  };
  batchSize?: number;
};

export async function syncMessagesEngine({
  pullCreate,
  pullDelete,
  pullUpdate,
  pushCreate,
  pushDeleteAll,
  pushDeleteMe,
  pushUpdate,
  batchSize = 10,
  chatId,
  extra,
}: SyncInput) {
  console.log(
    `🧩 create=${pullCreate?.length}, update=${pullUpdate?.length}, delete=${pullDelete?.length}, server create=${pushCreate?.length}, server delete me=${pushDeleteMe?.length}, server delete all=${pushDeleteAll?.length}, server update=${pushUpdate?.length}`
  );
  if (pushDeleteMe?.length) {
    await Promise.all(
      pushDeleteMe.map(
        async (item) =>
          await deleteChatMessage({
            message_id: item.server_message_id,
            delete_for_everyone: false,
          })
      )
    );
  }
  if (pushDeleteAll?.length) {
    await Promise.all(
      pushDeleteAll.map(
        async (item) =>
          await deleteChatMessage({
            message_id: item.server_message_id,
            delete_for_everyone: true,
          })
      )
    );
  }
  if (pullCreate?.length) {
    await Promise.all(
      pullCreate.map(async (item) => {
        const message = await messageCollection
          .query(Q.where("server_message_id", item.server_message_id))
          .fetch();
        const files = await messageFilesCollection
          .query(Q.where("server_message_id", item.server_message_id))
          .fetch();
        await sendMessage({
          id: message[0].id,
          chat_id: chatId,
          content: message[0].content,
          files: files?.map((f) => ({
            file_type: f.file_type as FileData["file_type"],
            id: f.server_message_file_id,
            is_local: f.is_local,
            file_url: f.url,
          })),
          reply_to_message_id: message[0].reply_to_message_id,
        });
      })
    );
  }
  if (pullDelete?.length) {
    await database.write(async () => {
      const deletions = pullDelete.flatMap((p) =>
        [messageCollection, messageFilesCollection].flatMap(
          async (collection) =>
            (
              await collection
                .query(Q.where("server_message_id", p.message_id))
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
    const batchItems = batches[i] as Message[];

    console.log(
      `🔄 Syncing batch ${i + 1}/${batches.length} (${batchItems.length})`
    );

    await database.write(async () => {
      const ops: any[] = [];

      for (const msg of batchItems) {
        if (!msg) continue;

        const [existingChat] = await chatCollection
          .query(Q.where("server_chat_id", chatId))
          .fetch();

        if (existingChat) {
          const chatModel = existingChat.prepareUpdate((p) =>
            Object.assign(p, extra)
          );
          ops.push(chatModel);
        }

        const existing = await messageCollection
          .query(Q.where("server_message_id", msg.message_id))
          .fetch();

        if (existing.length) {
          ops.push(
            existing[0].prepareUpdate((m: any) => {
              Object.assign(m, normalizeMessage(msg, chatId));
            })
          );
        }

        ops.push(
          messageCollection.prepareCreate((m: any) => {
            Object.assign(m, normalizeMessage(msg, chatId));
          })
        );
        const existingFiles = await messageFilesCollection
          .query(Q.where("server_message_id", msg.message_id))
          .fetch();
        if (existingFiles) {
          ops.push(existingFiles.map((f) => f.prepareDestroyPermanently()));
        }
        if (msg?.file_data) {
          ops.push(
            ...normalizeMessageFiles(msg.file_data, msg.message_id).map((a) =>
              messageFilesCollection.prepareCreate((pa) => Object.assign(pa, a))
            )
          );
        }
      }

      await database.batch(...ops);
    });
  }

  console.log("✅ Message sync completed");
}
