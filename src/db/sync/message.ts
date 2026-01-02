import { database } from "@/db";
import {
  normalizeMessage,
  normalizeMessageFiles,
} from "@/db/normalizers/message";
import { Q } from "@nozbe/watermelondb";
import {
  chatCollection,
  messageCollection,
  messageFilesCollection,
} from "@/db/collections";
import { chunkArray } from "@/db/helpers";
import { Message } from "@/db/models/messages";
import { deleteMessage, sendServerMessageManual } from "@/components/chat";

type SyncInput = {
  chatId: string;
  pullCreate: ServerMessage[];
  pullUpdate: ServerMessage[];
  pullDelete: Message[];
  pushCreate: Message[];
  pushDeleteAll: Message[];
  pushDeleteMe: Message[];
  pushUpdate: Message[];
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
    for (const msg of pushDeleteMe) {
      await deleteMessage({
        messageId: msg.server_message_id,
        all: true,
      });
    }
  }
  if (pushDeleteAll?.length) {
    for (const msg of pushDeleteAll) {
      await deleteMessage({
        messageId: msg.server_message_id,
        all: true,
      });
    }
  }
  if (pushCreate?.length) {
    for (const message of pushCreate) {
      await sendServerMessageManual({ message, chatId });
    }
  }
  if (pullDelete?.length) {
    await database.write(async () => {
      const ops = [];

      for (const d of pullDelete) {
        const files = await messageFilesCollection
          .query(Q.where("server_message_id", d.server_message_id))
          .fetch();

        ops.push(...files.map((f) => f.prepareDestroyPermanently()));
        ops.push(d.prepareDestroyPermanently());
      }

      await database.batch(...ops);
    });
  }

  const toUpsert = [...pullCreate, ...pullUpdate];
  if (!toUpsert.length) return;

  const batches = chunkArray(toUpsert, batchSize);

  for (const batch of batches) {
    await database.write(async () => {
      const ops: any[] = [];

      // 🔒 Fetch chat ONCE
      const [chat] = await chatCollection
        .query(Q.where("server_chat_id", chatId))
        .fetch();

      if (chat) {
        ops.push(
          chat.prepareUpdate((c) => {
            Object.assign(c, extra);
          })
        );
      }

      for (const msg of batch) {
        const existing = await messageCollection
          .query(Q.where("server_message_id", msg.message_id))
          .fetch();

        if (existing.length) {
          ops.push(
            existing[0].prepareUpdate((m: any) =>
              Object.assign(m, normalizeMessage(msg, chatId))
            )
          );
        } else {
          ops.push(
            messageCollection.prepareCreate((m: any) =>
              Object.assign(m, normalizeMessage(msg, chatId))
            )
          );
        }

        const existingFiles = await messageFilesCollection
          .query(Q.where("server_message_id", msg.message_id))
          .fetch();

        ops.push(...existingFiles.map((f) => f.prepareDestroyPermanently()));

        if (msg.file_data?.length) {
          ops.push(
            ...normalizeMessageFiles(msg.file_data, msg.message_id).map((f) =>
              messageFilesCollection.prepareCreate((m) => Object.assign(m, f))
            )
          );
        }
      }

      await database.batch(...ops);
    });
  }
  console.log("✅ Message sync completed");
}
