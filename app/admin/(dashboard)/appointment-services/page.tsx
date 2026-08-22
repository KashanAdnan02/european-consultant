import Link from "next/link";
import { Plus } from "lucide-react";
import AppointmentServicesTable from "@/components/admin/AppointmentServicesTable";
import { Alert, PageHeading } from "@/components/admin/ui";
import { getAppointmentServices } from "@/lib/queries";

const FLASH_MESSAGES: Record<string, string> = {
  created: "Appointment service created successfully.",
  updated: "Appointment service updated successfully.",
  deleted: "Appointment service deleted successfully.",
};

export default async function AdminAppointmentServicesPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const services = await getAppointmentServices();
  const flashKey = Object.keys(FLASH_MESSAGES).find(
    (key) => searchParams[key] === "1"
  );

  return (
    <>
      <PageHeading
        title="Appointment Services"
        description="Manage the visa appointment offices shown on /appointment."
        actions={
          <Link
            href="/admin/appointment-services/new"
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-swedenblue px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-swedenblueDark"
          >
            <Plus size={18} />
            Add office
          </Link>
        }
      />

      {flashKey && (
        <div className="mb-5">
          <Alert tone="success">{FLASH_MESSAGES[flashKey]}</Alert>
        </div>
      )}

      <AppointmentServicesTable services={services} />
    </>
  );
}
