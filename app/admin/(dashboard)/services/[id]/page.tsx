import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";
import ServiceForm from "@/components/admin/ServiceForm";
import { PageHeading } from "@/components/admin/ui";
import { getServiceById } from "@/lib/queries";
import { formatDate } from "@/lib/utils";

export default async function EditServicePage({
  params,
}: {
  params: { id: string };
}) {
  const service = await getServiceById(params.id);
  if (!service) notFound();

  return (
    <>
      <Link
        href="/admin/services"
        className="mb-6 inline-flex items-center gap-1 text-sm font-semibold text-slate-500 transition hover:text-swedenblue"
      >
        <ChevronLeft size={16} />
        Back to services
      </Link>

      <PageHeading
        title={service.title || service.country}
        description={`${service.flag ? `${service.flag} ` : ""}Last updated ${formatDate(service.updated_at)}`}
        actions={
          <Link
            href={`/services/${service.slug}`}
            target="_blank"
            className="inline-flex h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ExternalLink size={16} />
            View public page
          </Link>
        }
      />

      <ServiceForm service={service} />
    </>
  );
}
