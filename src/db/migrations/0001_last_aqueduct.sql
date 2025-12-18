CREATE TABLE `property_search` (
	`property_id` text PRIMARY KEY NOT NULL,
	`title` text,
	`city` text,
	`state` text,
	`country` text
);
--> statement-breakpoint
ALTER TABLE `interactions` ADD `dirty` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `owners` ADD `slug` text;--> statement-breakpoint
ALTER TABLE `properties` DROP COLUMN `listing_role`;--> statement-breakpoint
ALTER TABLE `properties` DROP COLUMN `owner_type`;