import {
  sendMessage,
  editMessage,
  deleteChatMessage,
  deleteChatRequest,
} from "@/actions/message";
import { database } from "@/db";
import {
  chatCollection,
  messageCollection,
  messageFilesCollection,
  userCollection,
} from "@/db/collections";
import { Q } from "@nozbe/watermelondb";
import {
  normalizeChat,
  normalizeMessage,
  normalizeMessageFiles,
  normalizeUser,
} from "@/db/normalizers/message";
import { Message } from "@/db/models/messages";
import { User } from "@/db/models/users";

export async function editServerMessage({ data }: { data: ServerMessage }) {
  const [chat] = await chatCollection
    .query(Q.where("recent_message_id", data.message_id), Q.take(1))
    .fetch();
  const [msg] = await messageCollection
    .query(Q.where("server_message_id", data.message_id), Q.take(1))
    .fetch();
  try {
    await editMessage({
      message_id: data.message_id,
      content: data.content,
    });
    if (msg) {
      await database.write(async () => {
        if (chat) {
          await chat.update((m) => {
            m.recent_message_status = "sent";
          });
        }
        await msg.update((m) => {
          m.status = "sent";
          m.sync_status = "synced";
        });
      });
    }
  } catch (error) {
    // if (msg) {
    //   await database.write(async () => {
    //     await msg.update((m) => {
    //       m.status = "failed";
    //     });
    //     await chat.update((c) => {
    //       c.recent_message_status = "failed";
    //     });
    //   });
    // }
  }
}
export async function sendServerMessage({
  data,
  chatId,
}: {
  data: ServerMessage;
  chatId: string;
}) {
  const [chat] = await chatCollection
    .query(Q.where("server_chat_id", chatId), Q.take(1))
    .fetch();
  const [msg] = await messageCollection
    .query(Q.where("server_message_id", data.message_id), Q.take(1))
    .fetch();

  const existingFiles = await messageFilesCollection
    .query(Q.where("server_message_id", data.message_id))
    .fetch();
  try {
    const m = await sendMessage({
      chat_id: chatId,
      content: data.content,
      files: data.file_data,
      reply_to_message_id: data.reply_to_message_id,
    });
    if (!m) throw Error("Something went wrong");
    if (msg) {
      await database.write(async () => {
        const ops: any[] = [];
        if (chat) {
          ops.push(
            chat.prepareUpdate((c) => {
              c.recent_message_status = "sent";
              c.sync_status = "synced";
            }),
          );
        }
        if (msg) {
          ops.push(
            msg.prepareUpdate((msg) => {
              msg.status = "sent";
              msg.server_message_id = m.message_id;
              msg.created_at = Date.parse(m.created_at);
              msg.sync_status = "synced";
            }),
          );
        }
        if (m.media?.length) {
          m.media.forEach((serverFile, index) => {
            const localFile = existingFiles[index];
            if (localFile) {
              ops.push(
                localFile.prepareUpdate((f) => {
                  f.server_message_file_id = serverFile.id;
                  f.server_message_id = m.message_id;
                  f.url = serverFile.file_url;
                  f.file_type = serverFile.file_type?.toUpperCase() as any;
                  f.is_local = false;
                }),
              );
            } else {
              ops.push(
                messageFilesCollection.prepareCreate((f) => {
                  f.server_message_file_id = serverFile.id;
                  f.server_message_id = m.message_id;
                  f.url = serverFile.file_url;
                  f.file_type = serverFile.file_type?.toUpperCase() as any;
                  f.is_local = false;
                }),
              );
            }
          });
          if (existingFiles.length > m.media.length) {
            ops.push(
              ...existingFiles
                .slice(m.media.length)
                .map((f) => f.prepareDestroyPermanently()),
            );
          }
        }
        await database.batch(...ops);
      });
    }
  } catch (error) {
    console.log(error);
    await database.write(async () => {
      await msg.update((m) => {
        m.status = "failed";
      });
      await chat.update((c) => {
        c.recent_message_status = "failed";
      });
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
    const m = await sendMessage({
      chat_id: chatId,
      content: message.content,
      reply_to_message_id: message.reply_to_message_id,
      files: files.map((f) => ({
        id: f.id,
        file_type: f.file_type as any,
        file_url: f.url,
      })),
    });
    if (!m) throw Error("Something went wrong");

    await database.write(async () => {
      await message.update((msg) => {
        msg.status = m.status;
        msg.server_message_id = m.message_id;
        msg.created_at = Date.parse(m.created_at);
        msg.updated_at = Date.parse(m.created_at);
        msg.sync_status = "synced";
      });
    });
  } catch (error) {
    await database.write(async () => {
      await message.update((m) => {
        m.status = "failed";
      });
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

    if (chat && data?.isMock && chat.recent_message_id == data.message_id) {
      ops.push(
        chat.prepareUpdate((c) => {
          c.recent_message_content =
            data?.content || (data?.file_data ? "Media" : undefined);
          c.recent_message_created_at = Date.parse(data.created_at);
          c.recent_message_id = data.message_id;
          c.recent_message_status = data.status;
          c.recent_message_sender_id = data.sender_info.id;
        }),
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
          m.is_edited = true;
          m.reply_to_message_id = data.reply_to_message_id;
          m.updated_at = Date.parse(data.created_at);
          m.sync_status = "dirty";
        }),
      );
    } else {
      ops.push(
        messageCollection.prepareCreate((m: any) =>
          Object.assign(m, {
            ...normalizeMessage(data, chatId),
            sync_status: "dirty",
          }),
        ),
      );

      if (data.isMock) {
        if (data.file_data?.length) {
          ops.push(
            ...normalizeMessageFiles(data.file_data, data.message_id).map((f) =>
              messageFilesCollection.prepareCreate((m) => Object.assign(m, f)),
            ),
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
  message: ServerMessage,
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
      await database.write(async () => {
        await msg.deleteMessage();
      });
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
        }),
      );
    }

    const existing = await messageCollection
      .query(Q.where("server_message_id", messageId))
      .fetch();

    if (existing.length) {
      ops.push(
        existing[0].prepareUpdate((m) => {
          m.status = status;
        }),
      );
    }

    await database.batch(...ops);
  });
};
export const updateMessage = async ({
  message,
  chatId,
}: {
  message: ServerMessage;
  chatId: string;
}) => {
  await saveLocalMessage({ data: message, chatId });
};
export const updateUserStatus = async ({
  userId,
  status,
}: {
  userId: string;
  status: User["status"];
}) => {
  await database.write(async () => {
    const [user] = await userCollection
      .query(Q.where("server_user_id", userId))
      .fetch();

    if (user) {
      await user.update((c) => {
        c.status = status;
      });
    }
  });
};
export const deleteChat = async (chatId: string) => {
  await deleteChatRequest(chatId);

  await database.write(async () => {
    const ops: any[] = [];
    const chats = await chatCollection
      .query(Q.where("server_chat_id", chatId))
      .fetch();

    chats.forEach((c) => {
      ops.push(c.prepareDestroyPermanently());
    });

    const messages = await messageCollection
      .query(Q.where("server_chat_id", chatId))
      .fetch();

    if (messages.length) {
      const messageIds = messages.map((m) => m.server_message_id);

      const files = await messageFilesCollection
        .query(Q.where("server_message_id", Q.oneOf(messageIds)))
        .fetch();

      files.forEach((f) => {
        ops.push(f.prepareDestroyPermanently());
      });

      messages.forEach((m) => {
        ops.push(m.prepareDestroyPermanently());
      });
    }

    if (ops.length) {
      await database.batch(...ops);
    }
  });
};

export const updateChats = async (data: ServerChat[]) => {
  await database.write(async () => {
    const ops: any[] = [];
    const updatedOwners = new Set<string>();

    for (const raw of data) {
      if (!raw) continue;

      const chatId = raw.chat_id;

      const [existingChat] = await chatCollection
        .query(Q.where("server_chat_id", chatId))
        .fetch();

      const chatModel = existingChat
        ? existingChat.prepareUpdate((p) =>
            Object.assign(p, normalizeChat(raw)),
          )
        : chatCollection.prepareCreate((p) =>
            Object.assign(p, normalizeChat(raw)),
          );

      ops.push(chatModel);

      if (raw?.receiver) {
        const serverUserId = raw?.receiver.id;
        const [existingOwner] = await userCollection
          .query(Q.where("server_user_id", serverUserId))
          .fetch();
        if (!existingOwner) {
          if (!updatedOwners.has(serverUserId)) {
            updatedOwners.add(serverUserId);

            ops.push(
              userCollection.prepareCreate((u) =>
                Object.assign(u, normalizeUser(raw.receiver)),
              ),
            );
          }
        } else {
          if (!updatedOwners.has(serverUserId)) {
            updatedOwners.add(serverUserId);

            ops.push(
              existingOwner.prepareUpdate((u) => {
                u.status = raw.receiver.status;
                u.profile_image = raw.receiver.profile_image;
              }),
            );
          }
        }
      }
    }

    await database.batch(...ops);
  });
};

export function messagesActions() {
  return {
    sendServerMessage,
    saveLocalMessage,
    editServerMessage,
    addIncomingMessage,
    deleteMessage,
    updateMessageStatus,
    updateUserStatus,
    updateMessage,
    updateChats,
  };
}
