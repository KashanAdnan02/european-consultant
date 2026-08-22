import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { Alert } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Admin Panel | European Consultant",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20">
        <Alert tone="info">
          Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to your environment, run the SQL
          in supabase/schema.sql, then restart the server.
        </Alert>
      </main>
    );
  }

  const session = await requireAdmin();

  return <AdminShell email={session.email}>{children}</AdminShell>;
}
