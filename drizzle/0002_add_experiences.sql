CREATE TABLE "experiences" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" text NOT NULL,
	"company" text NOT NULL,
	"type" text NOT NULL,
	"location" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"description" text[] DEFAULT '{}' NOT NULL,
	"skills" text[] DEFAULT '{}' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
