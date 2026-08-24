import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ChevronUp, MessageSquare } from "lucide-react";
import { getPublishedAppointmentServices } from "@/lib/queries";
import type { AppointmentServiceRow } from "@/lib/types";

export const metadata: Metadata = {
  title: "Visa Appointment Services | European Consultant",
  description:
    "Book professional visa appointment assistance for Portugal, Pakistan, Germany, Sweden and more.",
  alternates: { canonical: "/appointment" },
};

export const revalidate = 60;

export default async function AppointmentPage() {
  const offices = await getPublishedAppointmentServices();

  return (
    <main className="min-h-screen bg-white">
      <section className="relative bg-[#e4003b] px-4 py-10 text-white sm:py-12">
        <button
          type="button"
          className="absolute right-3 top-3 flex h-[38px] items-center gap-2 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm sm:right-[18px] sm:top-[10px]"
        >
          <span className="text-[22px] leading-none">🇬🇧</span>
          <span>EN</span>
          <ChevronUp size={15} strokeWidth={2} />
        </button>

        <div className="mt-10 flex flex-col items-center justify-center sm:mt-0">
          <h1 className="text-center text-2xl font-bold leading-tight sm:text-[30px] sm:leading-[36px]">
            Visa Appointment Services
          </h1>
          <p className="mt-3 max-w-[540px] text-center text-[15px] leading-[22px] sm:text-[16px]">
            We provide professional visa appointment assistance for the
            following offices.
          </p>
        </div>
      </section>

      <section className="px-4 py-8 sm:px-5">
        {offices.length === 0 ? (
          <div className="mx-auto max-w-[735px] rounded-[11px] border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
            <h2 className="text-lg font-bold text-[#101010]">
              Appointment offices coming soon
            </h2>
            <p className="mt-3 text-[15px] leading-[26px] text-[#626773]">
              Add offices from the admin dashboard to show them here.
            </p>
          </div>
        ) : (
          <div className="mx-auto grid w-full max-w-[735px] grid-cols-1 gap-6 sm:grid-cols-2">
            {offices.map((office, index) => (
              <VisaCard
                key={office.id}
                office={office}
                priority={index === 0}
              />
            ))}
          </div>
        )}
      </section>

      <button
        type="button"
        aria-label="Open chat"
        className="fixed bottom-5 right-5 z-50 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#4dd994] text-white shadow-lg transition-transform duration-200 hover:scale-105 sm:right-6"
      >
        <MessageSquare size={23} fill="white" strokeWidth={1.5} />
      </button>
    </main>
  );
}

function VisaCard({
  office,
  priority = false,
}: {
  office: AppointmentServiceRow;
  priority?: boolean;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[11px] border border-gray-200 bg-white p-4 shadow-[0_2px_10px_rgba(0,0,0,0.25)] sm:p-[20px]">
      <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-auto sm:h-[234px]">
        <Image
          src={office.flag_image}
          alt={office.name}
          fill
          priority={priority}
          unoptimized={office.flag_image.startsWith("http")}
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 350px"
        />
      </div>

      <div className="flex flex-1 flex-col pt-[16px]">
        <h2 className="text-[18px] font-bold leading-[24px] text-[#101010] sm:max-w-[290px] sm:text-[20px] sm:leading-[26px]">
          {office.name}
        </h2>

        <p className="mt-4 text-[15px] leading-[26px] text-[#626773] sm:mt-[20px] sm:min-h-[47px] sm:leading-[28px]">
          {office.description}
        </p>

        <Link
          href="/book-appointment"
          className="mt-[17px] inline-block self-start rounded-[3px] bg-[#ff4d4d] px-[19px] py-[11px] text-[14px] font-medium text-white transition-colors duration-200 hover:bg-[#ed3e3e]"
        >
          Book Appointment
        </Link>
      </div>
    </div>
  );
}
