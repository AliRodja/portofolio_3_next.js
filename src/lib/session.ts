import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth, isAdminEmail } from "@/lib/auth";

export type Admin = {
  name: string;
  email: string;
  image: string | null;
};

// Reads the session once per request. Reading headers makes the caller
// dynamic, so it must render inside a <Suspense> boundary.
export const getAdmin = cache(async (): Promise<Admin | null> => {
  const session = await auth.api.getSession({ headers: await headers() });
  // Re-check the allowlist so removing an email revokes access right away.
  if (!session || !isAdminEmail(session.user.email)) return null;
  return {
    name: session.user.name,
    email: session.user.email,
    image: session.user.image ?? null,
  };
});

// Call at the top of every admin page and Server Action.
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
