CREATE TABLE `accounts` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`full_name` text,
	`profile_image` text,
	`is_active` integer DEFAULT false,
	`last_login_at` text
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`slug` text NOT NULL,
	`gender` text,
	`date_of_birth` text,
	`status` text DEFAULT 'offine',
	`role` text DEFAULT 'user',
	`verified` integer DEFAULT false,
	`is_active` integer DEFAULT true,
	`is_superuser` integer DEFAULT false,
	`is_blocked_by_admin` integer DEFAULT false,
	`profile_image` text,
	`auto_chat_message` text,
	`views_count` integer DEFAULT 0,
	`likes_count` integer DEFAULT 0,
	`total_properties` integer DEFAULT 0,
	`followers_count` integer DEFAULT 0,
	`is_following` integer,
	`created_at` text,
	`updated_at` text
);
