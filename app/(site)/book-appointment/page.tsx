import type { Metadata } from "next";
import BookingForm from "@/components/BookingForm";
import { getAppointmentPrice } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Book an Appointment | European Consultant",
  description:
    "Book a consultation with European Consultant for work permits, tourist visas and relocation support.",
};

export const revalidate = 60;

export default async function BookAppointmentPage() {
  const price = await getAppointmentPrice();
  const hasFee = Boolean(price && price.amount > 0);

  return (
    <div className="animate-fadeIn">
      <section className="bg-gradient-to-br from-swedenblue to-swedenblueDark py-14 text-center text-white md:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-5">
          <h1 className="text-3xl font-extrabold sm:text-4xl md:text-5xl">
            Book Your <span className="text-swedenyellow">Appointment</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base opacity-90 md:text-lg">
            Pick a date and time, then pay the consultation fee securely. Our
            consultants will confirm on WhatsApp.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:px-5 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0 rounded-2xl border border-border bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] sm:p-6 md:p-9">
            <BookingForm />
          </div>

          <aside className="min-w-0 space-y-5">
            {hasFee && price && (
              <div className="rounded-2xl border-l-4 border-swedenyellow bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.05)] sm:p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">
                  Consultation Fee
                </p>
                <p className="mt-2 text-3xl font-extrabold text-swedenblue">
                  {formatPrice(price.amount, price.currency)}
                </p>
                {price.description && (
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {price.description}
                  </p>
                )}
              </div>
            )}

            <div className="rounded-2xl bg-swedenblue p-5 text-white sm:p-6">
              <p className="text-sm font-bold uppercase tracking-widest text-swedenyellow">
                What happens next
              </p>
              <ol className="mt-4 space-y-3 text-sm leading-relaxed opacity-95">
                <li>1. Enter your preferred appointment details.</li>
                <li>2. Pay the consultation fee securely by card.</li>
                <li>3. A consultant confirms your slot on WhatsApp.</li>
              </ol>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
