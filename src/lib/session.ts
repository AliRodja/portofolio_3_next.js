import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { auth, isAdminEmail } from "@/lib/auth";

export type Admin = {
  name: string;
  email: string;
  image: string | null;
};

export const getAdmin = cache(async (): Promise<Admin | null> => {
  // Opt into request-time rendering before Better Auth reads the current time for session expiry.
  await connection();
  const session = await auth.api.getSession({ headers: await headers() });
  // Re-check the allowlist so removing an email revokes access right away.
  if (!session || !isAdminEmail(session.user.email)) return null;
  return {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image ?? null,
  };
});

export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
