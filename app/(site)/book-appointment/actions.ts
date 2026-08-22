"use server";

import {
  APPOINTMENT_TIME_SLOTS,
  isPaymentCurrency,
  toMinorUnits,
} from "@/lib/payment";
import { getAppointmentPrice } from "@/lib/queries";
import { getStripe } from "@/lib/stripe";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function value(formData: FormData, key: string, maxLength: number) {
  const item = formData.get(key);
  return typeof item === "string" ? item.trim().slice(0, maxLength) : "";
}

export async function createAppointmentPaymentIntent(formData: FormData) {
  const name = value(formData, "name", 120);
  const email = value(formData, "email", 160).toLowerCase();
  const whatsapp = value(formData, "whatsapp", 60);
  const date = value(formData, "date", 10);
  const time = value(formData, "time", 20);
  const message = value(formData, "message", 500);
  const fieldErrors: Record<string, string> = {};

  if (!name) fieldErrors.name = "Full name is required.";
  if (!EMAIL_PATTERN.test(email)) fieldErrors.email = "Enter a valid email.";
  if (!whatsapp) fieldErrors.whatsapp = "WhatsApp number is required.";
  if (!DATE_PATTERN.test(date)) {
    fieldErrors.date = "Choose a valid appointment date.";
  } else {
    const selectedDate = new Date(`${date}T00:00:00Z`);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (selectedDate < today) fieldErrors.date = "Choose a future date.";
  }
  if (
    !APPOINTMENT_TIME_SLOTS.includes(
      time as (typeof APPOINTMENT_TIME_SLOTS)[number]
    )
  ) {
    fieldErrors.time = "Choose a valid appointment time.";
  }
  if (!message) fieldErrors.message = "Tell us how we can help.";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      success: false as const,
      message: "Please correct the highlighted fields.",
      fieldErrors,
    };
  }

  const price = await getAppointmentPrice();

  if (
    !price ||
    price.amount <= 0 ||
    !isPaymentCurrency(price.currency)
  ) {
    return {
      success: false as const,
      message: "Online payment is temporarily unavailable. Please try again later.",
      fieldErrors: {},
    };
  }

  try {
    const paymentIntent = await getStripe().paymentIntents.create({
      amount: toMinorUnits(price.amount),
      currency: price.currency.toLowerCase(),
      payment_method_types: ["card"],
      receipt_email: email,
      description: "European Consultant appointment fee",
      metadata: {
        appointment_name: name,
        appointment_email: email,
        appointment_whatsapp: whatsapp,
        appointment_date: date,
        appointment_time: time,
        appointment_message: message,
      },
    });

    if (!paymentIntent.client_secret) {
      throw new Error("Stripe did not return a client secret.");
    }

    return {
      success: true as const,
      clientSecret: paymentIntent.client_secret,
      amount: price.amount,
      currency: price.currency,
      description: price.description,
    };
  } catch (error) {
    console.error("Unable to create appointment payment:", error);
    return {
      success: false as const,
      message: "We could not start the secure payment. Please try again.",
      fieldErrors: {},
    };
  }
}
