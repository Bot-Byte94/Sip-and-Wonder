CREATE TABLE `moments` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`mood` text NOT NULL,
	`drink` text NOT NULL,
	`prompt` text NOT NULL,
	`photo` text,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_moments_user_created` ON `moments` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `preferences` (
	`user_id` text PRIMARY KEY NOT NULL,
	`palette` text DEFAULT 'lavender' NOT NULL,
	`companion` text DEFAULT 'bean' NOT NULL,
	`plant` text DEFAULT 'yes' NOT NULL,
	`note` text DEFAULT '' NOT NULL
);
