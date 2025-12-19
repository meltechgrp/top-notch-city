CREATE TABLE `property_addresses` (
	`property_id` text NOT NULL,
	`address_id` text NOT NULL,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user_addresses` (
	`user_id` text NOT NULL,
	`address_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`address_id`) REFERENCES `addresses`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_addresses` (
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
INSERT INTO `__new_addresses`("id", "display_address", "city", "street", "state", "country", "latitude", "longitude") SELECT "id", "display_address", "city", "street", "state", "country", "latitude", "longitude" FROM `addresses`;--> statement-breakpoint
DROP TABLE `addresses`;--> statement-breakpoint
ALTER TABLE `__new_addresses` RENAME TO `addresses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;