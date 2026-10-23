CREATE TABLE "achievements" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"event" text NOT NULL,
	"date" date NOT NULL,
	"type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "educations" (
	"id" serial PRIMARY KEY NOT NULL,
	"school" text NOT NULL,
	"degree" text NOT NULL,
	"start_year" integer NOT NULL,
	"end_year" integer,
	"description" text[] DEFAULT '{}' NOT NULL,
	"badges" text[] DEFAULT '{}' NOT NULL,
	"photos" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
