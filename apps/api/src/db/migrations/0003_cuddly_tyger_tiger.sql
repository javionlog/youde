ALTER TABLE "thing" RENAME COLUMN "author" TO "user_id";--> statement-breakpoint
ALTER TABLE "thing_comment" RENAME COLUMN "author" TO "user_id";--> statement-breakpoint
ALTER TABLE "thing_rate" RENAME COLUMN "author" TO "user_id";--> statement-breakpoint
DROP INDEX "thingIdUserIdUniqueIndex";--> statement-breakpoint
CREATE UNIQUE INDEX "thingIdUserIdUniqueIndex" ON "thing_rate" USING btree ("thing_id","user_id");