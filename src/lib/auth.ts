import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";

const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email: string) {
  return adminEmails.includes(email.toLowerCase());
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  databaseHooks: {
    user: {
      create: {
        // Only allowlisted emails get an account. Returning false aborts the
        // sign-in, and Better Auth redirects back with an error.
        before: async (user) => {
          if (!isAdminEmail(user.email)) return false;
        },
      },
    },
  },
  plugins: [nextCookies()],
});
