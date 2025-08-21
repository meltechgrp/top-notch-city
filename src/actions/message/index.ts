import { Fetch } from "@/actions/utills";

export async function startChat({ property_id, member_id }: StartChat) {
  const result = await Fetch(
    `/chat/start?property_id=${property_id}&member_id=${member_id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log(result);
  return result as string;
}
export async function sendMessage({ chat_id, content, files }: SendMessage) {
  const formData = new FormData();

  if (chat_id) formData.append("chat_id", chat_id);
  if (content) formData.append("content", content);
  files?.forEach((item, index) => {
    formData.append("media", {
      uri: item.uri,
      name: `image.jpg`,
      type: "image/jpeg",
    } as any);
  });
  const result = await Fetch(`/send/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data: formData,
  });
  return result as string;
}

export async function getChats() {
  const chats = await Fetch("/chats");
  return chats as { total: number; chats: Chat[] };
}

export async function getChatMessages({
  pageParam,
  chatId,
}: {
  pageParam: number;
  chatId: string;
}) {
  try {
    const res = await Fetch(
      `/chat/${chatId}/messages?page=${pageParam}&size=20`,
      {}
    );
    if (res?.detail) throw new Error("Failed to fetch messages");
    return res as ChatMessages;
  } catch (error) {
    console.error(error);
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

export async function deleteChat(chat_id: string) {
  await Fetch(`/delete/chats/${chat_id}`, {
    method: "DELETE",
  });
}
