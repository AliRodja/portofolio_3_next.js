import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAdmin } from "@/lib/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2 mb-8 text-sm text-gray-500">
          Sign in to manage your portfolio content.
        </p>
        <Suspense>
          <RedirectIfSignedIn />
          <LoginForm />
        </Suspense>
        <Link
          href="/"
          className="mt-6 block text-center text-sm text-gray-500 hover:text-gray-900"
        >
          Back to site
        </Link>
      </div>
    </main>
  );
}

async function RedirectIfSignedIn() {
  if (await getAdmin()) redirect("/admin");
  return null;
}
