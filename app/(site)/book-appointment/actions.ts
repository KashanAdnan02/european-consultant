"use server";

import { apiFetch } from "@/lib/api";

type PaymentIntentResult =
  | {
      success: true;
      clientSecret: string;
      amount?: number;
      currency?: string;
      description?: string;
    }
  | {
      success: false;
      message: string;
      fieldErrors: Record<string, string>;
    };

const PAYMENT_START_ERROR: PaymentIntentResult = {
  success: false,
  message: "We could not start the secure payment. Please try again.",
  fieldErrors: {},
};

const PAYMENT_CONFIRM_ERROR = {
  success: false as const,
  status: "invalid" as const,
  formSubmitted: false,
  message:
    "Payment may have succeeded, but we could not submit the booking form. Please contact us with your payment receipt.",
};

export async function createAppointmentPaymentIntent(
  formData: FormData
): Promise<PaymentIntentResult> {
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    whatsapp: formData.get("whatsapp"),
    date: formData.get("date"),
    time: formData.get("time"),
    message: formData.get("message"),
  };

  try {
    const { data } = await apiFetch<{
      success: boolean;
      message?: string;
      fieldErrors?: Record<string, string>;
      clientSecret?: string;
      amount?: number;
      currency?: string;
      description?: string;
    }>("/api/public/payments/intent", {
      method: "POST",
      revalidate: false,
      body: JSON.stringify(payload),
    });

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return PAYMENT_START_ERROR;
    }

    if (data.success && data.clientSecret) {
      return {
        success: true,
        clientSecret: data.clientSecret,
        amount: data.amount,
        currency: data.currency,
        description: data.description,
      };
    }

    return {
      success: false,
      message:
        data.message || "We could not start the secure payment. Please try again.",
      fieldErrors: data.fieldErrors || {},
    };
  } catch (error) {
    console.error("Unable to create appointment payment:", error);
    return PAYMENT_START_ERROR;
  }
}

export async function submitAppointmentAfterPayment(input: {
  paymentIntentId: string;
  clientSecret: string;
}) {
  try {
    const { data } = await apiFetch<{
      success: boolean;
      status?: "paid" | "processing" | "invalid";
      message?: string;
      formSubmitted?: boolean;
      appointmentDate?: string;
      appointmentTime?: string;
    }>("/api/public/payments/confirm", {
      method: "POST",
      revalidate: false,
      body: JSON.stringify(input),
    });

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return PAYMENT_CONFIRM_ERROR;
    }

    return data;
  } catch (error) {
    console.error("Unable to submit appointment after payment:", error);
    return PAYMENT_CONFIRM_ERROR;
  }
}
