import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedServices } from "@/lib/queries";
import { groupServicesByType } from "@/lib/service-types";
import type { ServiceRow } from "@/lib/supabase/database.types";

export const metadata: Metadata = {
  title: "Our Services | European Consultant",
  description:
    "Work permits, tourist visas, business invitations & company formations worldwide — 40+ countries covered.",
};

export const revalidate = 60;

function ServiceGrid({ services }: { services: ServiceRow[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {services.map((service) => (
        <Link
          href={`/services/${service.slug}`}
          key={service.id}
          className="bg-white p-5 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border-l-4 border-swedenyellow hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all"
        >
          <h4 className="text-base text-swedenblue mb-1 font-semibold">
            {service.flag} {service.title}
          </h4>
          <p className="text-sm text-muted">{service.text}</p>
        </Link>
      ))}
    </div>
  );
}

export default async function ServicesPage() {
  const services = await getPublishedServices();
  const grouped = groupServicesByType(services);
  const hasServices = services.length > 0;

  return (
    <div className="animate-fadeIn">
      <section className="bg-gradient-to-br from-swedenblue to-swedenblueDark text-white py-16 md:py-[70px] text-center">
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            Our <span className="text-swedenyellow">Services</span>
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto opacity-90">
            Work permits, tourist visas, business invitations &amp; company
            formations worldwide.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-[70px]">
        <div className="max-w-6xl mx-auto px-4 sm:px-5">
          {!hasServices ? (
            <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center">
              <p className="text-lg font-semibold text-ink">
                Services are being added
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted">
                Published services from the admin panel will appear here,
                grouped by work permit, tourist visa, business invitation and
                company formation.
              </p>
            </div>
          ) : (
            grouped.map((section) => (
              <div key={section.type} className="mb-10 last:mb-0">
                <h3 className="text-xl sm:text-2xl text-swedenblue mb-4 border-b-4 border-swedenyellow pb-2 inline-block font-bold">
                  {section.emoji} {section.heading}
                </h3>
                {section.services.length > 0 ? (
                  <ServiceGrid services={section.services} />
                ) : (
                  <p className="text-sm text-muted">
                    No services in this category yet.
                  </p>
                )}
              </div>
            ))
          )}

          <div className="text-center mt-10">
            <p className="text-muted">
              📞 Need a service not listed?{" "}
              <Link href="/contact" className="text-swedenblue font-semibold">
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
