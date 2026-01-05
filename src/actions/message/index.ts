import { uploadToBucket } from "@/actions/bucket";
import { Fetch } from "@/actions/utills";

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
}: SendMessage) {
  const formData = new FormData();
  console.log(files);
  if (chat_id) formData.append("chat_id", chat_id);
  if (reply_to_message_id) {
    formData.append("reply_to_message_id", reply_to_message_id);
  }
  if (content) formData.append("content", content);

  if (files?.length) {
    await Promise.all(
      files.map(async (item) => {
        if (item.is_local) {
          const [file] = await uploadToBucket({
            data: [
              {
                url: item.file_url,
                type: item.file_type?.toLowerCase() as any,
              },
            ],
          });

          if (file?.id) {
            formData.append("chat_media_ids", file.id);
          }
        } else {
          formData.append("chat_media_ids", item.id);
        }
      })
    );
  }

  const result = await Fetch(`/send/messages`, {
    method: "POST",
    // ❌ DO NOT set Content-Type when sending FormData
    data: formData,
  });

  return result as {
    type: string;
    chat_id: string;
    message_id: string;
    content: string;
    media: FileData[];
    created_at: string;
    sender_id: string;
    sender_name: string;
    read: boolean;
    status: ServerMessage["status"];
    reply_to_message_id?: string;
  };
}

export async function editMessage({
  message_id,
  content,
}: {
  message_id: string;
  content: string;
}) {
  const result = await Fetch(
    `/messages/${message_id}?new_content=${content} `,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return result as {
    type: string;
    chat_id: string;
    message_id: string;
    content: string;
    status: ServerMessage["status"];
  };
}

export async function getChats() {
  const chats = await Fetch("/chats");
  return chats as { total: number; chats: ServerChat[] };
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
