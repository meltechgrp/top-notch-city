export function normalizeChat(server: Chat) {
  return {
    server_chat_id: server.chat_id,
    property_server_id: server.property_id ?? null,

    server_sender_id: server.sender_id,
    server_receiver_id: server.receiver.id,

    recent_message_id: server.recent_message?.message_id ?? null,
    recent_message_content: server.recent_message?.content ?? null,
    recent_message_sender_id: server.recent_message?.sender_id ?? null,
    recent_message_created_at: server.recent_message
      ? Date.parse(server.recent_message.created_at)
      : null,
    recent_message_status: server.recent_message?.status ?? null,

    unread_count: server.unread_count,
    updated_at: Date.now(), // or server updated_at if provided
    sync_status: "synced",
  };
}

export function normalizeMessage(server: Message, chatId: string) {
  return {
    server_message_id: server.message_id,
    server_chat_id: chatId,

    server_sender_id: server.sender_info.id,
    server_receiver_id: server.receiver_info?.id ?? "",

    content: server.content,
    status: server.status,
    is_edited: !!server.updated_at,

    reply_to_message_id: server.reply_to_message_id ?? null,

    property_server_id: server.property_info?.id ?? null,

    created_at: Date.parse(server.created_at),
    updated_at: server.updated_at
      ? Date.parse(server.updated_at)
      : Date.parse(server.created_at),

    deleted_at: server.deleted_at ? Date.parse(server.deleted_at) : null,

    sync_status: "synced",
    is_mock: false,
  };
}

export function normalizeUser(user: ReceiverInfo) {
  return {
    server_user_id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    profile_image: user.profile_image ?? null,
    status: user.status,
    role: "user", // or infer
    slug: user.id, // fallback if backend doesn't send
    email: "", // optional
    phone: null,
    views_count: 0,
    likes_count: 0,
    total_properties: 0,
    followers_count: 0,
  };
}

export function normalizeMessageFiles(files: FileData[], messageId: string) {
  return files?.map((f) => ({
    server_message_id: messageId,
    server_message_file_id: f.id,
    url: f.file_url,
    file_type: f.file_type?.toUpperCase(),
    upload_status: "uploaded",
  }));
}
