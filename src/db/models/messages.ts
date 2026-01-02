import { User } from "@/db/models/users";
import { Model, Q, Query } from "@nozbe/watermelondb";
import { writer } from "@nozbe/watermelondb/decorators";
import {
  field,
  text,
  relation,
  children,
} from "@nozbe/watermelondb/decorators";

export class Chat extends Model {
  static table = "chats";

  static associations = {
    messages: { type: "has_many", foreignKey: "server_chat_id" },
  } as const;

  @writer async deleteChat() {
    const messages = this.messages;
    const ops: any[] = [];
    for (const m of messages) {
      const files = m.files;
      ops.push(...files.map((f) => f.prepareDestroyPermanently()));
      ops.push(m.prepareDestroyPermanently());
    }
    ops.push(super.prepareDestroyPermanently());
    await this.database.batch(...ops);
  }
  @writer async softDeleteChat() {
    await this.update((m) => {
      m.deleted_at = Date.now();
      m.sync_status = "deleted";
    });
  }
  @text("server_chat_id") server_chat_id!: string;

  @text("property_server_id") property_server_id?: string;

  @text("server_sender_id") server_sender_id!: string;
  @text("server_user_id") server_user_id!: string;

  @text("recent_message_id") recent_message_id?: string;
  @text("recent_message_content") recent_message_content?: string;
  @text("recent_message_sender_id") recent_message_sender_id?: string;

  @field("recent_message_created_at")
  recent_message_created_at?: number;

  @text("recent_message_status")
  recent_message_status?: "pending" | "sent" | "delivered" | "failed" | "seen";
  get receivers() {
    return this.collections
      .get("users")
      .query(
        Q.where("server_user_id", this.server_user_id),
        Q.take(1)
      ) as unknown as Query<User>;
  }
  @field("you_blocked_other") you_blocked_other?: boolean;
  @field("other_blocked_you") other_blocked_you?: boolean;

  @field("unread_count") unread_count!: number;
  @field("total_messages") total_messages!: number;

  @text("sync_status") sync_status!: "synced" | "dirty" | "deleted";
  @field("updated_at") updated_at!: number;
  @field("deleted_at") deleted_at?: number;

  @children("messages") messages!: Message[];
}

export class Message extends Model {
  static table = "messages";

  static associations = {
    chats: { type: "belongs_to", key: "server_chat_id" },
    users: { type: "belongs_to", key: "server_sender_id" },
    message_files: { type: "has_many", foreignKey: "server_message_id" },
  } as const;
  @writer async softDeleteMessage(all: boolean) {
    if (all) {
      await this.update((m) => {
        m.deleted_for_all_at = Date.now();
        m.sync_status = "deleted";
      });
    } else {
      await this.update((m) => {
        m.deleted_for_me_at = Date.now();
        m.sync_status = "deleted";
      });
    }
  }
  @writer async deleteMessage() {
    const ops: any[] = [];
    const files = this.files;
    ops.push(...files.map((f) => f.prepareDestroyPermanently()));
    ops.push(super.prepareDestroyPermanently());
    await this.database.batch(...ops);
  }
  get receivers() {
    return this.collections
      .get("users")
      .query(
        Q.where("server_user_id", this.server_receiver_id),
        Q.take(1)
      ) as unknown as Query<User>;
  }
  get senders() {
    return this.collection.query(
      Q.where("server_user_id", this.server_sender_id),
      Q.take(1)
    ) as unknown as Query<User>;
  }
  @text("server_message_id") server_message_id!: string;
  @text("server_chat_id") server_chat_id!: string;

  @text("server_sender_id") server_sender_id!: string;
  @text("server_receiver_id") server_receiver_id!: string;
  @text("content") content!: string;
  @text("status")
  status!: "pending" | "sent" | "delivered" | "failed" | "seen";

  @text("sync_status")
  sync_status!: "synced" | "dirty" | "deleted";

  @field("is_edited") is_edited!: boolean;
  @text("reply_to_message_id") reply_to_message_id?: string;
  @text("property_server_id") property_server_id?: string;

  @field("deleted_for_me_at") deleted_for_me_at?: number;
  @field("deleted_for_all_at") deleted_for_all_at?: number;
  @field("deleted_at") deleted_at?: number;

  @field("created_at") created_at!: number;
  @field("updated_at") updated_at!: number;

  @field("is_mock") is_mock?: boolean;

  @relation("chats", "server_chat_id") chat!: any;
  @children("message_files") files!: MessageFile[];
}

export class MessageFile extends Model {
  static table = "message_files";

  static associations = {
    messages: { type: "belongs_to", key: "server_message_id" },
  } as const;

  @text("server_message_file_id") server_message_file_id!: string;
  @text("server_message_id") server_message_id!: string;
  @relation("messages", "server_message_id") message!: any;

  @text("url") url!: string;
  @field("is_local") is_local?: boolean;

  @text("file_type") file_type!: "image" | "video" | "audio";

  @text("upload_status")
  upload_status!: "pending" | "uploading" | "uploaded" | "failed";
}
