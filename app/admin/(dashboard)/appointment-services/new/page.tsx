import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import AppointmentServiceForm from "@/components/admin/AppointmentServiceForm";
import { PageHeading } from "@/components/admin/ui";

export default function NewAppointmentServicePage() {
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
        title="Add appointment service"
        description="Create a new visa appointment office card for the public appointment page."
      />

      <AppointmentServiceForm />
    </>
  );
}
