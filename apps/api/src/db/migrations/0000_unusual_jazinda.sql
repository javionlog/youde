CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resource" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"name" text NOT NULL,
	"enabled" boolean,
	"remark" text,
	"sort" integer,
	"parent_id" text,
	"type" text NOT NULL,
	"path" text,
	"active_path" text,
	"component" text,
	"icon" text,
	"is_link" boolean,
	"is_cache" boolean,
	"is_affix" boolean,
	"is_show" boolean,
	CONSTRAINT "resource_name_unique" UNIQUE("name"),
	CONSTRAINT "resource_path_unique" UNIQUE("path")
);
--> statement-breakpoint
CREATE TABLE "resource_locale" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"resource_id" text NOT NULL,
	"field" text NOT NULL,
	"en_us" text NOT NULL,
	"zh_cn" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"name" text NOT NULL,
	"enabled" boolean,
	"remark" text,
	CONSTRAINT "role_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "role_resource_relation" (
	"id" text PRIMARY KEY NOT NULL,
	"role_id" text NOT NULL,
	"resource_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"username" text,
	"display_username" text,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "user_role_relation" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"role_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"parent_id" text,
	"name" text NOT NULL,
	"enabled" boolean,
	"sort" integer,
	CONSTRAINT "category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "category_locale" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
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
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thing" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"category_id" text NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"platform" text NOT NULL,
	"fee" text NOT NULL,
	"country" text NOT NULL,
	"cover" text,
	"content" text,
	"url" text,
	"status" text NOT NULL,
	CONSTRAINT "thing_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "thing_comment" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"thing_id" text NOT NULL,
	"user_id" text NOT NULL,
	"parent_id" text,
	"content" text NOT NULL,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thing_locale" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"thing_id" text NOT NULL,
	"field" text NOT NULL,
	"en_us" text NOT NULL,
	"zh_cn" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thing_rate" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"thing_id" text NOT NULL,
	"user_id" text NOT NULL,
	"score" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "thing_tag_relation" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"thing_id" text NOT NULL,
	"tag_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "categoryIdFieldUniqueIndex" ON "category_locale" USING btree ("category_id","field");--> statement-breakpoint
CREATE UNIQUE INDEX "thingIdFieldUniqueIndex" ON "thing_locale" USING btree ("thing_id","field");--> statement-breakpoint
CREATE UNIQUE INDEX "thingIdUserIdUniqueIndex" ON "thing_rate" USING btree ("thing_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "thingIdTagIdUniqueIndex" ON "thing_tag_relation" USING btree ("thing_id","tag_id");