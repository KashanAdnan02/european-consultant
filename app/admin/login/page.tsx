import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";
import { Alert } from "@/components/admin/ui";
import { getApiHealth } from "@/lib/queries";

export const metadata: Metadata = {
  title: "Admin Sign In | European Consultant",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const next =
    searchParams.next && searchParams.next.startsWith("/admin")
      ? searchParams.next
      : "/admin";
  const apiReady = await getApiHealth();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <p className="text-xl font-extrabold tracking-tight text-swedenblue">
            European <span className="text-swedenyellow">Consultant</span>
          </p>
          <h1 className="mt-5 text-2xl font-bold tracking-tight text-ink">
            Admin sign in
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Manage services and appointment pricing.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
          {apiReady ? (
            <LoginForm next={next} />
          ) : (
            <Alert tone="info">
              The API server is not running. Start MongoDB, then run
              npm run dev:api and refresh this page.
            </Alert>
          )}
        </div>
      </div>
    </main>
  );
}
