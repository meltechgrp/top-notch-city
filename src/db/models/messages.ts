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
    users: { type: "belongs_to", key: "server_sender_id" },
    messages: { type: "has_many", foreignKey: "server_chat_id" },
  } as const;

  @text("server_chat_id") chatId!: string;

  @text("property_server_id") propertyId?: string;

  @text("server_sender_id") senderId!: string;
  @text("server_receiver_id") receiverId!: string;

  @relation("users", "server_sender_id") sender!: any;
  @relation("users", "server_receiver_id") receiver!: any;

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
    chats: { type: "belongs_to", key: "server_chat_id" },
    users: { type: "belongs_to", key: "server_sender_id" },
    message_files: { type: "has_many", foreignKey: "server_message_id" },
  } as const;

  @text("server_message_id") messageId!: string;
  @text("chat_id") chatId!: string;

  @text("server_sender_id") senderId!: string;
  @text("receiver_id") receiverId!: string;

  @relation("users", "server_sender_id") sender!: any;
  @relation("users", "receiver_id") receiver!: any;

  @text("content") content!: string;

  @text("status") status!: string;
  @field("read") read!: boolean;
  @field("is_edited") isEdited?: boolean;

  @text("reply_to_message_id") replyToMessageId?: string;

  @text("property_id") propertyId?: string;

  @field("created_at") createdAt!: number;
  @field("updated_at") updatedAt!: number;
  @field("deleted_at") deletedAt?: number;

  @field("is_mock") isMock?: boolean;

  @children("message_files") files!: MessageFile[];
}

export class MessageFile extends Model {
  static table = "message_files";

  static associations = {
    messages: { type: "belongs_to", key: "server_message_id" },
  } as const;

  @text("server_message_id") messageId!: string;
  @relation("messages", "server_message_id") message!: Message;

  @text("url") url!: string;
  @text("file_type") fileType!: string;
  @text("mime_type") mimeType?: string;

  @field("created_at") createdAt!: number;
}
