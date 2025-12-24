PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_properties` (
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
	`views` integer,
	`likes` integer,
	`liked` integer DEFAULT false,
	`created_at` text NOT NULL,
	`updated_at` text,
	`synced_at` text,
	`version` integer,
	`deleted_at` text,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_properties`("id", "title", "slug", "description", "price", "currency", "status", "purpose", "category", "sub_category", "is_featured", "display_address", "owner_id", "duration", "bathroom", "bedroom", "landarea", "is_booked", "discount", "plots", "thumbnail", "latitude", "longitude", "views", "likes", "liked", "created_at", "updated_at", "synced_at", "version", "deleted_at") SELECT "id", "title", "slug", "description", "price", "currency", "status", "purpose", "category", "sub_category", "is_featured", "display_address", "owner_id", "duration", "bathroom", "bedroom", "landarea", "is_booked", "discount", "plots", "thumbnail", "latitude", "longitude", "views", "likes", "liked", "created_at", "updated_at", "synced_at", "version", "deleted_at" FROM `properties`;--> statement-breakpoint
DROP TABLE `properties`;--> statement-breakpoint
ALTER TABLE `__new_properties` RENAME TO `properties`;--> statement-breakpoint
PRAGMA foreign_keys=ON;