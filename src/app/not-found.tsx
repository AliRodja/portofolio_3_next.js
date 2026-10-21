import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 p-10">
      <div className="text-center">
        <h2 className="text-lg font-normal tracking-[8px] text-neutral-400 uppercase">
          Page not found
        </h2>
        <h1 className="text-4xl font-medium text-neutral-900">404</h1>
      </div>
      <Link
        href="/"
        className="rounded-xl border-2 border-gray-800 p-3 py-2 text-lg text-neutral-900 transition hover:bg-gray-800 hover:text-white"
      >
        Go Home
      </Link>
    </main>
  );
}
