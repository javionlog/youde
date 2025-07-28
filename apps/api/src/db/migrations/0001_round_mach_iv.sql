ALTER TABLE "resource" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "resource" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "resource" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "resource" ALTER COLUMN "updated_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "resource" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "resource" ALTER COLUMN "enabled" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "resource" ALTER COLUMN "sort" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "resource" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "role" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "role" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "role" ALTER COLUMN "created_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "role" ALTER COLUMN "updated_by" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "role" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "role" ALTER COLUMN "enabled" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "role" DROP COLUMN "sort";