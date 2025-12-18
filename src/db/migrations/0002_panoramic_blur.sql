PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_property_list_items` (
	`list_id` text NOT NULL,
	`property_id` text NOT NULL,
	`position` integer NOT NULL,
	PRIMARY KEY(`list_id`, `property_id`),
	FOREIGN KEY (`list_id`) REFERENCES `property_lists`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`property_id`) REFERENCES `properties`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_property_list_items`("list_id", "property_id", "position") SELECT "list_id", "property_id", "position" FROM `property_list_items`;--> statement-breakpoint
DROP TABLE `property_list_items`;--> statement-breakpoint
ALTER TABLE `__new_property_list_items` RENAME TO `property_list_items`;--> statement-breakpoint
PRAGMA foreign_keys=ON;