import { uploadToBucket } from "@/actions/bucket";
import { Fetch } from "@/actions/utills";
import {
  chatCollection,
  messageCollection,
  messageFilesCollection,
} from "@/db/collections";
import { normalizeMessageFiles } from "@/db/normalizers/message";
import { Q } from "@nozbe/watermelondb";

export async function startChat({ property_id, member_id }: StartChat) {
  if (property_id) {
    const result = await Fetch(
      `/chat/start?property_id=${property_id}&member_id=${member_id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return result as string;
  } else {
    const result = await Fetch(`/chat/start?member_id=${member_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return result as string;
  }
}
export async function sendMessage({
  chat_id,
  content,
  files,
  reply_to_message_id,
  id,
}: SendMessage) {
  try {
    const formData = new FormData();
    if (chat_id) formData.append("chat_id", chat_id);
    if (reply_to_message_id)
      formData.append("reply_to_message_id", reply_to_message_id);
    if (content) formData.append("content", content);
    files?.forEach(async (item) => {
      if (item.is_local) {
        const [file] = await uploadToBucket({
          data: [{ url: item.file_url }],
          type: item.file_type?.toLowerCase() as any,
        });

        file && formData.append("chat_media_ids", file.id);
      } else {
        formData.append("chat_media_ids", item.id);
      }
    });
    const result = await Fetch(`/send/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: formData,
    });
    const data = result as {
      type: string;
      chat_id: string;
      message_id: string;
      content: string;
      media: FileData[];
      created_at: string;
      sender_id: string;
      sender_name: string;
      read: boolean;
      status: Message["status"];
      reply_to_message_id?: string;
    };

    const msg = await messageCollection.find(id);
    await msg.update((m) => {
      m.status = data.status;
      m.server_message_id = data.message_id;
      m.created_at = Date.parse(data.created_at);
    });
    if (data.media && data.media?.length > 0) {
      const files = await messageFilesCollection
        .query(Q.where("server_message_id", data.message_id))
        .fetch();
      await Promise.all(files.map((f) => f.destroyPermanently()));
      await Promise.all(
        normalizeMessageFiles(data.media, data.message_id).map((a) =>
          messageFilesCollection.create((pa) => Object.assign(pa, a))
        )
      );
    }
  } catch (e) {
    const msg = await messageCollection.find(id);
    await msg.update((m) => {
      m.status = "failed";
    });
  }
}
export async function editMessage({
  message_id,
  content,
  id,
}: {
  message_id: string;
  content: string;
  id: string;
}) {
  try {
    const result = await Fetch(
      `/messages/${message_id}?new_content=${content} `,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = result as {
      type: string;
      chat_id: string;
      message_id: string;
      content: string;
      status: Message["status"];
    };

    const msg = await messageCollection.find(id);
    await msg.update((m) => {
      m.status = data.status;
    });
  } catch (error) {
    const msg = await messageCollection.find(id);
    await msg.update((m) => {
      m.status = "failed";
    });
  }
}

export async function getChats() {
  const chats = await Fetch("/chats");
  return chats as { total: number; chats: Chat[] };
}

export async function getChatMessages({
  pageParam,
  chatId,
  size = 20,
}: {
  pageParam: number;
  size?: number;
  chatId: string;
}) {
  try {
    const res = await Fetch(
      `/chat/${chatId}/messages?page=${pageParam}&size=${size}`,
      {}
    );
    if (res?.detail) throw new Error("Failed to fetch messages");
    return res as ChatMessages;
  } catch (error) {
    throw new Error("Failed to fetch properties");
  }
}

export async function makeMessageReadAndDelivered({
  chatId,
}: {
  chatId: string;
}) {
  await Fetch(`/chat/${chatId}/mark-all-read`, {
    method: "POST",
  });
}
export async function sendTyping({
  chat_id,
  is_typing,
}: {
  chat_id: string;
  is_typing: boolean;
}) {
  await Fetch(`/typing`, {
    method: "POST",
    data: { chat_id, is_typing },
  });
}

export async function deleteChat(chat_id: string) {
  try {
    await Fetch(`/chat/${chat_id}/delete-for-me`, {
      method: "DELETE",
    });
  } catch (error) {}
}
export async function deleteChatMessage({
  message_id,
  delete_for_everyone = false,
}: {
  message_id: string;
  delete_for_everyone: boolean;
}) {
  await Fetch(
    `/soft/delete/messages/${message_id}?delete_for_everyone=${delete_for_everyone}`,
    {
      method: "DELETE",
    }
  );
}

export async function getTotal() {
  return (await Fetch("/chats/unread-count")) as {
    total_unread: number;
  };
}
