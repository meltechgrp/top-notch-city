import { Model } from "@nozbe/watermelondb";
import {
  field,
  text,
  relation,
  children,
} from "@nozbe/watermelondb/decorators";

export class Chat extends Model {
  static table = "chats";

  static associations = {
    users: { type: "belongs_to", key: "sender_id" },
    messages: { type: "has_many", foreignKey: "chat_id" },
  } as const;

  @text("chat_id") chatId!: string;

  @text("property_id") propertyId?: string;

  @text("sender_id") senderId!: string;
  @text("receiver_id") receiverId!: string;

  @relation("users", "sender_id") sender!: any;
  @relation("users", "receiver_id") receiver!: any;

  @text("recent_message_id") recentMessageId?: string;
  @text("recent_message_content") recentMessageContent?: string;
  @text("recent_message_sender_id") recentMessageSenderId?: string;

  @field("recent_message_created_at") recentMessageCreatedAt?: number;
  @text("recent_message_status") recentMessageStatus?: string;

  @field("unread_count") unreadCount!: number;
  @field("updated_at") updatedAt!: number;

  @children("messages") messages!: Message[];
}

export class Message extends Model {
  static table = "messages";

  static associations = {
    chats: { type: "belongs_to", key: "chat_id" },
    users: { type: "belongs_to", key: "sender_id" },
    message_files: { type: "has_many", foreignKey: "message_id" },
  } as const;

  @text("message_id") messageId!: string;
  @text("chat_id") chatId!: string;

  @text("sender_id") senderId!: string;
  @text("receiver_id") receiverId!: string;

  @relation("users", "sender_id") sender!: any;
  @relation("users", "receiver_id") receiver!: any;

  @text("content") content!: string;

  @text("status") status!: string;
  @field("read") read!: boolean;

  @text("reply_to_message_id") replyToMessageId?: string;

  @text("property_id") propertyId?: string;

  @field("created_at") createdAt!: number;
  @field("updated_at") updatedAt?: number;
  @field("deleted_at") deletedAt?: number;

  @field("is_mock") isMock?: boolean;

  @children("message_files") files!: MessageFile[];
}

export class MessageFile extends Model {
  static table = "message_files";

  static associations = {
    messages: { type: "belongs_to", key: "message_id" },
  } as const;

  @text("message_id") messageId!: string;
  @relation("messages", "message_id") message!: Message;

  @text("url") url!: string;
  @text("file_type") fileType!: string;
  @text("mime_type") mimeType?: string;

  @field("created_at") createdAt!: number;
}
