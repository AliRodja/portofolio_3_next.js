import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  date,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import type { EmploymentType } from "@/lib/experience";
import type { ProjectCategory } from "@/lib/project-categories";
import type { SocialLink } from "@/lib/social-icons";

// Content

// A single row (id 1) holding the site owner's details.
export const profile = pgTable(
  "profile",
  {
    id: integer("id").primaryKey().default(1),
    // Short name for the navbar and footer.
    name: text("name").notNull(),
    fullName: text("full_name").notNull(),
    role: text("role").notNull(),
    email: text("email").notNull(),
    intro: text("intro").notNull(),
    // One entry per paragraph. **Double asterisks** make text bold.
    about: text("about").array().notNull().default([]),
    // Meta description for search engines and link previews.
    description: text("description").notNull(),
    cvUrl: text("cv_url"),
    heroPhoto: text("hero_photo"),
    aboutPhoto: text("about_photo"),
    projectsPhoto: text("projects_photo"),
    contactPhoto: text("contact_photo"),
    collagePhotos: text("collage_photos").array().notNull().default([]),
    socials: jsonb("socials").$type<SocialLink[]>().notNull().default([]),
    quoteLine1: text("quote_line_1").notNull().default(""),
    quoteLine2: text("quote_line_2").notNull().default(""),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [check("profile_singleton", sql`${table.id} = 1`)],
);

export type Profile = typeof profile.$inferSelect;
export type ProfileData = Omit<Profile, "id" | "updatedAt">;

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  // One entry per paragraph.
  description: text("description").array().notNull().default([]),
  year: integer("year").notNull(),
  tech: text("tech").array().notNull().default([]),
  categories: text("categories")
    .array()
    .$type<ProjectCategory[]>()
    .notNull()
    .default([]),
  // Shown in the "Highlight" section of the projects page. Only one at a time.
  highlight: boolean("highlight").notNull().default(false),
  // Either a path inside public/ or a Vercel Blob URL.
  thumbnail: text("thumbnail"),
  images: text("images").array().notNull().default([]),
  previewUrl: text("preview_url"),
  sourceUrl: text("source_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  role: text("role").notNull(),
  company: text("company").notNull(),
  // One of employmentTypes, e.g. "Full-time".
  type: text("type").$type<EmploymentType>().notNull(),
  location: text("location").notNull(),
  // The first of the month, as YYYY-MM-DD. Only the month and year are shown.
  startDate: date("start_date").notNull(),
  // Empty while it is the current position ("Present").
  endDate: date("end_date"),
  // One entry per paragraph.
  description: text("description").array().notNull().default([]),
  skills: text("skills").array().notNull().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;

// Better Auth. Table and column names follow its defaults.

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
