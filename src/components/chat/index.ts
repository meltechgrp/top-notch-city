import { sendMessage, editMessage, deleteChatMessage } from "@/actions/message";
import { database } from "@/db";
import {
  chatCollection,
  messageCollection,
  messageFilesCollection,
} from "@/db/collections";
import { Q } from "@nozbe/watermelondb";
import {
  normalizeChat,
  normalizeMessage,
  normalizeMessageFiles,
} from "@/db/normalizers/message";
import { Message } from "@/db/models/messages";
import { uploadToBucket } from "@/actions/bucket";

export async function editServerMessage({ data }: { data: ServerMessage }) {
  try {
    await editMessage({
      message_id: data.message_id,
      content: data.content,
    });
    const msg = await messageCollection
      .query(Q.where("server_message_id", data.message_id), Q.take(1))
      .fetch();
    if (msg?.length) {
      await msg[0].update((m) => {
        m.status = data.status;
      });
    }
  } catch (error) {
    const msg = await messageCollection
      .query(Q.where("server_message_id", data.message_id), Q.take(1))
      .fetch();
    if (msg?.length) {
      await msg[0].update((m) => {
        m.status = "failed";
      });
    }
  }
}
export async function sendServerMessage({
  data,
  chatId,
}: {
  data: ServerMessage;
  chatId: string;
}) {
  try {
    const m = await sendMessage({
      chat_id: chatId,
      content: data.content,
      files: data.file_data,
      reply_to_message_id: data.reply_to_message_id,
    });
    if (!m) throw Error("Something went wrong");
    const [msg] = await messageCollection
      .query(Q.where("server_message_id", data.message_id), Q.take(1))
      .fetch();
    await msg.update((msg) => {
      msg.status = m.status;
      msg.server_message_id = m.message_id;
      msg.created_at = Date.parse(m.created_at);
      msg.updated_at = Date.parse(m.created_at);
    });
  } catch (error) {
    const [msg] = await messageCollection
      .query(Q.where("server_message_id", data.message_id), Q.take(1))
      .fetch();
    await msg.update((m) => {
      m.status = "failed";
    });
  }
}
export async function sendServerMessageManual({
  message,
  chatId,
}: {
  message: Message;
  chatId: string;
}) {
  try {
    const files = await messageFilesCollection
      .query(Q.where("server_message_id", message.server_message_id))
      .fetch();
    const bucketFiles = files
      ? await uploadToBucket({
          data: files.map((f) => ({
            type: f.file_type?.toLowerCase() as any,
            url: f.url,
          })),
        })
      : [];
    const m = await sendMessage({
      chat_id: chatId,
      content: message.content,
      reply_to_message_id: message.reply_to_message_id,
      files: bucketFiles.map((f) => ({
        id: f.id,
        file_type: f.media_type as any,
        file_url: f.url,
      })),
    });
    if (!m) throw Error("Something went wrong");
    await message.update((msg) => {
      msg.status = m.status;
      msg.server_message_id = m.message_id;
      msg.created_at = Date.parse(m.created_at);
      msg.updated_at = Date.parse(m.created_at);
    });
  } catch (error) {
    await message.update((m) => {
      m.status = "failed";
    });
  }
}

export async function saveLocalMessage({
  data,
  chatId,
  playSound,
}: {
  data: ServerMessage;
  chatId: string;
  playSound?: () => void;
}) {
  await database.write(async () => {
    const ops: any[] = [];
    const [chat] = await chatCollection
      .query(Q.where("server_chat_id", chatId))
      .fetch();

    if (chat && (data?.isMock || chat.recent_message_id == data.message_id)) {
      ops.push(
        chat.prepareUpdate((c) => {
          c.recent_message_content =
            data?.content || (data?.file_data ? "Media" : undefined);
          c.recent_message_created_at = Date.parse(data.created_at);
          c.recent_message_id = data.message_id;
          c.recent_message_status = data.status;
          c.recent_message_sender_id = data.sender_info.id;
        })
      );
    }

    const existing = await messageCollection
      .query(Q.where("server_message_id", data.message_id))
      .fetch();

    if (existing.length) {
      ops.push(
        existing[0].prepareUpdate((m) => {
          m.content = data.content;
          m.status = data.status;
          m.reply_to_message_id = data.reply_to_message_id;
          m.updated_at = Date.parse(data.created_at);
        })
      );
    } else {
      ops.push(
        messageCollection.prepareCreate((m: any) =>
          Object.assign(m, normalizeMessage(data, chatId))
        )
      );

      if (data.isMock) {
        if (data.file_data?.length) {
          ops.push(
            ...normalizeMessageFiles(data.file_data, data.message_id).map((f) =>
              messageFilesCollection.prepareCreate((m) => Object.assign(m, f))
            )
          );
        }
      }
    }

    await database.batch(...ops);
  });
  playSound?.();
}
export const addIncomingMessage = async (
  chatId: string,
  message: ServerMessage
) => {
  await saveLocalMessage({ data: message, chatId });
};
export const deleteMessage = async ({
  messageId,
  all = false,
}: {
  messageId: string;
  all: boolean;
}) => {
  try {
    await deleteChatMessage({
      message_id: messageId,
      delete_for_everyone: all,
    });
    const [msg] = await messageCollection
      .query(Q.where("server_message_id", messageId))
      .fetch();

    if (msg) {
      await msg.deleteMessage();
    }
  } catch (error) {}
};
export const updateMessageStatus = async ({
  messageId,
  status,
  chatId,
}: {
  messageId: string;
  chatId: string;
  status: ServerMessage["status"];
}) => {
  await database.write(async () => {
    const ops: any[] = [];
    const [chat] = await chatCollection
      .query(Q.where("server_chat_id", chatId))
      .fetch();

    if (chat && chat.recent_message_id == messageId) {
      ops.push(
        chat.prepareUpdate((c) => {
          c.recent_message_status = status;
        })
      );
    }

    const existing = await messageCollection
      .query(Q.where("server_message_id", messageId))
      .fetch();

    if (existing.length) {
      ops.push(
        existing[0].prepareUpdate((m) => {
          m.status = status;
        })
      );
    }

    await database.batch(...ops);
  });
};
export const deleteChat = async (chatId: string) => {
  try {
    await deleteChat(chatId);
    const [chat] = await chatCollection
      .query(Q.where("server_chat_id", chatId))
      .fetch();

    if (chat) {
      await chat.deleteChat();
    }
  } catch (error) {}
};
export const updateChatDetails = async (data: ServerChat) => {
  const [chat] = await chatCollection
    .query(Q.where("server_chat_id", data.chat_id))
    .fetch();

  if (chat) {
    await chat.update((c) => Object.assign(c, normalizeChat(data)));
  }
};
export function messagesActions() {
  return {
    sendServerMessage,
    saveLocalMessage,
    editServerMessage,
    addIncomingMessage,
    deleteMessage,
    updateMessageStatus,
  };
}
