import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Appointment Payment | European Consultant",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: {
    payment_intent?: string;
    payment_intent_client_secret?: string;
  };
};

export default async function AppointmentPaymentSuccessPage({
  searchParams,
}: PageProps) {
  const paymentIntentId = searchParams.payment_intent;
  const clientSecret = searchParams.payment_intent_client_secret;
  let status: "paid" | "processing" | "invalid" = "invalid";
  let appointmentDate = "";
  let appointmentTime = "";

  if (paymentIntentId?.startsWith("pi_")) {
    try {
      const paymentIntent = await getStripe().paymentIntents.retrieve(
        paymentIntentId
      );

      if (clientSecret && paymentIntent.client_secret === clientSecret) {
        if (paymentIntent.status === "succeeded") status = "paid";
        if (paymentIntent.status === "processing") status = "processing";
        appointmentDate = paymentIntent.metadata.appointment_date ?? "";
        appointmentTime = paymentIntent.metadata.appointment_time ?? "";
      }
    } catch {
      status = "invalid";
    }
  }

  const isPaid = status === "paid";
  const isProcessing = status === "processing";
  const Icon = isPaid ? CheckCircle2 : isProcessing ? Clock3 : XCircle;

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-xl px-4 sm:px-5">
        <div className="rounded-2xl border border-border bg-white p-7 text-center shadow-[0_8px_30px_rgba(0,0,0,0.07)] sm:p-10">
          <Icon
            className={`mx-auto h-16 w-16 ${
              isPaid
                ? "text-emerald-500"
                : isProcessing
                  ? "text-amber-500"
                  : "text-red-500"
            }`}
          />
          <h1 className="mt-5 text-2xl font-extrabold text-ink sm:text-3xl">
            {isPaid
              ? "Payment received"
              : isProcessing
                ? "Payment processing"
                : "Payment not confirmed"}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted">
            {isPaid
              ? "Your appointment request and payment were received. A consultant will confirm your slot on WhatsApp."
              : isProcessing
                ? "Your bank is still processing the payment. We will confirm your appointment after it completes."
                : "We could not verify a successful payment. Return to the booking page and try again."}
          </p>

          {(isPaid || isProcessing) && (appointmentDate || appointmentTime) && (
            <div className="mt-6 rounded-xl bg-slate-50 px-5 py-4 text-sm text-ink">
              <p className="font-bold">Requested appointment</p>
              <p className="mt-1 text-muted">
                {[appointmentDate, appointmentTime].filter(Boolean).join(" at ")}
              </p>
            </div>
          )}

          <Link
            href={isPaid || isProcessing ? "/" : "/book-appointment"}
            className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-swedenyellow px-7 text-sm font-bold text-ink transition hover:bg-swedenyellowDark"
          >
            {isPaid || isProcessing ? "Return home" : "Try payment again"}
          </Link>
        </div>
      </div>
    </section>
  );
}
