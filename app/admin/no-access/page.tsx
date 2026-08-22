import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import SignOutButton from "@/components/admin/SignOutButton";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Access Restricted | European Consultant",
  robots: { index: false, follow: false },
};

export default async function NoAccessPage() {
  const session = await getSession();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <ShieldAlert size={24} />
        </span>

        <h1 className="mt-5 text-xl font-bold tracking-tight text-ink">
          Access restricted
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          {session?.email
            ? `${session.email} is signed in but has not been granted admin access.`
            : "This account has not been granted admin access."}
        </p>

        <div className="mt-6">
          <SignOutButton variant="outline" />
        </div>

        <Link
          href="/"
          className="mt-4 inline-block text-sm font-semibold text-swedenblue hover:underline"
        >
          Back to website
        </Link>
      </div>
    </main>
  );
}
