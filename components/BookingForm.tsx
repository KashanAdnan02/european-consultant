"use client";

import { type FormEvent, useMemo, useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { ChevronDown, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { createAppointmentPaymentIntent, submitAppointmentAfterPayment } from "@/app/(site)/book-appointment/actions";
import { APPOINTMENT_TIME_SLOTS } from "@/lib/payment";

const FIELD_CLASS =
  "h-12 w-full rounded-lg border bg-white px-4 text-[15px] text-ink outline-none transition placeholder:text-slate-400 focus:border-swedenblue focus:ring-2 focus:ring-swedenblue/15";

function Label({
  htmlFor,
  children,
  required = true,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-semibold text-ink"
    >
      {children} {required && <span className="text-[#ed1b2f]">*</span>}
    </label>
  );
}

function BookingFields({ formattedFee }: { formattedFee: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setPaymentError("");
    setFieldErrors({});

    if (!stripe || !elements) {
      setFormError("Payment is still loading. Please try again in a moment.");
      return;
    }

    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const { error: submitError } = await elements.submit();

    if (submitError) {
      setPaymentError(
        submitError.message ?? "Check your payment details and try again."
      );
      setIsSubmitting(false);
      return;
    }

    const result = await createAppointmentPaymentIntent(formData);

    if (!result.success) {
      setFormError(result.message);
      setFieldErrors(result.fieldErrors);
      setIsSubmitting(false);
      return;
    }

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret: result.clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/book-appointment/success`,
        payment_method_data: {
          billing_details: {
            email: String(formData.get("email") ?? "").trim(),
          },
        },
      },
      redirect: "if_required",
    });

    if (stripeError) {
      setPaymentError(
        stripeError.message ?? "Your payment could not be completed."
      );
      setIsSubmitting(false);
      return;
    }

    if (paymentIntent) {
      const clientSecret = paymentIntent.client_secret ?? result.clientSecret;

      await submitAppointmentAfterPayment({
        paymentIntentId: paymentIntent.id,
        clientSecret,
      });

      const params = new URLSearchParams({
        payment_intent: paymentIntent.id,
        payment_intent_client_secret: clientSecret,
      });
      router.push(`/book-appointment/success?${params.toString()}`);
      return;
    }

    setFormError("Your payment status could not be confirmed. Please try again.");
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full min-w-0 space-y-6">
      <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
        <div className="min-w-0">
          <Label htmlFor="name">Full Name</Label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Full Name"
            className={`${FIELD_CLASS} ${
              fieldErrors.name ? "border-red-400" : "border-border"
            }`}
            required
          />
          {fieldErrors.name && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
          )}
        </div>

        <div className="min-w-0">
          <Label htmlFor="email">Your Email</Label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={`${FIELD_CLASS} ${
              fieldErrors.email ? "border-red-400" : "border-border"
            }`}
            required
          />
          {fieldErrors.email && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="whatsapp">Whatsapp Number</Label>
        <input
          id="whatsapp"
          name="whatsapp"
          type="tel"
          autoComplete="tel"
          placeholder="+92 301 2345678"
          className={`${FIELD_CLASS} ${
            fieldErrors.whatsapp ? "border-red-400" : "border-border"
          }`}
          required
        />
        {fieldErrors.whatsapp && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.whatsapp}</p>
        )}
      </div>

      <div className="grid gap-5 sm:gap-6 md:grid-cols-2">
        <div className="min-w-0">
          <Label htmlFor="date">Appointment Date</Label>
          <input
            id="date"
            name="date"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            className={`${FIELD_CLASS} ${
              fieldErrors.date ? "border-red-400" : "border-border"
            }`}
            required
          />
          {fieldErrors.date && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.date}</p>
          )}
        </div>

        <div className="min-w-0">
          <Label htmlFor="time">Appointment Time</Label>
          <div className="relative">
            <select
              id="time"
              name="time"
              defaultValue=""
              className={`${FIELD_CLASS} ${
                fieldErrors.time ? "border-red-400" : "border-border"
              } appearance-none pr-10`}
              required
            >
              <option value="" disabled>
                Select a time slot
              </option>
              {APPOINTMENT_TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
            <ChevronDown
              size={18}
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
          </div>
          {fieldErrors.time && (
            <p className="mt-1 text-sm text-red-600">{fieldErrors.time}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="message">Your Message</Label>
        <textarea
          id="message"
          name="message"
          rows={5}
          maxLength={500}
          placeholder="Tell us which country and service you are interested in."
          className={`w-full resize-y rounded-lg border bg-white p-4 text-[15px] leading-relaxed text-ink outline-none transition placeholder:text-slate-400 focus:border-swedenblue focus:ring-2 focus:ring-swedenblue/15 ${
            fieldErrors.message ? "border-red-400" : "border-border"
          }`}
          required
        />
        {fieldErrors.message && (
          <p className="mt-1 text-sm text-red-600">{fieldErrors.message}</p>
        )}
      </div>

      <div className="border-t border-border pt-7">
        <div>
          <Label htmlFor="appointment_fee">Appointment Fee</Label>
          <div
            id="appointment_fee"
            className="flex h-16 w-full items-center border border-slate-300 bg-white px-5 text-lg font-medium text-ink shadow-sm"
          >
            {formattedFee}
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-5 flex items-center gap-2">
            <LockKeyhole size={20} className="text-emerald-500" />
            <h2 className="text-xl font-extrabold text-ink">
              Pay {formattedFee} Fee <span className="text-[#ed1b2f]">*</span>
            </h2>
          </div>

          <PaymentElement
            options={{
              layout: {
                type: "accordion",
                defaultCollapsed: false,
                radios: "never",
                spacedAccordionItems: true,
              },
              paymentMethodOrder: ["link", "card"],
            }}
            onChange={(event) => {
              if (event.complete) setPaymentError("");
            }}
          />
        </div>
      </div>

      {(formError || paymentError) && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {formError || paymentError}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-swedenyellow px-8 text-sm font-bold text-ink transition hover:bg-swedenyellowDark hover:shadow-[0_6px_20px_rgba(254,204,2,0.35)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "Processing payment..." : `Pay ${formattedFee}`}
      </button>
    </form>
  );
}

interface BookingFormProps {
  stripePublishableKey?: string;
  amount?: number;
  currency?: string;
}

export default function BookingForm({
  stripePublishableKey,
  amount,
  currency,
}: BookingFormProps) {
  const stripePromise = useMemo(
    () =>
      stripePublishableKey ? loadStripe(stripePublishableKey) : null,
    [stripePublishableKey]
  );
  const formattedFee = useMemo(() => {
    if (!amount || !currency) return "";

    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(amount);
  }, [amount, currency]);

  if (!stripePromise || !amount || amount <= 0 || !currency) {
    return (
      <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        Secure payment is not configured. Please contact us for assistance.
      </p>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#005293",
            colorText: "#1a2634",
            colorDanger: "#ed1b2f",
            colorBackground: "#ffffff",
            borderRadius: "2px",
            fontSizeBase: "16px",
            spacingUnit: "5px",
          },
          rules: {
            ".Input": {
              border: "1px solid #cbd5e1",
              boxShadow: "none",
              padding: "16px 18px",
            },
            ".Input:focus": {
              border: "1px solid #005293",
              boxShadow: "0 0 0 2px rgba(0, 82, 147, 0.12)",
            },
            ".Label": {
              fontWeight: "600",
            },
          },
        },
      }}
    >
      <BookingFields formattedFee={formattedFee} />
    </Elements>
  );
}
