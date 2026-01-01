import { database } from "@/db";
import { normalizeMessageFiles } from "@/db/normalizers/message";

export async function upsertMessageFiles(files: FileData[], messageId: string) {
  const collection = database.get("message_files");

  for (const file of normalizeMessageFiles(files, messageId)) {
    await collection.create((f: any) => {
      Object.assign(f, file);
    });
  }
}
