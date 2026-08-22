import Link from "next/link";
import { Plus } from "lucide-react";
import ServicesTable from "@/components/admin/ServicesTable";
import { Alert, PageHeading } from "@/components/admin/ui";
import { getServices } from "@/lib/queries";

const FLASH_MESSAGES: Record<string, string> = {
  created: "Service created successfully.",
  updated: "Service updated successfully.",
  deleted: "Service deleted successfully.",
};

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const services = await getServices();
  const flashKey = Object.keys(FLASH_MESSAGES).find(
    (key) => searchParams[key] === "1"
  );

  return (
    <>
      <PageHeading
        title="Services"
        description="Create and manage the service pages shown on your website."
        actions={
          <Link
            href="/admin/services/new"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-swedenblue px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-swedenblueDark"
          >
            <Plus size={18} />
            Add service
          </Link>
        }
      />

      {flashKey && (
        <div className="mb-5">
          <Alert tone="success">{FLASH_MESSAGES[flashKey]}</Alert>
        </div>
      )}

      <ServicesTable services={services} />
    </>
  );
}
