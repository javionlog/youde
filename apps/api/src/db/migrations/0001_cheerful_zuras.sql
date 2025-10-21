CREATE TABLE "category" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category_locale" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"category_id" text NOT NULL,
	"field" text NOT NULL,
	"en_us" text NOT NULL,
	"zh_cn" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thing" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"category_id" text NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"cover" text,
	"content" text,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thing_comment" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"thing_id" text NOT NULL,
	"user_id" text NOT NULL,
	"parent_id" text,
	"content" integer NOT NULL,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thing_rate" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"thing_id" text NOT NULL,
	"user_id" text NOT NULL,
	"score" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thing_tag_relation" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp,
	"created_by" text,
	"updated_by" text,
	"thing_id" text NOT NULL,
	"tag_id" text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "categoryIdFieldUniqueIndex" ON "category_locale" USING btree ("category_id","field");--> statement-breakpoint
CREATE UNIQUE INDEX "thingIdUserIdUniqueIndex" ON "thing_rate" USING btree ("thing_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "thingIdTagIdUniqueIndex" ON "thing_tag_relation" USING btree ("thing_id","tag_id");