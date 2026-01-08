CREATE TABLE "country" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"code" varchar(16) NOT NULL,
	"region" varchar(64) NOT NULL,
	"en_us" varchar(128) NOT NULL,
	"zh_cn" varchar(128) NOT NULL,
	CONSTRAINT "country_code_unique" UNIQUE("code"),
	CONSTRAINT "country_en_us_unique" UNIQUE("en_us"),
	CONSTRAINT "country_zh_cn_unique" UNIQUE("zh_cn")
);
--> statement-breakpoint
CREATE TABLE "treasure" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"category_id" text NOT NULL,
	"user_id" text NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" varchar(1024) NOT NULL,
	"fee" text NOT NULL,
	"country_code" varchar(16) NOT NULL,
	"cover" varchar(256),
	"content" text,
	"url" varchar(256),
	"status" text NOT NULL,
	CONSTRAINT "treasure_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE TABLE "treasure_category" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"parent_id" text,
	"name" varchar(64) NOT NULL,
	"enabled" boolean NOT NULL,
	"sort" integer NOT NULL,
	CONSTRAINT "treasure_category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "treasure_category_locale" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"category_id" text NOT NULL,
	"field" text NOT NULL,
	"en_us" varchar(64) NOT NULL,
	"zh_cn" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "treasure_comment" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"treasure_id" text NOT NULL,
	"user_id" text NOT NULL,
	"parent_id" text,
	"content" text NOT NULL,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "treasure_meta" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"treasure_id" text NOT NULL,
	"user_id" text NOT NULL,
	"tag_id" text NOT NULL,
	"platform" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "treasure_rate" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"treasure_id" text NOT NULL,
	"user_id" text NOT NULL,
	"score" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "treasure_tag" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"name" varchar(64) NOT NULL,
	"status" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_resource" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"name" varchar(64) NOT NULL,
	"enabled" boolean NOT NULL,
	"remark" varchar(128),
	"sort" integer NOT NULL,
	"parent_id" text,
	"type" text NOT NULL,
	"path" varchar(256),
	"active_path" varchar(256),
	"component" varchar(256),
	"icon" varchar(256),
	"is_link" boolean NOT NULL,
	"is_cache" boolean NOT NULL,
	"is_affix" boolean NOT NULL,
	"is_show" boolean NOT NULL,
	CONSTRAINT "admin_resource_name_unique" UNIQUE("name"),
	CONSTRAINT "admin_resource_path_unique" UNIQUE("path")
);
--> statement-breakpoint
CREATE TABLE "admin_resource_locale" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"resource_id" text NOT NULL,
	"field" text NOT NULL,
	"en_us" varchar(64) NOT NULL,
	"zh_cn" varchar(64) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_role" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"name" varchar(64) NOT NULL,
	"enabled" boolean NOT NULL,
	"remark" varchar(128),
	CONSTRAINT "admin_role_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "admin_role_resource_relation" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"role_id" text NOT NULL,
	"resource_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_user_role_relation" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"user_id" text NOT NULL,
	"role_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_session" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"expires_at" text NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"username" text,
	"user_id" text NOT NULL,
	CONSTRAINT "admin_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "admin_user" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"username" varchar(32) NOT NULL,
	"password" text NOT NULL,
	"enabled" boolean NOT NULL,
	"isAdmin" boolean NOT NULL,
	CONSTRAINT "admin_user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "portal_account" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" text,
	"refresh_token_expires_at" text,
	"scope" text,
	"password" text
);
--> statement-breakpoint
CREATE TABLE "portal_session" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"expires_at" text NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "portal_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "portal_user" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"username" varchar(32) NOT NULL,
	"email" varchar(128) NOT NULL,
	"email_verified" boolean NOT NULL,
	"phone" varchar(32),
	"avatar" varchar(256),
	CONSTRAINT "portal_user_username_unique" UNIQUE("username"),
	CONSTRAINT "portal_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "portal_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" text,
	"updated_at" text,
	"created_by" text,
	"updated_by" text,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_session" ADD CONSTRAINT "admin_session_user_id_admin_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portal_account" ADD CONSTRAINT "portal_account_user_id_portal_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."portal_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "portal_session" ADD CONSTRAINT "portal_session_user_id_portal_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."portal_user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "categoryIdFieldUniqueIndex" ON "treasure_category_locale" USING btree ("category_id","field");--> statement-breakpoint
CREATE UNIQUE INDEX "treasureIdPlatformUniqueIndex" ON "treasure_meta" USING btree ("treasure_id","platform");--> statement-breakpoint
CREATE UNIQUE INDEX "treasureIdTagIdUniqueIndex" ON "treasure_meta" USING btree ("treasure_id","tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "treasureIdUserIdUniqueIndex" ON "treasure_rate" USING btree ("treasure_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "resourceIdFieldUniqueIndex" ON "admin_resource_locale" USING btree ("resource_id","field");--> statement-breakpoint
CREATE UNIQUE INDEX "roleIdResourceIdUniqueIndex" ON "admin_role_resource_relation" USING btree ("role_id","resource_id");--> statement-breakpoint
CREATE UNIQUE INDEX "userIdRoleIdUniqueIndex" ON "admin_user_role_relation" USING btree ("user_id","role_id");