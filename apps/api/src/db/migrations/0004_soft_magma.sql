ALTER TABLE "category" ADD CONSTRAINT "category_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "thing" ADD CONSTRAINT "thing_title_unique" UNIQUE("title");