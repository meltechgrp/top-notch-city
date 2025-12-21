CREATE TABLE `accounts` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`role` text NOT NULL,
	`is_active` integer DEFAULT false,
	`last_login_at` text
);
--> statement-breakpoint
CREATE TABLE `addresses` (
	`id` text PRIMARY KEY NOT NULL,
	`display_address` text,
	`city` text,
	`street` text,
	`state` text,
	`country` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_address_lat_lng` ON `addresses` (`latitude`,`longitude`);--> statement-breakpoint
CREATE TABLE `agent_companies` (
	`agent_id` text NOT NULL,
	`company_id` text NOT NULL,
	PRIMARY KEY(`agent_id`, `company_id`),
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
CREATE TABLE `amenities` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `amenities_name_unique` ON `amenities` (`name`);--> statement-breakpoint
CREATE INDEX `idx_amenity_name` ON `amenities` (`name`);--> statement-breakpoint
CREATE TABLE `availabilities` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
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
CREATE TABLE `interactions` (
	`property_id` text PRIMARY KEY NOT NULL,
	`viewed` integer DEFAULT 0,
	`liked` integer DEFAULT 0,
	`added_to_wishlist` integer DEFAULT 0,
	`dirty` integer DEFAULT false,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` text NOT NULL,
	`property_id` text NOT NULL,
	`url` text NOT NULL,
	`media_type` text NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `uniq_media_per_property` ON `media` (`property_id`,`id`);--> statement-breakpoint
CREATE TABLE `owner_interactions` (
	`property_id` text PRIMARY KEY NOT NULL,
	`viewed` integer,
	`liked` integer,
	`added_to_wishlist` integer,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `owners` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`first_name` text,
	`slug` text,
	`last_name` text,
	`email` text,
	`phone` text,
	`profile_image` text,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `owners_property_id_unique` ON `owners` (`property_id`);--> statement-breakpoint
CREATE TABLE `ownerships` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`owner_id` text,
	`listing_role` text,
	`owner_type` text,
	`verification_status` text,
	`verification_note` text,
	`created_at` text,
	`updated_at` text,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`owner_id`) REFERENCES `owners`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `properties` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`description` text,
	`price` real NOT NULL,
	`currency_code` text NOT NULL,
	`status` text NOT NULL,
	`purpose` text NOT NULL,
	`category` text NOT NULL,
	`sub_category` text NOT NULL,
	`is_featured` integer DEFAULT false,
	`display_address` text NOT NULL,
	`owner_id` text NOT NULL,
	`duration` text,
	`total_reviews` integer,
	`avg_rating` integer,
	`bathroom` text,
	`bedroom` text,
	`landarea` real,
	`bed_type` text,
	`guests` text,
	`plots` text,
	`view_type` text,
	`is_booked` integer,
	`discount` text,
	`caution_fee` text,
	`created_at` text NOT NULL,
	`updated_at` text,
	`synced_at` text,
	`version` integer,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `property_addresses` (
	`property_id` text NOT NULL,
	`address_id` text NOT NULL,
	PRIMARY KEY(`property_id`, `address_id`),
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `property_amenities` (
	`property_id` text NOT NULL,
	`amenity_id` text NOT NULL,
	PRIMARY KEY(`property_id`, `amenity_id`),
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`amenity_id`) REFERENCES `amenities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `property_companies` (
	`property_id` text NOT NULL,
	`company_id` text NOT NULL,
	PRIMARY KEY(`property_id`, `company_id`),
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `property_search` (
	`property_id` text PRIMARY KEY NOT NULL,
	`title` text,
	`city` text,
	`state` text,
	`country` text
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`reviewer_id` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`created_at` text NOT NULL,
	`updated_at` text,
	FOREIGN KEY (`reviewer_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `idx_reviews_target` ON `reviews` (`target_type`,`target_id`);--> statement-breakpoint
CREATE INDEX `idx_reviews_reviewer` ON `reviews` (`reviewer_id`);--> statement-breakpoint
CREATE TABLE `user_addresses` (
	`user_id` text NOT NULL,
	`address_id` text NOT NULL,
	PRIMARY KEY(`user_id`, `address_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON UPDATE no action ON DELETE cascade
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
CREATE INDEX `idx_users_slug` ON `users` (`slug`);