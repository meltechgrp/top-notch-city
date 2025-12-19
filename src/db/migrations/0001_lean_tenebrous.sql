CREATE TABLE `agent_companies` (
	`agent_id` text NOT NULL,
	`company_id` text NOT NULL,
	FOREIGN KEY (`agent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `agent_profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`license_number` text,
	`years_of_experience` text,
	`about` text,
	`website` text,
	`is_available` integer DEFAULT false,
	`average_rating` real DEFAULT 0,
	`total_reviews` integer DEFAULT 0,
	`languages` text,
	`specialties` text,
	`social_links` text,
	`certifications` text,
	`working_hours` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `companies` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`verified` integer,
	`address` text,
	`website` text,
	`email` text,
	`phone` text,
	`description` text
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`agent_id` text NOT NULL,
	`user_id` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`agent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
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
	`status` text NOT NULL,
	`role` text NOT NULL,
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
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_users_role` ON `users` (`role`);--> statement-breakpoint
CREATE INDEX `idx_users_slug` ON `users` (`slug`);--> statement-breakpoint
ALTER TABLE `addresses` ADD `owner_type` text DEFAULT 'property' NOT NULL;--> statement-breakpoint
ALTER TABLE `addresses` ADD `display_address` text;