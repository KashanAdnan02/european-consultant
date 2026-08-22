import { slugify } from "@/lib/utils";
import {
  SERVICE_TYPE_VALUES,
  type ServiceType,
} from "@/lib/service-types";
import { isPaymentCurrency } from "@/lib/payment";
import type { ServiceInsert } from "@/lib/supabase/database.types";

export type FieldErrors = Record<string, string>;

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; fieldErrors: FieldErrors };

const MAX_SHORT = 160;
const MAX_LONG = 2000;

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export type ServicePayload = ServiceInsert;

const MAX_FLAG = 8;
const MAX_CARD_TEXT = 240;

export function parseServiceForm(
  formData: FormData
): ValidationResult<ServicePayload> {
  const fieldErrors: FieldErrors = {};

  const country = text(formData, "country");
  const title = text(formData, "title");
  const flag = text(formData, "flag");
  const cardText = text(formData, "text");
  const type = text(formData, "type");
  const jobs = text(formData, "jobs");
  const salary = text(formData, "salary");
  const accommodation = text(formData, "accommodation");
  const medicalInsurance = text(formData, "medical_insurance");
  const documentRequirements = text(formData, "document_requirements");
  const processTime = text(formData, "process_time");
  const cost = text(formData, "cost");

  if (!country) {
    fieldErrors.country = "Country is required.";
  } else if (country.length > MAX_SHORT) {
    fieldErrors.country = `Country must be under ${MAX_SHORT} characters.`;
  }

  if (!title) {
    fieldErrors.title = "Title is required.";
  } else if (title.length > MAX_SHORT) {
    fieldErrors.title = `Title must be under ${MAX_SHORT} characters.`;
  } else if (!slugify(title)) {
    fieldErrors.title = "Title must contain letters or numbers.";
  }

  if (!flag) {
    fieldErrors.flag = "Flag emoji is required.";
  } else if (flag.length > MAX_FLAG) {
    fieldErrors.flag = "Use a single flag emoji.";
  }

  if (!cardText) {
    fieldErrors.text = "Short description is required.";
  } else if (cardText.length > MAX_CARD_TEXT) {
    fieldErrors.text = `Description must be under ${MAX_CARD_TEXT} characters.`;
  }

  if (!type) {
    fieldErrors.type = "Service type is required.";
  } else if (!SERVICE_TYPE_VALUES.includes(type as ServiceType)) {
    fieldErrors.type = "Choose a valid service type.";
  }

  const longFields: Array<[string, string, string]> = [
    ["jobs", jobs, "Jobs"],
    ["salary", salary, "Salary"],
    ["accommodation", accommodation, "Accommodation"],
    ["medical_insurance", medicalInsurance, "Medical & insurance"],
    ["document_requirements", documentRequirements, "Document requirements"],
    ["process_time", processTime, "Process time"],
    ["cost", cost, "Cost"],
  ];

  for (const [key, value, label] of longFields) {
    if (!value) {
      fieldErrors[key] = `${label} is required.`;
    } else if (value.length > MAX_LONG) {
      fieldErrors[key] = `${label} must be under ${MAX_LONG} characters.`;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  return {
    success: true,
    data: {
      country,
      title,
      flag,
      text: cardText,
      type,
      slug: slugify(title),
      jobs,
      salary,
      accommodation,
      medical_insurance: medicalInsurance,
      document_requirements: documentRequirements,
      process_time: processTime,
      cost,
      is_published: formData.get("is_published") !== null,
    },
  };
}

export type AppointmentPricePayload = {
  amount: number;
  currency: string;
  description: string;
};

const CURRENCY_PATTERN = /^[A-Z]{3}$/;

export function parseAppointmentPriceForm(
  formData: FormData
): ValidationResult<AppointmentPricePayload> {
  const fieldErrors: FieldErrors = {};

  const rawAmount = text(formData, "amount");
  const currency = text(formData, "currency").toUpperCase();
  const description = text(formData, "description");

  const amount = Number(rawAmount);

  if (!rawAmount) {
    fieldErrors.amount = "Amount is required.";
  } else if (!Number.isFinite(amount) || amount <= 0) {
    fieldErrors.amount = "Amount must be greater than zero.";
  } else if (amount > 1_000_000) {
    fieldErrors.amount = "Amount is unrealistically high.";
  }

  if (!CURRENCY_PATTERN.test(currency)) {
    fieldErrors.currency = "Use a 3-letter currency code such as EUR.";
  } else if (!isPaymentCurrency(currency)) {
    fieldErrors.currency = "Choose EUR, USD, GBP, SEK, or PKR.";
  }

  if (description.length > MAX_SHORT * 2) {
    fieldErrors.description = "Description is too long.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  return {
    success: true,
    data: {
      amount: Math.round(amount * 100) / 100,
      currency,
      description,
    },
  };
}
