ALTER TABLE "thing" RENAME COLUMN "user_id" TO "author";--> statement-breakpoint
ALTER TABLE "thing_comment" RENAME COLUMN "user_id" TO "author";--> statement-breakpoint
ALTER TABLE "thing_rate" RENAME COLUMN "user_id" TO "author";--> statement-breakpoint
DROP INDEX "thingIdUserIdUniqueIndex";--> statement-breakpoint
CREATE UNIQUE INDEX "thingIdUserIdUniqueIndex" ON "thing_rate" USING btree ("thing_id","author");