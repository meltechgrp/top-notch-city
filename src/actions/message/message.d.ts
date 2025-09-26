interface StartChat {
  property_id?: string;
  member_id: string;
}

interface ChatList {
  details: Chat;
  messages: Message[];
  typing?: boolean;
}
interface Chat {
  chat_id: string;
  property_id?: string;
  receiver: ReceiverInfo;
  sender_id: string;
  recent_message: {
    message_id: string;
    content: string;
    created_at: string;
    read: string;
    status: "pending" | "seen" | "delivered" | "sent" | "error";
    file_data: FileData[];
  };
  unread_count: number;
}

interface Message {
  content: string;
  created_at: string;
  message_id: string;
  file_data: FileData[];
  receiver_info?: ReceiverInfo;
  sender_info: SenderInfo;
  read: boolean;
  status: "pending" | "seen" | "delivered" | "sent" | "error";
  updated_at?: string;
  deleted_at?: string;
  isMock?: boolean;
  property_info?: {
    id: string;
    title: string;
    image_url: string;
  };
}
interface ChatMessages {
  pagination: {
    total_messages: number;
    page: number;
    size: number;
    total_pages: number;
  };
  messages: Message[];
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
}

interface FileData {
  file_id: string;
  file_url: string;
  file_type: string;
  file_name: string;
}
