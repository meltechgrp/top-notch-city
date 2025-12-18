CREATE TABLE `addresses` (
	`property_id` text PRIMARY KEY NOT NULL,
	`city` text,
	`street` text,
	`state` text,
	`country` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `amenities` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_amenity_name` ON `amenities` (`name`);--> statement-breakpoint
CREATE TABLE `availabilities` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
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
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`url` text NOT NULL,
	`media_type` text NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
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
	`first_name` text,
	`slug` text,
	`last_name` text,
	`email` text,
	`phone` text,
	`profile_image` text
);
--> statement-breakpoint
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
CREATE TABLE `property_amenities` (
	`property_id` text NOT NULL,
	`amenity_id` text NOT NULL,
	PRIMARY KEY(`property_id`, `amenity_id`),
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`amenity_id`) REFERENCES `amenities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `property_search` (
	`property_id` text PRIMARY KEY NOT NULL,
	`title` text,
	`city` text,
	`state` text,
	`country` text
);
