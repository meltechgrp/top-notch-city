type UserNotification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  user_id: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  entity_type: string;
  entity_id: string;
};

type UserNotifications = UserNotification[];

type NotificationType = "info" | "success" | "error" | string;
