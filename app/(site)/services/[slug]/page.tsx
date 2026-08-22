import type { Metadata } from "next";
import Link from "next/link";
import { getAppointmentPrice, getPublishedServiceBySlug } from "@/lib/queries";
import { serviceTypeLabel } from "@/lib/service-types";
import type { ServiceRow } from "@/lib/supabase/database.types";
import { formatPrice, slugify } from "@/lib/utils";

export const revalidate = 60;

type PageProps = { params: { slug: string } };

const DETAIL_SECTIONS: Array<{ key: keyof ServiceRow; label: string }> = [
  { key: "jobs", label: "Jobs" },
  { key: "salary", label: "Salary" },
  { key: "accommodation", label: "Accommodation" },
  { key: "medical_insurance", label: "Medical & Insurance" },
  { key: "document_requirements", label: "Document Requirements" },
  { key: "process_time", label: "Process Time" },
  { key: "cost", label: "Cost" },
];

function titleFromSlug(slug: string) {
  return decodeURIComponent(slug)
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const service = await getPublishedServiceBySlug(slugify(params.slug));
  const displayTitle =
    service?.title || service?.country || titleFromSlug(params.slug);

  return {
    title: `${displayTitle} | European Consultant`,
    description: service
      ? `${displayTitle} — ${service.text || "jobs, salary, accommodation, documents, process time and cost."}`
      : `Visa and relocation guidance for ${displayTitle} from European Consultant.`,
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const slug = slugify(params.slug);
  const [service, price] = await Promise.all([
    getPublishedServiceBySlug(slug),
    getAppointmentPrice(),
  ]);

  const displayTitle =
    service?.title || service?.country || titleFromSlug(params.slug);
  const typeLabel = service?.type
    ? serviceTypeLabel(service.type)
    : "Visa Service";

  return (
    <div className="animate-fadeIn">
      <section className="bg-gradient-to-br from-swedenblue to-swedenblueDark py-14 text-center text-white md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-swedenyellow">
            {typeLabel}
          </p>
          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl md:text-5xl">
            {service?.flag ? `${service.flag} ` : ""}
            {displayTitle}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base opacity-90 md:text-lg">
            {service?.text ||
              "Complete details on jobs, salary, documents, timelines and costs."}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-5">
          {service ? (
            <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
              <dl className="divide-y divide-border">
                {DETAIL_SECTIONS.map(({ key, label }) => {
                  const value = String(service[key] ?? "").trim();
                  if (!value) return null;

                  return (
                    <div
                      key={key}
                      className="grid gap-2 px-5 py-6 sm:grid-cols-[200px_1fr] sm:gap-6 sm:px-6 md:grid-cols-[220px_1fr] md:px-8"
                    >
                      <dt className="text-sm font-bold uppercase tracking-wide text-swedenblue">
                        {label}
                      </dt>
                      <dd className="min-w-0 whitespace-pre-line break-words text-[15px] leading-relaxed text-muted">
                        {value}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </article>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center md:px-10">
              <h2 className="text-xl font-bold text-ink">
                Details for {displayTitle} are being finalised
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-muted">
                Our team is preparing the latest jobs, salary and document
                requirements for this destination. Contact us and we will share
                the full package with you directly.
              </p>
            </div>
          )}

          {price && price.amount > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-l-4 border-swedenyellow bg-white px-5 py-5 shadow-[0_2px_10px_rgba(0,0,0,0.05)] sm:px-6">
              <div>
                <p className="text-sm font-semibold text-ink">
                  Consultation appointment fee
                </p>
                {price.description && (
                  <p className="mt-1 text-sm text-muted">{price.description}</p>
                )}
              </div>
              <p className="text-2xl font-extrabold text-swedenblue">
                {formatPrice(price.amount, price.currency)}
              </p>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
            <Link
              href="/appointment"
              className="inline-flex h-12 items-center justify-center rounded-full bg-swedenyellow px-7 text-sm font-bold text-ink transition hover:bg-swedenyellowDark hover:shadow-[0_6px_20px_rgba(254,204,2,0.35)]"
            >
              Book Your Appointment
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full bg-swedenblue px-7 text-sm font-bold text-white transition hover:bg-swedenblueDark"
            >
              Talk To A Consultant
            </Link>
            <Link
              href="/services"
              className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-white px-7 text-sm font-bold text-ink transition hover:bg-lightbg"
            >
              All Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
