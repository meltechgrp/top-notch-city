import {
  chatCollection,
  messageCollection,
  propertiesCollection,
} from "@/db/collections";
import { database } from "@/db";
import { Q } from "@nozbe/watermelondb";
import { Message } from "@/db/models/messages";

export async function resetDatabase() {
  await database.write(async () => {
    await database.unsafeResetDatabase();
  });
}

export async function getLocalChatIndex() {
  return await chatCollection.query().fetch();
}
export async function getLocalMessagesIndex(chatId: string) {
  return await messageCollection
    .query(Q.where("server_chat_id", chatId))
    .fetch();
}
export async function getLocalPropertyIndex() {
  const props = await propertiesCollection.query().fetch();

  return props.map((p) => ({
    id: p.property_server_id,
    updated_at: p.updated_at,
    status: p.status,
  })) as any[];
}
export async function getLocalProperty(slug: string) {
  const props = await propertiesCollection
    .query(Q.where("slug", slug), Q.take(1))
    .fetch();

  return props.map((p) => ({
    id: p.property_server_id,
    updated_at: p.updated_at,
    status: p.status,
  })) as any[];
}

export function compareDates(local: any, server: any) {
  const localUpdated = local?.id == server?.id ? local?.updated_at : undefined;
  if (!localUpdated) return false;
  return Date.parse(server?.updated_at) != localUpdated;
}

export function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
export function diffServerAndLocal<TServer, TLocal>({
  server,
  local,
  serverIdKey,
  localIdKey,
  shouldDelete,
  shouldUpdate,
  mode,
}: {
  server: TServer[];
  local: TLocal[];
  serverIdKey: keyof TServer;
  localIdKey: keyof TLocal;
  shouldDelete: (local: TLocal, serverMap: Map<any, TServer>) => boolean;
  shouldUpdate: (local: TLocal, server: TServer) => boolean;
  mode: "full" | "incremental";
}) {
  const serverMap = new Map(server.map((s: any) => [s[serverIdKey], s]));

  const localMap = new Map(local.map((l: any) => [l[localIdKey], l]));

  const toCreate: TServer[] = [];
  const toUpdate: TServer[] = [];
  const toDelete: TLocal[] = [];

  for (const s of server) {
    const localItem = localMap.get((s as any)[serverIdKey]);

    if (!localItem) {
      toCreate.push(s);
    } else if (shouldUpdate(localItem, s)) {
      toUpdate.push(s);
    }
  }

  if (mode === "full") {
    for (const l of local) {
      if (shouldDelete(l, serverMap)) {
        toDelete.push(l);
      }
    }
  }

  return { toCreate, toUpdate, toDelete };
}

export function getPropertyDeleteRule(role: "user" | "agent" | "admin") {
  return (local: ServerProperty, serverMap: Map<string, any>) => {
    const serverProp = serverMap.get(local.id);

    if (!serverProp) return true;

    if (role === "user") {
      return serverProp.status !== "approved";
    }

    if (role === "agent") {
      return !!serverProp.is_deleted;
    }
    return false;
  };
}

export async function fetchIncremental<T>(
  fetcher: (
    page: number,
    perPage: number,
    updatedAfter: number
  ) => Promise<{
    results: T[];
    pages: number;
  }>,
  {
    updatedAfter,
    perPage = 100,
    maxItems = 500,
  }: {
    updatedAfter: number;
    perPage?: number;
    maxItems?: number;
  }
) {
  let page = 1;
  let pages = 1;
  const results: T[] = [];

  while (page <= pages && results.length < maxItems) {
    const res = await fetcher(page, perPage, updatedAfter);

    pages = res.pages;
    results.push(...res.results);
    page++;
  }

  return results.slice(0, maxItems);
}

export function diffChats({
  serverChats,
  localChats,
  mode,
}: {
  serverChats: ServerChat[];
  localChats: any[];
  mode: "full" | "incremental";
}) {
  const serverMap = new Map(serverChats.map((c) => [c.chat_id, c]));

  const pull = diffServerAndLocal({
    server: serverChats,
    local: localChats,
    serverIdKey: "chat_id",
    localIdKey: "server_chat_id",
    mode,
    shouldUpdate: (local, server) =>
      local.recent_message_id !== server.recent_message?.message_id,
    shouldDelete: (local, serverMap) =>
      local?.server_chat_id && !serverMap.has(local.server_chat_id),
  });

  const push = localChats.filter(
    (c) => c.sync_status === "dirty" && !serverMap.has(c.server_chat_id)
  );

  return {
    pullCreate: pull.toCreate,
    pullUpdate: pull.toUpdate,
    pullDelete: pull.toDelete,
    pushDelete: push,
  };
}

export function diffMessages({
  serverMessages,
  localMessages,
  mode,
}: {
  serverMessages: ServerMessage[];
  localMessages: Message[];
  mode: "full" | "incremental";
}) {
  const pull = diffServerAndLocal({
    server: serverMessages,
    local: localMessages,
    serverIdKey: "message_id",
    localIdKey: "server_message_id",
    mode,
    shouldUpdate: (local, server) =>
      !!server.updated_at &&
      new Date(server.updated_at).getTime() > (local.updated_at ?? 0),
    shouldDelete: (local, serverMap) =>
      !!local?.server_message_id && !serverMap.has(local.server_message_id),
  });

  const pushCreate = localMessages.filter(
    (m) => m.sync_status === "dirty" && !m.is_edited
  );

  const pushUpdate = localMessages.filter(
    (m) => m.sync_status === "dirty" && m.is_edited
  );
  const pushDeleteMe = localMessages.filter(
    (m) => m.sync_status === "dirty" && m.deleted_for_me_at
  );
  const pushDeleteAll = localMessages.filter(
    (m) => m.sync_status === "dirty" && m.deleted_for_all_at
  );

  return {
    pullCreate: pull.toCreate,
    pullUpdate: pull.toUpdate,
    pullDelete: pull.toDelete,
    pushCreate,
    pushUpdate,
    pushDeleteMe,
    pushDeleteAll,
  };
}
