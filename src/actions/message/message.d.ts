interface StartChat {
  property_id?: string;
  member_id: string;
}

interface ChatList {
  details: ServerChat;
  messages: ServerMessage[];
  typing?: boolean;
}
interface ChatMessages {
  pagination: {
    total_messages: number;
    page: number;
    size: number;
    total_pages: number;
  };
  block_status: {
    you_blocked_other: boolean;
    other_blocked_you: boolean;
  };
  messages: ServerMessage[];
}
interface ServerChat {
  chat_id: string;
  property_id?: string;
  receiver: ReceiverInfo;
  sender_id: string;
  recent_message: {
    message_id: string;
    content: string;
    sender_id: string;
    created_at: string;
    read: string;
    status: "pending" | "seen" | "delivered" | "sent" | "error";
    file_data: FileData[];
  };
  unread_count: number;
}

interface ServerMessage {
  content: string;
  created_at: string;
  message_id: string;
  file_data: FileData[];
  receiver_info?: ReceiverInfo;
  sender_info: SenderInfo;
  status: "pending" | "seen" | "delivered" | "sent" | "failed";
  updated_at?: string;
  deleted_at?: string;
  isMock?: boolean;
  reply_to_message_id?: string;
  reply_to?: {
    message_id: string;
    file_data: FileData[];
    sender_info: SenderInfo;
    created_at: string;
  };
  property_info?: {
    id: string;
    title: string;
    image_url: string;
  };
}

interface ReceiverInfo {
  id: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
  status: "offline" | "online";
  last_seen: string;
}
interface SenderInfo {
  id: string;
  first_name?: string;
  last_name?: string;
  profile_image?: string;
  status?: "offline" | "online";
}
interface SendMessage {
  chat_id: string;
  content: string;
  files?: FileData[];
  reply_to_message_id?: string;
}

interface FileData {
  id: string;
  file_url: string;
  is_local?: boolean;
  file_type: Media["media_type"];
}
