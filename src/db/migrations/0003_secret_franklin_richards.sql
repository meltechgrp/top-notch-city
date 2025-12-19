PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_addresses` (
	`owner_id` text NOT NULL,
	`owner_type` text DEFAULT 'property' NOT NULL,
	`display_address` text,
	`city` text,
	`street` text,
	`state` text,
	`country` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_addresses`("owner_id", "owner_type", "display_address", "city", "street", "state", "country", "latitude", "longitude") SELECT "owner_id", "owner_type", "display_address", "city", "street", "state", "country", "latitude", "longitude" FROM `addresses`;--> statement-breakpoint
DROP TABLE `addresses`;--> statement-breakpoint
ALTER TABLE `__new_addresses` RENAME TO `addresses`;--> statement-breakpoint
PRAGMA foreign_keys=ON;