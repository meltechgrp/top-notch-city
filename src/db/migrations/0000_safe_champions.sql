CREATE TABLE `search_history` (
	`latitude` text,
	`longitude` text,
	`purpose` text,
	`address` text
);
--> statement-breakpoint
CREATE TABLE `accounts` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`full_name` text,
	`is_active` integer DEFAULT false,
	`last_login_at` text
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`price` real NOT NULL,
	`currency` text NOT NULL,
	`status` text NOT NULL,
	`purpose` text NOT NULL,
	`category` text NOT NULL,
	`sub_category` text NOT NULL,
	`is_featured` integer DEFAULT false,
	`display_address` text NOT NULL,
	`owner_id` text NOT NULL,
	`duration` text,
	`bathroom` text,
	`bedroom` text,
	`landarea` real,
	`is_booked` integer,
	`discount` text,
	`plots` text,
	`thumbnail` text,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`views` text,
	`likes` text,
	`liked` text,
	`created_at` text NOT NULL,
	`updated_at` text,
	`synced_at` text,
	`version` integer,
	`deleted_at` text,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
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
