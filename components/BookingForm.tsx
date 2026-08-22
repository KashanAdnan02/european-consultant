"use client";

import { type FormEvent, useState } from "react";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementChangeEvent } from "@stripe/stripe-js";
import { ChevronDown, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { createAppointmentPaymentIntent } from "@/app/(site)/book-appointment/actions";
import { APPOINTMENT_TIME_SLOTS } from "@/lib/payment";

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;

const FIELD_CLASS =
  "h-12 w-full rounded-lg border bg-white px-4 text-[15px] text-ink outline-none transition placeholder:text-slate-400 focus:border-swedenblue focus:ring-2 focus:ring-swedenblue/15";

const STRIPE_ELEMENT_STYLE = {
  base: {
    fontSize: "15px",
    color: "#1a2634",
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
    "::placeholder": { color: "#94a3b8" },
  },
  invalid: { color: "#ed1b2f" },
};

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

function StripeField({
  focused,
  invalid,
  children,
}: {
  focused: boolean;
  invalid: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${FIELD_CLASS} flex items-center ${
        invalid
          ? "border-red-400"
          : focused
            ? "border-swedenblue ring-2 ring-swedenblue/15"
            : "border-border"
      }`}
    >
      <div className="w-full">{children}</div>
    </div>
  );
}

function BookingFields() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [cardError, setCardError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [cardComplete, setCardComplete] = useState({
    number: false,
    expiry: false,
    cvc: false,
  });

  function handleCardChange(
    field: "number" | "expiry" | "cvc",
    event: StripeElementChangeEvent
  ) {
    setCardComplete((current) => ({ ...current, [field]: event.complete }));
    if (event.error) {
      setCardError(event.error.message);
      return;
    }
    setCardError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setFieldErrors({});

    if (!stripe || !elements) {
      setFormError("Payment is still loading. Please try again in a moment.");
      return;
    }

    const cardNumber = elements.getElement(CardNumberElement);
    if (!cardNumber) {
      setCardError("Enter your card details to continue.");
      return;
    }

    if (!cardComplete.number || !cardComplete.expiry || !cardComplete.cvc) {
      setCardError("Enter a complete card number, expiry date, and CVC.");
      return;
    }

    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const result = await createAppointmentPaymentIntent(formData);

    if (!result.success) {
      setFormError(result.message);
      setFieldErrors(result.fieldErrors);
      setIsSubmitting(false);
      return;
    }

    const cardholderName = String(formData.get("card_name") ?? "").trim();
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      result.clientSecret,
      {
        payment_method: {
          card: cardNumber,
          billing_details: {
            name: cardholderName,
            email: String(formData.get("email") ?? "").trim(),
          },
        },
      }
    );

    if (stripeError) {
      setCardError(stripeError.message ?? "Your payment could not be completed.");
      setIsSubmitting(false);
      return;
    }

    if (paymentIntent) {
      const params = new URLSearchParams({
        payment_intent: paymentIntent.id,
        payment_intent_client_secret: paymentIntent.client_secret ?? "",
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

      <div className="border-t border-border pt-6">
        <div className="mb-4 flex items-center gap-2">
          <LockKeyhole size={18} className="text-emerald-500" />
          <h2 className="text-xl font-extrabold text-ink">Card details</h2>
        </div>

        <div className="space-y-5">
          <div>
            <Label htmlFor="card_name">Name on card</Label>
            <input
              id="card_name"
              name="card_name"
              type="text"
              autoComplete="cc-name"
              placeholder="Name on card"
              className={`${FIELD_CLASS} border-border`}
              required
            />
          </div>

          <div>
            <Label>Card number</Label>
            <StripeField
              focused={focusedField === "number"}
              invalid={Boolean(cardError) && !cardComplete.number}
            >
              <CardNumberElement
                options={{
                  showIcon: true,
                  placeholder: "ACCT-000015",
                  style: STRIPE_ELEMENT_STYLE,
                }}
                onFocus={() => setFocusedField("number")}
                onBlur={() => setFocusedField("")}
                onChange={(event) => handleCardChange("number", event)}
              />
            </StripeField>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="min-w-0">
              <Label>Expiry date</Label>
              <StripeField
                focused={focusedField === "expiry"}
                invalid={Boolean(cardError) && !cardComplete.expiry}
              >
                <CardExpiryElement
                  options={{
                    placeholder: "MM / YY",
                    style: STRIPE_ELEMENT_STYLE,
                  }}
                  onFocus={() => setFocusedField("expiry")}
                  onBlur={() => setFocusedField("")}
                  onChange={(event) => handleCardChange("expiry", event)}
                />
              </StripeField>
            </div>

            <div className="min-w-0">
              <Label>CVC</Label>
              <StripeField
                focused={focusedField === "cvc"}
                invalid={Boolean(cardError) && !cardComplete.cvc}
              >
                <CardCvcElement
                  options={{
                    placeholder: "CVC",
                    style: STRIPE_ELEMENT_STYLE,
                  }}
                  onFocus={() => setFocusedField("cvc")}
                  onBlur={() => setFocusedField("")}
                  onChange={(event) => handleCardChange("cvc", event)}
                />
              </StripeField>
            </div>
          </div>
        </div>
      </div>

      {(formError || cardError) && (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {formError || cardError}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || !elements || isSubmitting}
        className="inline-flex h-12 w-full items-center justify-center rounded-full bg-swedenyellow px-8 text-sm font-bold text-ink transition hover:bg-swedenyellowDark hover:shadow-[0_6px_20px_rgba(254,204,2,0.35)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {isSubmitting ? "Processing payment..." : "Pay consultation fee"}
      </button>
    </form>
  );
}

export default function BookingForm() {
  if (!stripePromise) {
    return (
      <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        Secure payment is not configured. Please contact us for assistance.
      </p>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <BookingFields />
    </Elements>
  );
}
