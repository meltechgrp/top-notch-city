import { database } from "@/db";
import { messageFilesCollection } from "@/db/collections";
import { normalizeMessageFiles } from "@/db/normalizers/message";

export async function upsertMessageFiles(files: FileData[], messageId: string) {
  const normalized = normalizeMessageFiles(files, messageId);
  if (!normalized?.length) return;

  await database.write(async () => {
    await database.batch(
      ...normalized.map((file) =>
        messageFilesCollection.prepareCreate((f: any) => Object.assign(f, file))
      )
    );
  });
}
