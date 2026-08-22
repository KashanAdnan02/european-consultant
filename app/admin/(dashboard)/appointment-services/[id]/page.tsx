import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";
import AppointmentServiceForm from "@/components/admin/AppointmentServiceForm";
import { PageHeading } from "@/components/admin/ui";
import { getAppointmentServiceById } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export default async function EditAppointmentServicePage({
  params,
}: {
  params: { id: string };
}) {
  const service = await getAppointmentServiceById(params.id);
  if (!service) notFound();

  return (
    <>
      <Link
        href="/admin/appointment-services"
        className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 transition hover:text-swedenblue"
      >
        <ChevronLeft size={16} />
        Back to appointment services
      </Link>

      <PageHeading
        title={service.name}
        description={`Last updated ${formatDate(service.updated_at)}`}
        actions={
          <Link
            href="/appointment"
            target="_blank"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ExternalLink size={16} />
            View appointment page
          </Link>
        }
      />

      <AppointmentServiceForm service={service} />
    </>
  );
}
