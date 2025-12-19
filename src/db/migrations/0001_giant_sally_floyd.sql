PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_agent_companies` (
	`agent_id` text NOT NULL,
	`company_id` text NOT NULL,
	PRIMARY KEY(`agent_id`, `company_id`),
	FOREIGN KEY (`agent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_agent_companies`("agent_id", "company_id") SELECT "agent_id", "company_id" FROM `agent_companies`;--> statement-breakpoint
DROP TABLE `agent_companies`;--> statement-breakpoint
ALTER TABLE `__new_agent_companies` RENAME TO `agent_companies`;--> statement-breakpoint
PRAGMA foreign_keys=ON;