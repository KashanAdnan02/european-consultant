"use server";

import { sendAppointmentNotification } from "@/lib/appointment-email";
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

  if (!price || price.amount <= 0 || !isPaymentCurrency(price.currency)) {
    return {
      success: false as const,
      message:
        "Online payment is temporarily unavailable. Please try again later.",
      fieldErrors: {},
    };
  }

  try {
    const paymentIntent = await getStripe().paymentIntents.create({
      amount: toMinorUnits(price.amount),
      currency: price.currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      receipt_email: email,
      description: "European Consultant appointment fee",
      metadata: {
        appointment_name: name,
        appointment_email: email,
        appointment_whatsapp: whatsapp,
        appointment_date: date,
        appointment_time: time,
        appointment_message: message.slice(0, 490),
        appointment_price_id: String(price.id),
        appointment_amount: String(price.amount),
        appointment_currency: price.currency,
        appointment_fee: `${price.amount} ${price.currency}`,
        notification_sent: "false",
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

export async function submitAppointmentAfterPayment(input: {
  paymentIntentId: string;
  clientSecret: string;
}) {
  const paymentIntentId = input.paymentIntentId.trim();
  const clientSecret = input.clientSecret.trim();

  if (!paymentIntentId.startsWith("pi_") || !clientSecret) {
    return {
      success: false as const,
      status: "invalid" as const,
      message: "Missing payment confirmation details.",
      formSubmitted: false,
    };
  }

  try {
    const paymentIntent =
      await getStripe().paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.client_secret !== clientSecret) {
      return {
        success: false as const,
        status: "invalid" as const,
        message: "Payment could not be verified.",
        formSubmitted: false,
      };
    }

    const appointmentDate = paymentIntent.metadata.appointment_date ?? "";
    const appointmentTime = paymentIntent.metadata.appointment_time ?? "";

    if (paymentIntent.status === "processing") {
      return {
        success: true as const,
        status: "processing" as const,
        appointmentDate,
        appointmentTime,
        formSubmitted: false,
        message:
          "Payment is still processing. Your booking will be submitted after it completes.",
      };
    }

    if (paymentIntent.status !== "succeeded") {
      return {
        success: false as const,
        status: "invalid" as const,
        appointmentDate,
        appointmentTime,
        formSubmitted: false,
        message: "Payment was not completed.",
      };
    }

    if (paymentIntent.metadata.notification_sent === "true") {
      return {
        success: true as const,
        status: "paid" as const,
        appointmentDate,
        appointmentTime,
        formSubmitted: true,
        message: "Appointment booking was already submitted.",
      };
    }

    const metadata = paymentIntent.metadata;

    await sendAppointmentNotification({
      name: metadata.appointment_name ?? "",
      email: metadata.appointment_email ?? "",
      whatsapp: metadata.appointment_whatsapp ?? "",
      date: metadata.appointment_date ?? "",
      time: metadata.appointment_time ?? "",
      message: metadata.appointment_message ?? "",
      priceId: metadata.appointment_price_id ?? "",
      amount: metadata.appointment_amount ?? "",
      currency: metadata.appointment_currency ?? "",
      fee: metadata.appointment_fee ?? "",
      paymentId: paymentIntent.id,
      paymentStatus: paymentIntent.status,
    });

    await getStripe().paymentIntents.update(paymentIntent.id, {
      metadata: {
        ...metadata,
        notification_sent: "true",
      },
    });

    return {
      success: true as const,
      status: "paid" as const,
      appointmentDate,
      appointmentTime,
      formSubmitted: true,
      message: "Payment received and appointment form submitted.",
    };
  } catch (error) {
    console.error("Unable to submit appointment after payment:", error);
    return {
      success: false as const,
      status: "invalid" as const,
      formSubmitted: false,
      message:
        "Payment may have succeeded, but we could not submit the booking form. Please contact us with your payment receipt.",
    };
  }
}
