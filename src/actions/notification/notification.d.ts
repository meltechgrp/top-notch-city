type UserNotification = {
  id: string; // UUID of the notification
  title: string; // Title text
  message: string; // Notification message
  type: "info" | "success" | "error" | string; // Type of notification
  user_id: string; // User UUID
  is_read: boolean; // Read status
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
};

type UserNotifications = UserNotification[];
