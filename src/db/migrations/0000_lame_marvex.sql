CREATE TABLE `addresses` (
	`property_id` text PRIMARY KEY NOT NULL,
	`city` text,
	`state` text,
	`country` text,
	`street` text,
	`latitude` real,
	`longitude` real,
	`deleted_at` text,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `amenities` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `availabilities` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `interactions` (
	`property_id` text PRIMARY KEY NOT NULL,
	`viewed` integer DEFAULT 0,
	`liked` integer DEFAULT 0,
	`added_to_wishlist` integer DEFAULT 0,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `media` (
	`id` text PRIMARY KEY NOT NULL,
	`property_id` text NOT NULL,
	`url` text NOT NULL,
	`media_type` text NOT NULL,
	`deleted_at` text,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `owner_interactions` (
	`property_id` text PRIMARY KEY NOT NULL,
	`viewed` integer,
	`liked` integer,
	`added_to_wishlist` integer,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `owners` (
	`id` text PRIMARY KEY NOT NULL,
	`first_name` text,
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
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action,
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
	`is_featured` integer DEFAULT false,
	`duration` text,
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
	`listing_role` text,
	`owner_type` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	`synced_at` text,
	`version` integer,
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `property_amenities` (
	`property_id` text NOT NULL,
	`amenity_name` text NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `property_category_map` (
	`property_id` text NOT NULL,
	`category_id` text NOT NULL,
	`subcategory_id` text,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`subcategory_id`) REFERENCES `subcategories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `property_list_items` (
	`list_id` text NOT NULL,
	`property_id` text NOT NULL,
	`position` integer,
	FOREIGN KEY (`list_id`) REFERENCES `property_lists`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `property_lists` (
	`id` text PRIMARY KEY NOT NULL,
	`updated_at` text
);
--> statement-breakpoint
CREATE TABLE `subcategories` (
	`id` text PRIMARY KEY NOT NULL,
	`category_id` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
