import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import ServiceForm from "@/components/admin/ServiceForm";
import { PageHeading } from "@/components/admin/ui";

export default function NewServicePage() {
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
        title="Add service"
        description="Publish a new destination with full work permit details."
      />

      <ServiceForm />
    </>
  );
}
