CREATE TABLE "thing_locale" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"thing_id" text NOT NULL,
	"field" text NOT NULL,
	"en_us" text NOT NULL,
	"zh_cn" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "thing" ADD COLUMN "platform" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "thing" ADD COLUMN "fee" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "thing" ADD COLUMN "country" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "thing" ADD COLUMN "download_url" text;--> statement-breakpoint
CREATE UNIQUE INDEX "thingIdFieldUniqueIndex" ON "thing_locale" USING btree ("thing_id","field");