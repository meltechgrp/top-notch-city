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
import { Message, MessageFile } from "@/db/models/messages";
import {
  deleteMessage,
  editServerMessage,
  sendServerMessageManual,
} from "@/components/chat";

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

const MESSAGE_FIELDS: (keyof ReturnType<typeof normalizeMessage>)[] = [
  "content",
  "status",
  "is_edited",
  "reply_to_message_id",
  "property_server_id",
  "updated_at",
  "deleted_at",
  "sync_status",
];

function messageNeedsUpdate(
  existing: Message,
  next: ReturnType<typeof normalizeMessage>
): boolean {
  for (const field of MESSAGE_FIELDS) {
    if ((existing as any)[field] !== (next as any)[field]) return true;
  }
  return false;
}

export async function syncMessagesEngine({
  pullCreate,
  pullDelete,
  pullUpdate,
  pushCreate,
  pushDeleteAll,
  pushDeleteMe,
  pushUpdate,
  batchSize = 50,
  chatId,
  extra,
}: SyncInput) {
  console.log(
    `🧩 create=${pullCreate?.length}, update=${pullUpdate?.length}, delete=${pullDelete?.length}, server create=${pushCreate?.length}, server delete me=${pushDeleteMe?.length}, server delete all=${pushDeleteAll?.length}, server update=${pushUpdate?.length}`
  );

  // Push outbound ops in parallel — independent network calls
  const pushOps: Promise<any>[] = [];

  if (pushDeleteMe?.length) {
    pushOps.push(
      ...pushDeleteMe.map((msg) =>
        deleteMessage({ messageId: msg.server_message_id, all: false })
      )
    );
  }
  if (pushDeleteAll?.length) {
    pushOps.push(
      ...pushDeleteAll.map((msg) =>
        deleteMessage({ messageId: msg.server_message_id, all: true })
      )
    );
  }
  if (pushCreate?.length) {
    pushOps.push(
      ...pushCreate.map((message) =>
        sendServerMessageManual({ message, chatId })
      )
    );
  }
  if (pushUpdate?.length) {
    pushOps.push(
      ...pushUpdate.map((message) =>
        editServerMessage({
          data: {
            message_id: message.server_message_id,
            created_at: new Date(message.created_at).toString(),
            updated_at: new Date(message.updated_at).toString(),
            content: message.content,
            sender_info: { id: message.server_sender_id },
            receiver_info: { id: message.server_receiver_id },
            reply_to_message_id: message?.server_message_id,
            isMock: false,
            status: "pending",
            file_data: [],
          },
        })
      )
    );
  }

  if (pushOps.length) await Promise.all(pushOps);

  if (pullDelete?.length) {
    const deleteIds = pullDelete.map((d) => d.server_message_id);
    const files = await messageFilesCollection
      .query(Q.where("server_message_id", Q.oneOf(deleteIds)))
      .fetch();

    await database.write(async () => {
      const ops: any[] = [
        ...files.map((f) => f.prepareDestroyPermanently()),
        ...pullDelete.map((d) => d.prepareDestroyPermanently()),
      ];
      await database.batch(...ops);
    });
  }

  const toUpsert = [...(pullCreate || []), ...(pullUpdate || [])];
  if (!toUpsert.length) {
    // Still update chat metadata (extra) so counts/block status propagate
    await applyChatExtra(chatId, extra);
    return;
  }

  const batches = chunkArray(toUpsert, batchSize);
  let extraApplied = false;

  for (const batch of batches) {
    const ids = batch.map((m) => m.message_id);

    // Single query for all existing messages + files in this batch
    const [existingMessages, existingFiles, chatRow] = await Promise.all([
      messageCollection
        .query(Q.where("server_message_id", Q.oneOf(ids)))
        .fetch(),
      messageFilesCollection
        .query(Q.where("server_message_id", Q.oneOf(ids)))
        .fetch(),
      !extraApplied
        ? chatCollection
            .query(Q.where("server_chat_id", chatId), Q.take(1))
            .fetch()
            .then((rows) => rows[0])
        : Promise.resolve(undefined),
    ]);

    const existingMessageMap = new Map(
      existingMessages.map((m) => [m.server_message_id, m])
    );
    const existingFilesMap = new Map<string, MessageFile[]>();
    for (const f of existingFiles) {
      const list = existingFilesMap.get(f.server_message_id) ?? [];
      list.push(f);
      existingFilesMap.set(f.server_message_id, list);
    }

    await database.write(async () => {
      const ops: any[] = [];

      if (!extraApplied && chatRow) {
        ops.push(
          chatRow.prepareUpdate((c) => {
            Object.assign(c, extra);
          })
        );
        extraApplied = true;
      }

      for (const msg of batch) {
        const normalized = normalizeMessage(msg, chatId);
        const existing = existingMessageMap.get(msg.message_id);

        if (existing) {
          if (messageNeedsUpdate(existing, normalized)) {
            ops.push(
              existing.prepareUpdate((m: any) => Object.assign(m, normalized))
            );
          }
        } else {
          ops.push(
            messageCollection.prepareCreate((m: any) =>
              Object.assign(m, normalized)
            )
          );
        }

        const serverFiles = msg.file_data ?? [];
        const priorFiles = existingFilesMap.get(msg.message_id) ?? [];

        // Only touch files if they actually differ
        const priorIds = new Set(
          priorFiles.map((f) => f.server_message_file_id)
        );
        const nextIds = new Set(serverFiles.map((f) => f.id));

        const filesDiffer =
          priorIds.size !== nextIds.size ||
          [...nextIds].some((id) => !priorIds.has(id));

        if (filesDiffer) {
          ops.push(...priorFiles.map((f) => f.prepareDestroyPermanently()));
          if (serverFiles.length) {
            ops.push(
              ...normalizeMessageFiles(serverFiles, msg.message_id).map((f) =>
                messageFilesCollection.prepareCreate((m) =>
                  Object.assign(m, f)
                )
              )
            );
          }
        }
      }

      if (ops.length) await database.batch(...ops);
    });
  }

  console.log("✅ Message sync completed");
}

async function applyChatExtra(chatId: string, extra: SyncInput["extra"]) {
  const [chat] = await chatCollection
    .query(Q.where("server_chat_id", chatId), Q.take(1))
    .fetch();
  if (!chat) return;

  const needs =
    chat.you_blocked_other !== extra.you_blocked_other ||
    chat.other_blocked_you !== extra.other_blocked_you ||
    chat.total_messages !== extra.total_messages;

  if (!needs) return;

  await database.write(async () => {
    await chat.update((c) => {
      Object.assign(c, extra);
    });
  });
}
