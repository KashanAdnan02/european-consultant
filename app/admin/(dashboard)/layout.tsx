import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import { Alert } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { getApiHealth } from "@/lib/queries";

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
  const apiReady = await getApiHealth();
  if (!apiReady) {
    return (
      <main className="mx-auto max-w-xl px-4 py-20">
        <Alert tone="info">
          The API server is not running. Start MongoDB, then run
          <code className="mx-1">npm run dev:api</code>
          and refresh this page.
        </Alert>
      </main>
    );
  }

  const session = await requireAdmin();

  return <AdminShell email={session.email}>{children}</AdminShell>;
}
