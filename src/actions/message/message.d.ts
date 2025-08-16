interface StartChat {
  property_id: string;
  member_id: string;
}

interface Chat {
  chat_id: string;
  property_id?: string;
  receiver: {
    id: string;
    first_name: string;
    last_name: string;
    profile_image?: Media;
  };
  sender_id: string;
  recent_message: string;
  unread_count: number;
}

interface FileData {
  file_id: string;
  file_url: string;
  file_type: string;
  file_name: string;
}

interface Message {
  content: string;
  created_at: string;
  message_id: string;
  file_data: FileData[];
  receiver_info: ReceiverInfo;
  sender_info: SenderInfo;
}
interface ChatMessages {
  pagination: {
    total_messages: number;
    page: number;
    size: number;
    total_pages: number;
  };
  messages: Message[];
  receiver_info: ReceiverInfo;
  sender_info: SenderInfo;
}

interface ReceiverInfo {
  id: string;
  first_name: string;
  last_name: string;
  profile_image: string;
}
interface SenderInfo {
  id: string;
  first_name: string;
  last_name: string;
  profile_image: string;
}

interface SendMessage {
  chat_id: string;
  content: string;
  files?: ImagePickerAsset[];
}
